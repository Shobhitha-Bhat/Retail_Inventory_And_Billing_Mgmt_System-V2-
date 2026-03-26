
const PDFDocument = require('pdfkit');
const cds = require('@sap/cds');
const { SELECT, UPDATE } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(function () {

    const { Sales, SalesItems, SalesPayStatus, SalesReturnStatus, Items,MockCustomers } = this.entities;

    //   this.on('generateInvoice', async (req) => {
    //     const saleID = req.params[0].ID;
    //     const sale = await SELECT.one.from(Sales).where({ ID: saleID });
    //     const items = await SELECT.from(SalesItems)
    //         .where({ parentSales_ID: saleID });

    //     // if (sale.paymentStatus !== 'Paid') {
    //     //   return req.error('Invoice allowed only after payment');
    //     // }

    //     const doc = new PDFDocument();
    //     const buffers = [];

    //     doc.on('data', buffers.push.bind(buffers));

    //     // Invoice Header
    //     doc.fontSize(20).text('INVOICE', { align: 'center' });
    //     doc.moveDown();
    //     doc.fontSize(12).text(`Invoice No: ${sale.salesNo}`);
    //     doc.text(`Date: ${sale.createdAt}`);
    //     doc.moveDown();

    //     // Line Items
    //     items.forEach((item, index) => {
    //       doc.text(`${index + 1}. Qty: ${item.quantity} | ₹ ${item.totalAmount}`);
    //     });

    //     doc.moveDown();
    //     doc.text(`Total Amount: ₹ ${items.reduce((sum, i) => sum + i.totalAmount, 0)}`);

    //     doc.end();

    //     const pdfBuffer = await new Promise(resolve => {
    //       doc.on('end', () => resolve(Buffer.concat(buffers)));
    //     });


    //     return pdfBuffer;
    //   });

    this.before('CREATE', 'Sales', async (req) => {

        // req.data "IS" the Sales record. 
        // It contains 'customer_ID', 'paymentStatus_ID', and 'items'.
        const { items } = req.data;
        for (const item of items) {
            //fetch iteminfo
            const itemInfo = await SELECT.one.from(Items).where({ ID: item.item_ID });
            if(!itemInfo){
                return req.error(404,"Item Not Found")
            }
            
            const totalCostPricePerUnit = (itemInfo.itemBasePrice + ((itemInfo.itemBasePrice * itemInfo.gstPercent) / 100))
            item.sellingPrice = totalCostPricePerUnit + (totalCostPricePerUnit * itemInfo.marginPercent / 100);

            item.totalAmount = item.quantity * item.sellingPrice;
            const discountAmt = (item.totalAmount * item.discountPercent) / 100;
            item.totalPayableAmount = item.totalAmount - discountAmt;
        }
    });

    this.on('addnewCustomer',async(req)=>{
        const {customername,city,contactNumber} = req.data;
        await INSERT.into(MockCustomers).entries({
            customername:customername,
            city:city,
            contactNumber:contactNumber
        })

        req.info("Customer Added. Proceed")
    })


});




