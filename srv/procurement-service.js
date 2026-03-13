const INSERT = require("@sap/cds/lib/ql/INSERT");
const SELECT = require("@sap/cds/lib/ql/SELECT");

module.exports = function () {
    const { Categories, CategoryStatus, Items, Distributors, PO, POItems, POStatus, ItemStatus, IndependentDistributor, DistributorOrderItems } = this.entities;
    this.on('DELETE', 'PO', async (req) => {
        req.reject(400, 'PO cant be deleted. Close PO instead. ')
    })

    this.on('closePO', async (req) => {
        const { ID } = req.params[0];
        const statusRecord = await SELECT.one.from(POStatus).where({ poStatus: 'Closed' });
        if (!statusRecord) return req.error(404, "Status 'Closed' not found");

        await UPDATE(PO).set({ status_ID: statusRecord.ID }).where({ ID: ID });

        return SELECT.one.from(PO).where({ ID: ID });
    })

    this.on('openPO', async (req) => {
        const { ID } = req.params[0];
        const statusRecord = await SELECT.one.from(POStatus).where({ poStatus: 'Open' });
        if (!statusRecord) return req.error(404, "Status 'Open' not found");

        await UPDATE(PO).set({ status_ID: statusRecord.ID }).where({ ID: ID });

        return SELECT.one.from(PO).where({ ID: ID });
    })


    // //calculate total PO amount
    //     this.after('READ', 'PO', async (data, req) => {
    //         const pos = Array.isArray(data) ? data : [data]
    //         for (const po of pos) {
    //             if (po.ID) {
    //                 const items = await SELECT.from(POItems).where({ parentPO_ID: po.ID })

    //                 let total = 0
    //                 for (const item of items) {
    //                     // Fetching item details (price/tax) from the master Items table 
    //                     // because your POItems table doesn't store them directly
    //                     const itemDetails = await SELECT.one.from(Items)
    //                                               .where({ ID: item.poItem_ID })

    //                     if (itemDetails) {
    //                         const price = itemDetails.itemBasePrice || 0
    //                         const gst = itemDetails.gstPercent || 0
    //                         const qty = item.quantity || 0

    //                         total += (price * qty) + ((price * qty * gst) / 100)
    //                     }
    //                 }
    //                 po.totalPOAmount = total
    //             }
    //         }
    //     })


    //to calculate total, paid and remaining amount == ony for frontend purpose. there are not stored in db
    this.after('READ', 'PO', async (data, req) => {
        const pos = Array.isArray(data) ? data : [data]
        for (const po of pos) {
            if (po.ID) {
                const items = await SELECT.from(POItems).where({ parentPO_ID: po.ID })

                let total = 0, remaining = 0;
                for (const item of items) {
                    // Fetching item details (price/tax) from the master Items table 
                    // because your POItems table doesn't store them directly
                    const itemDetails = await SELECT.one.from(Items)
                        .where({ ID: item.poItem_ID })

                    if (itemDetails) {
                        const price = itemDetails.itemBasePrice || 0
                        const gst = itemDetails.gstPercent || 0
                        const qty = item.quantity || 0

                        const eachItemPriceWithQuantity = (price * qty) + ((price * qty * gst) / 100);
                        total += eachItemPriceWithQuantity;
                        const unitItemprice = (price) + ((price * gst) / 100);
                        remaining += (item.itemsYetToReceive * unitItemprice);
                    }
                }
                po.totalPOAmount = total || 0;
                po.remainingAmount = remaining || 0;
                po.paidAmount = total - remaining || 0;
            }
        }
    })


    this.on('approvePO', async (req) => {
        const { ID } = req.params[0]; //id of the selected PO

        let statusRecord = await SELECT.one.from(POStatus).where({ poStatus: 'Pending' });
        if (!statusRecord) return req.error(404, "Status 'Pending' not found");

        const po = await SELECT.one.from(PO).where({ ID: ID,status_ID:statusRecord.ID })
        if (!po) return req.error(404, "PO ALready Approved");

        const poitems = await SELECT.from(POItems).where({ parentPO_ID: ID })

        const itemsToInsert = [];
        let total = 0;
        for (const item of poitems) {
            // Fetch item master data for details
            const masterItem = await SELECT.one.from(Items).where({ ID: item.poItem_ID });
            if (masterItem) {
                const price = Number(masterItem.itemBasePrice) || 0;
                const gst = Number(masterItem.gstPercent) || 0;
                const qty = Number(item.quantity) || 0;

                const eachItemPriceWithQuantity = (price * qty) + ((price * qty * gst) / 100);
                total += eachItemPriceWithQuantity;
                itemsToInsert.push({
                    itemName: masterItem.itemName,
                    quantity: qty,
                    itemBasePrice: price,
                    gstPercent: gst
                    // parentDistributor_ID is handled automatically by CAP in Deep Insert
                });
            }
        }
        await INSERT.into(IndependentDistributor).entries({
            poID: ID,
            toDistributor_ID: po.supplier_ID,
            orderItems: itemsToInsert // This matches the 'Composition of many' relationship name
        });
        
        //set status to Open after Approval
        statusRecord = await SELECT.one.from(POStatus).where({ poStatus: 'Open' });
        if (!statusRecord) return req.error(404, "Status 'Open' not found");
        await UPDATE(PO).set({status_ID:statusRecord.ID}).where({ID:ID})

        req.info("PO Approved and Sent to Distributor.");

        return SELECT.one.from(PO).where({ ID: ID });
    })

    this.on('markInspected', async (req) => {
        //change status to inspected for the grItems.
        //manually enter the quantity damaged if any. if no, enter 0;
    })

    this.on('approveGR', async (req) => {
        //when this button clicked,
        //internally check all the gritems. 
        //sum totalreceievd and total damaged
        //if totalddamaged == 0 or precisely, if OpenQuantity is ==0 then 'Accepeted' (ie., no more items left to be delivered) and status of PO=Closed
        //update inventory with the good stocks = totalquantity-damaged
        //if totaldamaged==totalReceieved then 'Returned' and PO status still Open
        //populate distributor with the PO again with OpenQuantity
        //-------------> (loop) same as previous//once its triggered from distributor service there they will change status to StockRcvd_inspection_pending (actually event...but not now)
        //else its partial return and partial PO with again populating distributor with PO
        ////update inventory with the good stocks = totalquantity-damaged
        //-------------> (loop) same as previous //once distributor triggers it...they change state to StockRcvd_inspection_pending

    })
}