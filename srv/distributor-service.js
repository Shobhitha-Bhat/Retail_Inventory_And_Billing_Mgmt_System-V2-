module.exports=function(){

    const { Categories, CategoryStatus, Items, Distributors, PO, POItems, POStatus, ItemStatus, IndependentDistributor, DistributorOrderItems } = this.entities;

    this.after('READ', 'IndependentDistributor', async (data, req) => {
    // 1. Convert to array to handle both List Report and Object Page
    const pos = Array.isArray(data) ? data : [data];

    for (const po of pos) {
        // 2. Fetch the child items for this specific PO
        // Note: Use parentDistributor_ID because that is your FK in DistributorOrderItems
        const items = await SELECT.from(DistributorOrderItems).where({ parentDistributor_ID: po.ID });

        let total = 0;
        if (items && items.length > 0) {
            items.forEach(item => {
                const price = Number(item.itemBasePrice) || 0;
                const gst = Number(item.gstPercent) || 0;
                const qty = Number(item.quantity) || 0;

                // Calculation: (Base Price * Qty) + GST on that total
                const lineTotal = (price * qty) + ((price * qty * gst) / 100);
                total += lineTotal;
            });
        }

        // 3. Update the virtual field
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