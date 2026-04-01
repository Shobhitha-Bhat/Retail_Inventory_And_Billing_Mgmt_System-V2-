
const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');
const cds = require('@sap/cds');
const { SELECT, UPDATE, DELETE } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(function () {

    const { Sales, SalesItems, SalesItemStatus, SalesReturnItems, SalesPayStatus, SalesReturns, SalesReturnStatus, Items, MockCustomers, RetailLedger, Departments, PassbookEntryTypes, Inventory } = this.entities;


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



    this.before(['CREATE', 'UPDATE'], 'Sales', async (req) => {
        // req.data "IS" the Sales record. 
        // It contains 'customer_ID', 'paymentStatus_ID', and 'items'.
        const { items } = req.data;
        let billamount = 0;
        for (const item of items) {
            //fetch iteminfo
            const itemInfo = await SELECT.one.from(Items).where({ ID: item.item_ID });
            if (!itemInfo) {
                return req.error(404, "Item Not Found")
            }

            //just double checking stock availability
            const inventoryQuantity = await SELECT.one.from(Inventory).where({ inventoryItem_ID: itemInfo.ID })
            if (item.quantity == null || item.quantity <= 0) {
                return req.error(400, "Enter a valid quantity")
            }
            if (itemInfo.quantity > inventoryQuantity.quantity) {
                return req.error(400, `LOWSTOCK. Only ${inventoryQuantity.quantity} units available`)
            }

            const totalCostPricePerUnit = (itemInfo.itemBasePrice + ((itemInfo.itemBasePrice * itemInfo.gstPercent) / 100))
            item.sellingPrice = totalCostPricePerUnit + (totalCostPricePerUnit * itemInfo.marginPercent / 100);

            item.totalAmount = item.quantity * item.sellingPrice;
            const discountAmt = (item.totalAmount * item.discountPercent) / 100;
            item.totalPayableAmount = item.totalAmount - discountAmt;
            billamount += item.totalPayableAmount;
        }
        req.data.billTotal = billamount;
    });

    this.on('checkStockAvailability', async (req) => {
        const { ID } = req.params[1]  //id of salesitems

        const salesItemsRecord = await SELECT.one.from(req.target).where({ ID: ID })
        if (!salesItemsRecord) {
            return req.error(404, "SalesItem Not found")
        }

        if (salesItemsRecord.quantity == null || salesItemsRecord.quantity <= 0) {
            return req.error(400, "Enter a valid quantity")
        }
        const inventoryQuantity = await SELECT.one.from(Inventory).where({ inventoryItem_ID: salesItemsRecord.item_ID })
        if (!inventoryQuantity) {
            return req.error(404, "Item Not in Inventory")
        }
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
        if (saleRecord.paymentStatus_ID === purchasePayStatus.ID) {
            return req.error(404, "Purchase Already Paid")
        }

        const saleItemStatus = await SELECT.one.from(SalesItemStatus).where({ saleItStatus: 'Paid' })
        if (!saleItemStatus) {
            return req.error(404, "Status Not found")
        }

        for (const item of saleRecord.items) {
            if (item.itemStatus_ID === saleItemStatus.ID) {
                return req.error(400, `Some Items in the purchase are already paid.Please Check again.`)
            }
            await updateLedger(item, req, "SALES", "CREDIT");
            await updateInventory(item, req, "Purchase");
        }
        req.info("Ledger Updated")
        req.info("Inventory Updated")
        await UPDATE(SalesItems).set({ itemStatus_ID: saleItemStatus.ID }).where({ parentSales_ID: ID })
        await UPDATE(Sales).set({ paymentStatus_ID: purchasePayStatus.ID }).where({ ID: ID })
        req.info("Purchase Paid")
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
        else if (transactionType === "DEBIT")
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
            } else if (action === "Full Return") {
                await UPDATE(Inventory).set({
                    quantity: { '+=': item.quantity },
                }).where({ ID: existingStock.ID })
            } else if (action === "Partial Return") {
                await UPDATE(Inventory).set({
                    quantity: { '+=': req.data.quantity },
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

        let purchasePayStatus = await SELECT.one.from(SalesPayStatus).where({ payStatus: "Paid" })
        if (!purchasePayStatus) {
            return req.error(404, "Status Not found")
        }
        if (salesRecord.paymentStatus_ID !== purchasePayStatus.ID) {
            return req.error(404, "Purchase Not Paid")
        }
        const salesReturnRecord = await SELECT.one.from(SalesReturnStatus).where({ retStatus: 'CompleteReturn' })
        if (!salesReturnRecord) {
            return req.error(404, "Return record not found")
        }
        if (salesRecord.returnStatus_ID === salesReturnRecord.ID) {
            return req.error(400, "Purchase already returned")
        }

        const saleItemStatus = await SELECT.one.from(SalesItemStatus).where({ saleItStatus: 'Full Return' })
        if (!saleItemStatus) {
            return req.error(404, "Status Not found")
        }
        let returnItemArray = [];
        for (const item of salesRecord.items) {
            if (item.itemStatus_ID === saleItemStatus.ID) {
                //this item was already returned
                continue;
            }
            returnItemArray.push({
                saleitem_ID: item.ID,
                quantity: item.quantity
            })
            //update inventory
            updateInventory(item, req, "Full Return");
            updateLedger(item, req, "SALES", "DEBIT")

        }

        req.info("Order Returned | Inventory Updated | Ledger Updated")
        await UPDATE(SalesItems).set({ itemStatus_ID: saleItemStatus.ID }).where({ parentSales_ID: ID })
        await UPDATE(Sales).set({ returnStatus_ID: salesReturnRecord.ID }).where({ ID: ID })
        await INSERT.into(SalesReturns).entries({
            originalSales_ID: ID,
            returnItems: returnItemArray
        })

        return await SELECT.one.from(Sales).where({ ID: ID })

    })

    async function updateLedgerForPartialItemReturn(item, req, department, transactionType) {
        const deptRecord = await SELECT.one.from(Departments).where({ dept: department });
        if (!deptRecord) return req.error(400, 'Invalid Department');

        const debitRecord = await SELECT.one.from(PassbookEntryTypes).where({ entryType: transactionType })
        if (!debitRecord) return req.error(400, `${transactionType} not found`)

        const lastEntry = await SELECT.one.from(RetailLedger)
            .columns('currentBalance')
            .orderBy('createdAt desc');

        const previousBalance = lastEntry ? Number(lastEntry.currentBalance) : 0;
        let newBalance, amountToLog;
        if (transactionType === "CREDIT") {
            amountToLog = item.totalPayableAmount
            newBalance = previousBalance + amountToLog;
        }
        else if (transactionType === "DEBIT") {
            amountToLog = (item.totalPayableAmount / item.quantity) * req.data.quantity
            newBalance = previousBalance - amountToLog;
        }
        await INSERT.into(RetailLedger).entries({
            entryType_ID: debitRecord.ID,
            department_ID: deptRecord.ID,
            amount: amountToLog,
            currentBalance: newBalance
        })
    }

    this.on('returnItems', async (req) => {
        const { quantity } = req.data
        const { ID } = req.params[1]; //salesitems id


        const salesitem = await SELECT.one.from(SalesItems).where({ ID: ID })
        if (quantity == null || quantity < 0 || quantity > (salesitem.quantity - salesitem.returnedQuantity)) {
            return req.error(400, "Quantity to be returned must be less than purchased/ remaining")
        }
        // req.info(`${salesitem.ID}`)
        const parentsale = await SELECT.one.from(Sales).where({ ID: salesitem.parentSales_ID })

        let purchasePayStatus = await SELECT.one.from(SalesPayStatus).where({ payStatus: "Paid" })
        if (!purchasePayStatus) {
            return req.error(404, "Status Not found")
        }
        if (parentsale.paymentStatus_ID !== purchasePayStatus.ID) {
            return req.error(404, "Purchase Not Paid")
        }


        let saleItemStatus = await SELECT.one.from(SalesItemStatus).where({ saleItStatus: 'Full Return' })
        if (!saleItemStatus) {
            return req.error(404, "Status Not found")
        }
        if (salesitem.itemStatus_ID === saleItemStatus.ID) {
            return req.error(400, "Item already returned")
        }

        await UPDATE(SalesItems).set({ returnedQuantity: { '+=': quantity } }).where({ ID: ID })

        let status;
        if (quantity == (salesitem.quantity - salesitem.returnedQuantity)) {
            status = 'Full Return'
            await updateInventory(salesitem, req, status)
            await updateLedger(salesitem, req, "SALES", "DEBIT")
        } else if (quantity < (salesitem.quantity - salesitem.returnedQuantity)) {
            status = 'Partial Return'
            await updateInventory(salesitem, req, status)
            await updateLedgerForPartialItemReturn(salesitem, req, "SALES", "DEBIT")
        }


        saleItemStatus = await SELECT.one.from(SalesItemStatus).where({ saleItStatus: status })
        if (!saleItemStatus) {
            return req.error(404, "Status Not found")
        }


        // await checkAndUpdatePurchase(req);
        // const salesReturnRecord = await SELECT.one.from(SalesReturnStatus).where({ retStatus: 'Partial' })
        // if (!salesReturnRecord) {
        //     return req.error(404, "Return record not found")
        // }
        // await UPDATE(Sales).set({ returnStatus_ID: salesReturnRecord.ID }).where({ ID: salesitem.parentSales_ID })


        await UPDATE(SalesItems).set({ itemStatus_ID: saleItemStatus.ID }).where({ ID: ID })
        await checkAndUpdatePurchase(req);

        req.info("Item(s) Returned | Inventory Updated | Ledger Updated")

        let returnItemArray = [];
        returnItemArray.push({
            saleitem_ID: salesitem.ID,
            quantity: quantity
        })

        const existingSalesReturnItems = await SELECT.one.from(SalesReturnItems).where({ saleitem_ID: ID })
        if (existingSalesReturnItems) {
            await UPDATE(SalesReturnItems)
                .set({ quantity: { '+=': quantity } })
                .where({ saleitem_ID: ID })
        } else {
            await INSERT.into(SalesReturns).entries({
                originalSales_ID: salesitem.parentSales_ID,
                returnItems: returnItemArray
            })
        }

        await SELECT.one.from(SalesItems).where({ ID: ID })

    })


    async function checkAndUpdatePurchase(req) {
        const { ID } = req.params[0];  //sale id
        const saleRecord = await SELECT.one.from(Sales).where({ ID: ID }).columns(record => {
            record('*');               // All fields from Sales
            record.items(item => {      // Expand the 'items' composition
                item('*');             // All fields from SalesItems
            });
        });
        if (!saleRecord) {
            return req.error(400, "Cant find required Sale Record for Status Updation")
        }
        let itemcount = 0, flagcount = 0, status;
        for (const item of saleRecord.items) {
            if (item.quantity === item.returnedQuantity) {
                flagcount++;
            }
            itemcount++;
        }
        if (flagcount === itemcount) {
            status = "CompleteReturn"
        } else status = "Partial"

        const salesReturnRecord = await SELECT.one.from(SalesReturnStatus).where({ retStatus: status })
        if (!salesReturnRecord) {
            return req.error(404, "Status not found")
        }
        await UPDATE(Sales).set({ returnStatus_ID: salesReturnRecord.ID }).where({ ID: ID })


    }


    this.on('removeItemsFromShopping', async (req) => {
        const { quantity } = req.data
        const { ID } = req.params[1]; //salesitems id


        const salesitem = await SELECT.one.from(SalesItems).where({ ID: ID })
        if (quantity == null || quantity < 0 || quantity > salesitem.quantity) {
            return req.error(400, "Quantity to be removed must be less than purchased/ remaining")
        }
        // req.info(`${salesitem.ID}`)
        const parentsale = await SELECT.one.from(Sales).where({ ID: salesitem.parentSales_ID })

        let purchasePayStatus = await SELECT.one.from(SalesPayStatus).where({ payStatus: "Paid" })
        if (!purchasePayStatus) {
            return req.error(404, "Status Not found")
        }
        if (parentsale.paymentStatus_ID === purchasePayStatus.ID) {
            return req.error(404, "Purchase Paid. Cant Remove. Please Return")
        }

        let saleItemStatus = await SELECT.one.from(SalesItemStatus).where({ saleItStatus: 'Pay Pending' })
        if (!saleItemStatus) {
            return req.error(404, "Status Not found")
        }
        if (salesitem.itemStatus_ID !== saleItemStatus.ID) {
            return req.error(400, "Item Already Paid. Cant remove. Return Instead")
        }

        if (salesitem.quantity === quantity) {
            await DELETE.from(SalesItems).where({ ID: ID })
        }
        await UPDATE(SalesItems).set({ quantity: { '-=': quantity } }).where({ ID: ID })

        req.info("Item Removed Accordingly")
        await SELECT.one.from(SalesItems).where({ ID: ID })

    })
});




