module.exports=function(){

    const { IndependentDistributor, DistributorOrderItems } = this.entities;

    this.after('READ', 'IndependentDistributor', async (data, req) => {
    const pos = Array.isArray(data) ? data : [data];
    for (const po of pos) {    
        const items = await SELECT.from(DistributorOrderItems).where({ parentDistributor_ID: po.ID });
        let total = 0;
        if (items && items.length > 0) {
            items.forEach(item => {
                const price = Number(item.itemBasePrice) || 0;
                const gst = Number(item.gstPercent) || 0;
                const qty = Number(item.quantity) || 0;

                
                const lineTotal = (price * qty) + ((price * qty * gst) / 100);
                total += lineTotal;
            });
        }
        po.totalOrderAmount = total ||0;
    }
});


    this.on('triggerGRtoRetailer',async(req)=>{
        req.info("Requested Items sent. Confirm With the Retailer.")
        //once the table is populated with Po requests from PO, click trigger.approveGR
        //once approved , populate with GR and GRItems with StockRcvd_inspection_pending state
        //in grItems status is pending for inspection status
    })
}


// this.on('approvePO', async (req) => {
//         const { ID } = req.params[0]; //id of the selected PO

//         let statusRecord = await SELECT.one.from(POStatus).where({ poStatus: 'Pending' });
//         if (!statusRecord) return req.error(404, "Status 'Pending' not found");

//         const po = await SELECT.one.from(PO).where({ ID: ID,status_ID:statusRecord.ID })
//         if (!po) return req.error(404, "PO ALready Approved");

//         const poitems = await SELECT.from(POItems).where({ parentPO_ID: ID })

//         const itemsToInsert = [];
//         let total = 0;
//         for (const item of poitems) {
//             // Fetch item master data for details
//             const masterItem = await SELECT.one.from(Items).where({ ID: item.poItem_ID });
//             if (masterItem) {
//                 const price = Number(masterItem.itemBasePrice) || 0;
//                 const gst = Number(masterItem.gstPercent) || 0;
//                 const qty = Number(item.quantity) || 0;

//                 const eachItemPriceWithQuantity = (price * qty) + ((price * qty * gst) / 100);
//                 total += eachItemPriceWithQuantity;
//                 itemsToInsert.push({
//                     itemName: masterItem.itemName,
//                     quantity: qty,
//                     itemBasePrice: price,
//                     gstPercent: gst
//                     // parentDistributor_ID is handled automatically by CAP in Deep Insert
//                 });
//             }
//         }
//         await INSERT.into(IndependentDistributor).entries({
//             poID: ID,
//             toDistributor_ID: po.supplier_ID,
//             orderItems: itemsToInsert // This matches the 'Composition of many' relationship name
//         });
        
//         //set status to Open after Approval
//         statusRecord = await SELECT.one.from(POStatus).where({ poStatus: 'Open' });
//         if (!statusRecord) return req.error(404, "Status 'Open' not found");
//         await UPDATE(PO).set({status_ID:statusRecord.ID}).where({ID:ID})

//         req.info("PO Approved and Sent to Distributor.");

//         return SELECT.one.from(PO).where({ ID: ID });
//     })