
const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');
const cds = require('@sap/cds');
const { SELECT, UPDATE } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(function () {

    const { Sales, SalesItems, SalesPayStatus, SalesReturns, SalesReturnStatus, Items, MockCustomers, RetailLedger, Departments, PassbookEntryTypes, Inventory } = this.entities;


    this.on('generateInvoice', async (req) => {
        const saleId = req.params[0].ID;

        // 1. Fetch Sales data with Items and the actual Name from the Item association
        // We also expand the status associations to get the string values
        const saleData = await SELECT.one.from(Sales, s => {
            s.ID,
                s.customer(c => { c.customername }), // Assuming MockCustomers has a 'name' field

                s.items(si => {
                    si.quantity,
                        si.sellingPrice,
                        si.totalAmount,
                        si.totalPayableAmount,
                        si.item(i => { i.itemName }) // Adjust 'name' to whatever field exists in your Items entity
                })
        }).where({ ID: saleId });

        if (!saleData) return req.error(404, 'Sale not found');

        // 2. Setup PDF Generation
        const stream = new PassThrough();
        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(stream);

        // --- HEADER ---
        doc.fontSize(20).text('RETAIL INVOICE', { align: 'center' }).moveDown();

        // --- CUSTOMER INFO ---
        doc.fontSize(10).font('Helvetica-Bold').text('Customer Details:');
        doc.font('Helvetica').text(`Name: ${saleData.customer?.customername || 'Walk-in Customer'}`);
        doc.text(`Invoice ID: ${saleData.ID}`);

        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        // --- TABLE HEADER ---
        const tableTop = 200;
        doc.font('Helvetica-Bold');
        doc.text('Item Name', 50, tableTop);
        doc.text('Qty', 280, tableTop);
        doc.text('Price', 350, tableTop);
        doc.text('Total', 450, tableTop);
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        // --- TABLE ROWS ---
        let y = tableTop + 30;
        doc.font('Helvetica');

        let grandTotal = 0;

        saleData.items.forEach(lineItem => {
            doc.text(lineItem.item?.itemName || 'Unknown Item', 50, y);
            doc.text(lineItem.quantity.toString(), 280, y);
            doc.text(Number(lineItem.sellingPrice).toFixed(2), 350, y);
            doc.text(Number(lineItem.totalPayableAmount).toFixed(2), 450, y);

            grandTotal += Number(lineItem.totalPayableAmount);
            y += 20;

            // Handle page overflow if many items exist
            if (y > 700) { doc.addPage(); y = 50; }
        });

        // --- FINAL TOTALS ---
        const summaryY = y + 20;
        doc.moveTo(350, summaryY).lineTo(550, summaryY).stroke();

        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('Grand Total:', 350, summaryY + 15);
        doc.text(`INR ${grandTotal.toFixed(2)}`, 450, summaryY + 15);

        doc.end();

        // 3. Return the PDF as a downloadable stream
        return {
            value: stream,
            $mediaContentType: 'application/pdf',
            $mediaContentDisposition: `attachment; filename="Invoice_${saleData.ID}.pdf"`
        };
    });



    this.before('CREATE', 'Sales', async (req) => {
        // req.data "IS" the Sales record. 
        // It contains 'customer_ID', 'paymentStatus_ID', and 'items'.
        const { items } = req.data;
        for (const item of items) {
            //fetch iteminfo
            const itemInfo = await SELECT.one.from(Items).where({ ID: item.item_ID });
            if (!itemInfo) {
                return req.error(404, "Item Not Found")
            }

            //just double checking stock availability
            const inventoryQuantity = await SELECT.one.from(Inventory).where({ inventoryItem_ID: itemInfo.ID })
            if (itemInfo.quantity > inventoryQuantity.quantity) {
                return req.error(400, `LOWSTOCK. Only ${inventoryQuantity.quantity} units available`)
            }

            const totalCostPricePerUnit = (itemInfo.itemBasePrice + ((itemInfo.itemBasePrice * itemInfo.gstPercent) / 100))
            item.sellingPrice = totalCostPricePerUnit + (totalCostPricePerUnit * itemInfo.marginPercent / 100);

            item.totalAmount = item.quantity * item.sellingPrice;
            const discountAmt = (item.totalAmount * item.discountPercent) / 100;
            item.totalPayableAmount = item.totalAmount - discountAmt;
        }
    });

    this.on('checkStockAvailability', async (req) => {
        const { ID } = req.params[1]  //id of salesitems

        const salesItemsRecord = await SELECT.one.from(req.target).where({ ID: ID })
        if (!salesItemsRecord) {
            return req.error(404, "SalesItem Not found")
        }

        const inventoryQuantity = await SELECT.one.from(Inventory).where({ inventoryItem_ID: salesItemsRecord.item_ID })
        if (salesItemsRecord.quantity > inventoryQuantity.quantity) {
            return req.error(400, `LOWSTOCK. Only ${inventoryQuantity.quantity} units available`)
        } else req.info("Available")
    })

    this.on('addnewCustomer', async (req) => {
        const { customername, city, contactNumber } = req.data;
        await INSERT.into(MockCustomers).entries({
            customername: customername,
            city: city,
            contactNumber: contactNumber
        })

        req.info("Customer Added. Proceed")
    })

    this.on('payForPurchase', async (req) => {
        const { ID } = req.params[0];  //id of the saleRecord

        const saleRecord = await SELECT.one.from(Sales).where({ ID: ID }).columns(record => {
            record('*'), // Get all fields
                record.items('*') // Expand and get all fields from items
        });

        if (!saleRecord) {
            return req.error(404, "Sales Not Found")
        }

        let purchasePayStatus = await SELECT.one.from(SalesPayStatus).where({ payStatus: "Paid" })
        if (!purchasePayStatus) {
            return req.error(404, "Status Not found")
        }
        if(saleRecord.paymentStatus_ID === purchasePayStatus.ID ){
            return req.error(404,"Purchase Already Paid")
        }
        await UPDATE(Sales).set({ paymentStatus_ID: purchasePayStatus.ID }).where({ ID: ID })
        req.info("Purchase Paid")
        for (const item of saleRecord.items) {
            updateLedger(item, req, "SALES", "CREDIT");
            req.info("Ledger Updated")
            updateInventory(item, req, "Purchase");
            req.info("Inventory Updated")
        }

        return await SELECT.one.from(Sales).where({ ID: ID })




    })


    async function updateLedger(item, req, department, transactionType) {
        const deptRecord = await SELECT.one.from(Departments).where({ dept: department });
        if (!deptRecord) return req.error(400, 'Invalid Department');

        const debitRecord = await SELECT.one.from(PassbookEntryTypes).where({ entryType: transactionType })
        if (!debitRecord) return req.error(400, `${transactionType} not found`)

        const lastEntry = await SELECT.one.from(RetailLedger)
            .columns('currentBalance')
            .orderBy('createdAt desc');

        const previousBalance = lastEntry ? Number(lastEntry.currentBalance) : 0;
        let newBalance;
        if (transactionType === "CREDIT")
            newBalance = previousBalance + item.totalPayableAmount;
        else if(transactionType === "DEBIT")
            newBalance = previousBalance - item.totalPayableAmount;



            await INSERT.into(RetailLedger).entries({
                entryType_ID: debitRecord.ID,
                department_ID: deptRecord.ID,
                amount: item.totalPayableAmount,
                currentBalance: newBalance
            })
    }


    async function updateInventory(item, req, action) {
        const existingStock = await SELECT.one.from(Inventory).where({ inventoryItem_ID: item.item_ID })
        if (existingStock) {
            if (action === "Purchase") {
                await UPDATE(Inventory).set({
                    quantity: { '-=': item.quantity },
                }).where({ ID: existingStock.ID })
            } else if (action === "Return") {
                await UPDATE(Inventory).set({
                    quantity: { '+=': item.quantity },
                }).where({ ID: existingStock.ID })
            }
        }
    }

    this.on('returnEntirePurchase', async (req) => {
        const { ID } = req.params[0]; //sales id
        const salesRecord = await SELECT.one.from(Sales).where({ ID: ID })
            .columns(record => {
                record('*');               // All fields from Sales
                record.items(item => {      // Expand the 'items' composition
                    item('*');             // All fields from SalesItems
                });
            });
        if (!salesRecord) {
            return req.error(400, "Sales not found")
        }

        const salesReturnRecord = await SELECT.one.from(SalesReturnStatus).where({ retStatus: 'CompleteReturn' })
        if (!salesReturnRecord) {
            return req.error(404, "Return record not found")
        }
        if(salesRecord.returnStatus_ID === salesReturnRecord.ID){
            return req.error(400,"Purchase already returned")
        }
        await UPDATE(Sales).set({ returnStatus_ID: salesReturnRecord.ID }).where({ ID: ID })

        const returnItemArray = [];
        for (const item of salesRecord.items) {
            returnItemArray.push({
                saleitem_ID: item.ID,
                quantity: item.quantity
            })
            //update inventory
            updateInventory(item, req, "Return");
            updateLedger(item, req, "SALES", "DEBIT")

        }

        await INSERT.into(SalesReturns).entries({
            originalSales_ID: ID,
            returnItems: returnItemArray
        })

        req.info("Order Returned | Inventory Updated | Ledger Updated")


    })

});




