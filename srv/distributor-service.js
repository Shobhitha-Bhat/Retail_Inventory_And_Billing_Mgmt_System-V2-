
const SELECT = require("@sap/cds/lib/ql/SELECT");

module.exports=function(){

    const { IndependentDistributor, DistributorOrderItems,GRStatus,GRPaymentStatus,GRItemInspectStatus,GR,RequestStatus } = this.entities;

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
        //once the table is populated with Po requests from PO, click trigger.approveGR
        //once approved , populate with GR and GRItems with StockRcvd_inspection_pending state
        //in grItems status is pending for inspection status

        const { ID } = req.params[1];

        let reStatus = await SELECT.one.from(RequestStatus).where({ reqStatus: 'Closed' });
        if (!reStatus) return req.error(404, "Status 'Closed' not found");

        const triggeredPO= await SELECT.one.from(IndependentDistributor).where({ID:ID})
        if (!triggeredPO) return req.error(400, `Cant find Requested Row`);
        if(triggeredPO.requestStatus_ID == reStatus.ID){
            return req.error(404,"Status Already Closed")
        }

    
        const grStatusRecord = await SELECT.one.from(GRStatus).where({ grStatus: 'StockRcvd_InspectionInProgress' });
        if (!grStatusRecord) return req.error(404, "Status 'StockRcvd_InspectionInProgress' not found");

        const grPaymentStatus = await SELECT.one.from(GRPaymentStatus).where({ grPayStatus: 'Pending' });
        if (!grPaymentStatus) return req.error(404, "Status 'Pending' not found");

        const grItemInspectStatus = await SELECT.one.from(GRItemInspectStatus).where({ inspectStatus: 'Pending' });
        if (!grItemInspectStatus) return req.error(404, "Status 'Pending' not found");
        

        const items = await SELECT.from(DistributorOrderItems).where({parentDistributor:ID})

        const itemsToInsert=[];
        let total=0;
        let currentOrderAmount = 0
        for(const item of items){
            const price = Number(item.itemBasePrice) || 0;
                const gst = Number(item.gstPercent) || 0;
                const qtyToSend = Number(item.itemsYetToSend)||0;
                const qty = Number(item.quantity) || 0;

                const unitPriceWithTax = price + (price * gst / 100);
                const eachItemPriceWithQuantity = (price * qty) + ((price * qty * gst) / 100);
                total += eachItemPriceWithQuantity;

                if(qtyToSend>0){
                        currentOrderAmount += (qtyToSend * unitPriceWithTax);
                    itemsToInsert.push({
                    // parentGR automatically mapped when deep inserted
                    poItem_ID: item.refPOItemID,
                    quantityReceived:qtyToSend,
                    inspectionStatus_ID:grItemInspectStatus.ID,
                    
                })
                }
        }
        
        if (itemsToInsert.length === 0) {
                    
                    await UPDATE(IndependentDistributor).set({requestStatus_ID:reStatus.ID}).where({ID:ID})
                req.info("All items for this PO have already been sent.");
                return SELECT.one.from(IndependentDistributor).where({ID:ID})
            }
        
        await INSERT.into(GR).entries({
            originalPO_ID:triggeredPO.poID,
            status_ID:grStatusRecord.ID,
            paymentStatus_ID:grPaymentStatus.ID,
            grItems:itemsToInsert,
            totalPOAmount:total,
            currentOrderAmount: Number(currentOrderAmount.toFixed(2))
        })
        
        for (const item of itemsToInsert) {
    await UPDATE(DistributorOrderItems)
        .set({ itemsYetToSend: 0 })
        .where({ 
            parentDistributor_ID: ID, 
            refPOItemID: item.poItem_ID 
        });
}

        reStatus = await SELECT.one.from(RequestStatus).where({ reqStatus: 'Open' });
        if (!reStatus) return req.error(404, "Status 'Open' not found");
        await UPDATE(IndependentDistributor).set({requestStatus_ID:reStatus.ID}).where({ID:triggeredPO.ID})

        req.info("Requested Items sent. Confirm With the Retailer.")
        return SELECT.one.from(IndependentDistributor).where({ID:ID})
    })
}


this.on('closeRequest',)