module.exports = function(){
    const { Categories, CategoryStatus, Items, Distributors, PO,POItems,POStatus,ItemStatus } = this.entities;
    this.on('DELETE','PO',async(req)=>{
        req.reject(400,'PO cant be deleted. Close PO instead. ')
    })

    this.on('closePO',async(req)=>{
        const { ID } = req.params[0];
        const statusRecord = await SELECT.one.from(POStatus).where({ poStatus: 'Closed' });
        if (!statusRecord) return req.error(404, "Status 'Closed' not found");

        await UPDATE(PO).set({ status_ID: statusRecord.ID }).where({ ID: ID });

        return SELECT.one.from(PO).where({ ID: ID });
    })

    this.on('openPO',async(req)=>{
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


//to calculate total, paid and remaining amount
this.after('READ', 'PO', async (data, req) => {
        const pos = Array.isArray(data) ? data : [data]
        for (const po of pos) {
            if (po.ID) {
                const items = await SELECT.from(POItems).where({ parentPO_ID: po.ID })
                
                let total = 0,remaining=0;
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
                        remaining+=(item.itemsYetToReceive*unitItemprice);
                    }
                }
                po.totalPOAmount = total ||0;
                po.remainingAmount=remaining ||0;
                po.paidAmount=total-remaining ||0;
            }
        }
    })


    this.on('approvePO',async(req)=>{
        //from the list of POs that is created , approve -> procurement manager
        //populate Distributor with the PO and its POItems and with an option to Trigger GR.(open quantity)
    })

    this.on('markInspected',async(req)=>{
        //change status to inspected for the grItems.
        //manually enter the quantity damaged if any. if no, enter 0;
    })

    this.on('approveGR',async(req)=>{
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