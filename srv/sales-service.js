// module.exports=function(){
// const PDFDocument = require('pdfkit');
// const cds = require('@sap/cds');

// module.exports = cds.service.impl(function () {

//   const { Sales, SalesItems } = this.entities;

//   this.on('downloadInvoice', 'Sales', async (req) => {

//     const saleID = req.params[0].ID;

//     const sale = await SELECT.one.from(Sales).where({ ID: saleID });
//     const items = await SELECT.from(SalesItems)
//         .where({ parentSales_ID: saleID });

//     if (sale.paymentStatus !== 'Paid') {
//       return req.error('Invoice allowed only after payment');
//     }

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

// });
// }