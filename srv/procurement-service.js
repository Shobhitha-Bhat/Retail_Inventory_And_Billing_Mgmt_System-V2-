// const { UPDATE } = require("@sap/cds/lib/ql/cqn");
const INSERT = require("@sap/cds/lib/ql/INSERT");
const SELECT = require("@sap/cds/lib/ql/SELECT");

module.exports = function () {
    const { Categories, CategoryStatus, Items, Distributors, PO, POItems, POStatus, ItemStatus, IndependentDistributor, DistributorOrderItems, GR, GRItems, GRItemInspectStatus, GRStatus, GRPaymentStatus, RequestStatus, InventoryStatus, Inventory, RetailLedger, PassbookEntryTypes, Departments } = this.entities;
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


    this.before('CREATE', 'PO', req => {
    const po = req.data;
    if (po.poItems) {
        po.poItems.forEach(item => {
            // When first creating, everything is "yet to receive"
            item.itemsYetToReceive = item.quantity;
        });
    }
});

    //to calculate total, paid and remaining amount == ony for frontend purpose. there are not stored in db
    // this.after('READ', 'PO', async (data, req) => {
    //     const pos = Array.isArray(data) ? data : [data]
    //     for (const po of pos) {
    //         if (po.ID) {
    //             const items = await SELECT.from(POItems).where({ parentPO_ID: po.ID })

    //             let total = 0, remaining = 0;
    //             for (const item of items) {
    //                 // Fetching item details (price/tax) from the master Items table 
    //                 // because your POItems table doesn't store them directly
    //                 const itemDetails = await SELECT.one.from(Items)
    //                     .where({ ID: item.poItem_ID })

    //                 if (itemDetails) {
    //                     const price = Number(itemDetails.itemBasePrice) || 0
    //                     const gst = Number(itemDetails.gstPercent) || 0
    //                     const qty = Number(item.quantity) || 0

    //                     const eachItemPriceWithQuantity = Number((price * qty) + ((price * qty * gst) / 100).toFixed(2)).toFixed(2);
    //                     total += eachItemPriceWithQuantity;
    //                     const unitItemprice = Number( (price) + ((price * gst) / 100).toFixed(2)).toFixed(2);
    //                     remaining += (Number(item.itemsYetToReceive) * unitItemprice).toFixed(2);
    //                 }
    //             }
    //             po.totalPOAmount = Number(total.toFixed(2)) || 0;
    //             po.remainingAmount = Number(remaining.toFixed(2)) || 0;
    //             po.paidAmount = Number((total - remaining).toFixed(2)) || 0;
    //         }
    //     }
    // })
    this.after('READ', 'PO', async (data, req) => {
    const pos = Array.isArray(data) ? data : [data];
    if (pos.length === 0) return;

    // 1. Fetch all items and their master data prices in ONE go for all POs being read
    const poIds = pos.map(p => p.ID);
    const allItems = await SELECT.from(POItems).where({ parentPO_ID: { in: poIds } })
        .columns(item => {
            item('*'),
            item.poItem(master => { master.itemBasePrice, master.gstPercent })
        });

    for (const po of pos) {
        // Filter the pre-fetched items for this specific PO
        const items = allItems.filter(i => i.parentPO_ID === po.ID);

        let total = 0, remaining = 0;

        for (const item of items) {
            const master = item.poItem;
            if (master) {
                const price = Number(master.itemBasePrice) || 0;
                const gst = Number(master.gstPercent) || 0;
                const qty = Number(item.quantity) || 0;
                const yetToRcv = Number(item.itemsYetToReceive) || 0;

                // Calculate unit price with tax first
                const unitPriceWithTax = price + (price * gst / 100);
                
                total += qty * unitPriceWithTax;
                remaining += yetToRcv * unitPriceWithTax;
            }
        }

        // Apply rounding ONLY at the very end to maintain accuracy
        po.totalPOAmount = Number(total.toFixed(2));
        po.remainingAmount = Number(remaining.toFixed(2));
        po.paidAmount = Number((total - remaining).toFixed(2));
    }
});


    this.on('approvePO', async (req) => {
        const { ID } = req.params[0]; //id of the selected PO

        let statusRecord = await SELECT.one.from(POStatus).where({ poStatus: 'Pending' });
        if (!statusRecord) return req.error(404, "Status 'Pending' not found");

        const po = await SELECT.one.from(PO).where({ ID: ID, status_ID: statusRecord.ID })
        if (!po) return req.error(404, "PO ALready Approved");

        const poitems = await SELECT.from(POItems).where({ parentPO_ID: ID })

        const reStatus = await SELECT.one.from(RequestStatus).where({ reqStatus: 'Pending' });
        if (!reStatus) return req.error(404, "Status 'Pending' not found");

        const itemsToInsert = [];
        let total = 0, quantityToAdd;
        for (const item of poitems) {

            const masterItem = await SELECT.one.from(Items).where({ ID: item.poItem_ID });
            if (masterItem) {
                const price = Number(masterItem.itemBasePrice) || 0;
                const gst = Number(masterItem.gstPercent) || 0;
                const qty = Number(item.quantity) || 0;
                quantityToAdd = Number(item.quantity) || 0;
                const eachItemPriceWithQuantity = (price * qty) + ((price * qty * gst) / 100);
                total += eachItemPriceWithQuantity;
                itemsToInsert.push({
                    refPOItemID: item.ID,
                    itemName: masterItem.itemName,
                    quantity: qty,
                    itemBasePrice: price,
                    gstPercent: gst,
                    itemsYetToSend: qty
                    // parentDistributor_ID is handled automatically by CAP in Deep Insert
                });
            }
        }
        await INSERT.into(IndependentDistributor).entries({
            poID: ID,
            toDistributor_ID: po.supplier_ID,
            requestStatus_ID: reStatus.ID,
            orderItems: itemsToInsert
        });

        await UPDATE(POItems)
            .set({ itemsYetToReceive: quantityToAdd }) // Set it equal to the initial ordered quantity
            .where({ parentPO_ID: ID });

        //set status to Open after Approval
        statusRecord = await SELECT.one.from(POStatus).where({ poStatus: 'Open' });
        if (!statusRecord) return req.error(404, "Status 'Open' not found");
        await UPDATE(PO).set({ status_ID: statusRecord.ID }).where({ ID: ID })

        req.info("PO Approved and Sent to Distributor.");

        return SELECT.one.from(PO).where({ ID: ID });
    })

    // this.on('markInspected', async (req) => {
    //     //change status to inspected for the grItems.
    //     //manually enter the quantity damaged if any. if no, enter 0;
    //     const { quantityDamaged } = req.data
    //     const { ID } = req.params[1]
    //     const grItemInspectStatus = await SELECT.one.from(GRItemInspectStatus).where({ inspectStatus: 'Inspected' });
    //     if (!grItemInspectStatus) return req.error(404, "Status 'Inspected' not found");
    //     const gritem = await SELECT.one.from(GRItems).where({ ID: ID })
    //     if (quantityDamaged > gritem.quantityReceived) {
    //         return req.error(400, "Quantity damaged cant be greater than quantity received")
    //     }
    //     if (quantityDamaged > 0) {
    //         const distOrder = await SELECT.one.from(IndependentDistributor)
    //         .where({ poID: gritem.parentGR.originalPO_ID });

    //     if (distOrder) {
    //         await UPDATE(DistributorOrderItems)
    //             .set({ itemsYetToSend: { '+=': quantityDamaged } })
    //             .where({ 
    //                 refPOItemID: gritem.poItem_ID, 
    //                 parentDistributor_ID: distOrder.ID // This locks it to the correct PO!
    //             });

    //         // 4. Move status back to 'Open' so the distributor sees it again
    //         const openStat = await SELECT.one.from(RequestStatus).where({ reqStatus: 'Open' });
    //         await UPDATE(IndependentDistributor)
    //             .set({ requestStatus_ID: openStat.ID })
    //             .where({ ID: distOrder.ID });
    //         }
    //     }
    //     await UPDATE(GRItems).set({ inspectionStatus_ID: grItemInspectStatus.ID, quantityDamaged: quantityDamaged }).where({ ID: ID });
    //     req.info("Item Inspected")
    //     return SELECT.one.from(GRItems).where({ ID: ID })
    // })

    this.on('markInspected', async (req) => {
        const { quantityDamaged } = req.data;
        const { ID } = req.params[1]; // GRItem ID

        const grItemInspectStatus = await SELECT.one.from(GRItemInspectStatus).where({ inspectStatus: 'Inspected' });

        const gritem = await SELECT.one.from(GRItems).where({ ID: ID });
        if (gritem.inspectionStatus_ID === grItemInspectStatus.ID) {
            return req.error(400, "Item ALready Inspected")
        }
        if (quantityDamaged > gritem.quantityReceived) {
            return req.error(400, "Quantity Damaged cant be > Quantity Received")
        }
        if (!gritem) return req.error(404, "GR Item not found");
        if (!gritem.parentGR_ID) return req.error(400, "GR Item is missing its parent GR reference");

        const parentGR = await SELECT.one.from(GR).where({ ID: gritem.parentGR_ID });
        if (!parentGR || !parentGR.originalPO_ID) {
            return req.error(400, "Could not find the original PO linked to this GR");
        }

        if (quantityDamaged > 0) {
            const distOrder = await SELECT.one.from(IndependentDistributor)
                .where({ poID: parentGR.originalPO_ID });

            if (distOrder) {
                await UPDATE(DistributorOrderItems)
                    .set({ itemsYetToSend: { '+=': quantityDamaged } })
                    .where({
                        refPOItemID: gritem.poItem_ID,
                        parentDistributor_ID: distOrder.ID
                    });
                const openStat = await SELECT.one.from(RequestStatus).where({ reqStatus: 'Open' });
                await UPDATE(IndependentDistributor)
                    .set({ requestStatus_ID: openStat.ID })
                    .where({ ID: distOrder.ID });
            }
        }

        await UPDATE(GRItems)
            .set({ inspectionStatus_ID: grItemInspectStatus.ID, quantityDamaged: quantityDamaged })
            .where({ ID: ID });

        req.info("Item Inspected");
        return SELECT.one.from(GRItems).where({ ID: ID });
    });


// this.on('approveGR', async (req) => {
//     const { ID } = req.params[0];
//     const selectedGR = await SELECT.one.from(GR).where({ ID }).columns(g => { g('*'), g.grItems('*') });

//     if (!selectedGR) return req.error(404, "GR not found");

//     // 1. FETCH ALL STATUSES ONCE (Move these out of the loop!)
//     const [statAccepted, statReturned, statPartial] = await Promise.all([
//         SELECT.one.from(GRStatus).where({ grStatus: 'Accepted' }),
//         SELECT.one.from(GRStatus).where({ grStatus: 'Returned' }),
//         SELECT.one.from(GRStatus).where({ grStatus: 'Partial Return' })
//     ]);
    
//     const [payPaid, payPending, payPartial] = await Promise.all([
//         SELECT.one.from(GRPaymentStatus).where({ grPayStatus: 'Paid' }),
//         SELECT.one.from(GRPaymentStatus).where({ grPayStatus: 'Pending' }),
//         SELECT.one.from(GRPaymentStatus).where({ grPayStatus: 'Partially Paid' })
//     ]);

//     const [poClosed, poOpen, poPartial] = await Promise.all([
//         SELECT.one.from(POStatus).where({ poStatus: 'Closed' }),
//         SELECT.one.from(POStatus).where({ poStatus: 'Open' }),
//         SELECT.one.from(POStatus).where({ poStatus: 'Partial' })
//     ]);

//     // Initialize logic variables
//     let finalGrStatus = statAccepted, finalPayStatus = payPaid, finalPoStatus = poClosed;

//     // 2. RUN THE LOOP FOR DATA PROCESSING
//     for (const gritem of selectedGR.grItems) {
//         // Logic to determine overall status
//         if (gritem.quantityDamaged > 0) {
//             if (gritem.quantityDamaged === gritem.quantityReceived) {
//                 finalGrStatus = statReturned; finalPayStatus = payPending; finalPoStatus = poOpen;
//             } else {
//                 finalGrStatus = statPartial; finalPayStatus = payPartial; finalPoStatus = poPartial;
//             }
//         }

//         // Update individual PO Items
//         const effectiveQty = (Number(gritem.quantityReceived) || 0) - (Number(gritem.quantityDamaged) || 0);
//         await UPDATE(POItems).set({ itemsYetToReceive: { '-=': effectiveQty } }).where({ ID: gritem.poItem_ID });
        
//         await addToInventory(gritem, req);
//         await updateLedger(gritem, req);
//     }

//     // 3. UPDATE HEADERS ONCE (After the loop)
//     await UPDATE(GR).set({ status_ID: finalGrStatus.ID, paymentStatus_ID: finalPayStatus.ID }).where({ ID });
//     await UPDATE(PO).set({ status_ID: finalPoStatus.ID }).where({ ID: selectedGR.originalPO_ID });

//     return SELECT.one.from(GR).where({ ID });
// });

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

        console.log("Processing item:");
        const { ID } = req.params[0]; //id of GR
        const selectedGR = await SELECT.one.from(GR)
            .where({ ID: ID })
            .columns(g => {
                g('*'), // Get all fields from GR
                    g.grItems('*') // Expand and get all fields from items
            });

        if (!selectedGR) return req.error(404, "GR not found");
        if (!selectedGR.grItems) return req.error(400, "This GR has no items to approve");

        let grStatusRecord, grPaymentStatus, poStatusRecord, status = 'Accepted', payment = 'Paid', postatus = 'Closed';

        grStatusRecord = await SELECT.one.from(GRStatus).where({ grStatus: 'StockRcvd_InspectionInProgress' });
        if (!grStatusRecord) return req.error(404, `Status ${status} not found`);
        if(selectedGR.status_ID !== grStatusRecord.ID ){
            return req.error(400,'GR Already Inspected & Approved')
        }

        const grItemInspectStatus = await SELECT.one.from(GRItemInspectStatus).where({ inspectStatus: 'Inspected' });
        if (!grItemInspectStatus) return req.error(404, `Status ${grItemInspectStatus} not found`)

        for (const gritem of selectedGR.grItems) {
            if (gritem.inspectionStatus_ID !== grItemInspectStatus.ID) {
                return req.error(400, 'Some Items are Remaining to Be Inspected. Inspect all Before Approving.')
            }
            if (gritem.quantityDamaged !== 0) {
                if (gritem.quantityDamaged === gritem.quantityReceived) {

                    status = 'Returned'; payment = 'Pending', postatus = 'Open';
                } else {

                    status = 'Partial Return'; payment = 'Partially Paid', postatus = 'Partial';

                }


            }

            grStatusRecord = await SELECT.one.from(GRStatus).where({ grStatus: status });
            if (!grStatusRecord) return req.error(404, `Status ${status} not found`);
            grPaymentStatus = await SELECT.one.from(GRPaymentStatus).where({ grPayStatus: payment });
            if (!grPaymentStatus) return req.error(404, `Status ${payment} not found`);
            poStatusRecord = await SELECT.one.from(POStatus).where({ poStatus: postatus })
            if (!poStatusRecord) return req.error(404, `Status ${postatus} not found`)

            // await UPDATE(GR).set({ status_ID: grStatusRecord.ID, paymentStatus_ID: grPaymentStatus.ID }).where({ ID: ID })
            // await UPDATE(PO).set({ status_ID: poStatusRecord.ID }).where({ ID: selectedGR.originalPO_ID })
            await UPDATE(POItems).set({ itemsYetToReceive: { '-=': gritem.quantityReceived - gritem.quantityDamaged } }).where({ ID: gritem.poItem_ID })
            await addToInventory(gritem, req);
            await updateLedger(gritem, req);


        }

await UPDATE(GR).set({ status_ID: grStatusRecord.ID, paymentStatus_ID: grPaymentStatus.ID }).where({ ID: ID })
            await UPDATE(PO).set({ status_ID: poStatusRecord.ID }).where({ ID: selectedGR.originalPO_ID })
        req.info("GR Appropriately Approved")
        req.info("Items Stocked | PO Statuses Updated | Ledger Updated")
        return SELECT.one.from(GR).where({ ID: ID });
    })


    async function addToInventory(gritem, req) {
        //fetch gritem row -> required poItem:assoc to POItems
        //using that fetch POItems => required poItem:assoc to Items
        //this poItem_ID is attached to inventoryItem_ID (inventoryItem_ID:assoc to Items) 
        // const { POItems, Items, InventoryStatus, Inventory } = entities;
        const poitem = await SELECT.one.from(POItems).where({ ID: gritem.poItem_ID })
        if (!poitem) {
            return req.error(404, "Requested POItem Not found")
        }

        const item = await SELECT.one.from(Items).where({ ID: poitem.poItem_ID })
        if (!item) {
            return req.error(404, "Requested Item not found")
        }

        const inventoryStatus = await SELECT.one.from(InventoryStatus).where({ invStatus: 'AVAILABLE' })
        if (!inventoryStatus) {
            return req.error(404, "Status 'Available' Not found")
        }

        // let itemcostprice = (item.itemBasePrice + ((item.itemBasePrice * item.gstPercent) / 100));
        const basePrice = Number(item.itemBasePrice) || 0;
    const gst = Number(item.gstPercent) || 0;

    // 2. Perform the calculation safely
    const rawCost = basePrice + ((basePrice * gst) / 100);
    
    // 3. Round it only after confirming rawCost is a valid number
    let itemcostprice = !isNaN(rawCost) ? Number(rawCost.toFixed(2)) : 0;
        // let itemcostprice = Number((item.itemBasePrice + ((item.itemBasePrice * item.gstPercent) / 100)).toFixed(2));

        const existingStock = await SELECT.one.from(Inventory).where({ inventoryItem_ID: item.ID })
        if (existingStock) {
            await UPDATE(Inventory).set({
                quantity: { '+=': (gritem.quantityReceived - gritem.quantityDamaged) },
                costPrice: itemcostprice,
                status_ID: inventoryStatus.ID,
            }).where({ ID: existingStock.ID })
        } else {
            await INSERT.into(Inventory).entries({
                inventoryItem_ID: item.ID,
                quantity: gritem.quantityReceived - gritem.quantityDamaged,
                costPrice: itemcostprice,
                status_ID: inventoryStatus.ID,
                criticality: 10

            })
        }
    }


    async function updateLedger(gritem, req) {
        const poitem = await SELECT.one.from(POItems).where({ ID: gritem.poItem_ID })
        if (!poitem) {
            return req.error(404, "Requested POItem Not found")
        }

        const item = await SELECT.one.from(Items).where({ ID: poitem.poItem_ID })
        if (!item) {
            return req.error(404, "Requested Item not found")
        }

        let itemcostprice = (Number(item.itemBasePrice) + ((Number(item.itemBasePrice) * Number(item.gstPercent)) / 100));
        
        const deptRecord = await SELECT.one.from(Departments).where({ dept: 'PROCUREMENT' });
        if (!deptRecord) return req.error(400, 'Invalid Department');
        
        const debitRecord = await SELECT.one.from(PassbookEntryTypes).where({ entryType: 'DEBIT' })
        if (!debitRecord) return req.error(400, 'DEBIT not found')
            
            const lastEntry = await SELECT.one.from(RetailLedger)
            .columns('currentBalance')
            .orderBy('createdAt desc');
            
        const previousBalance = lastEntry ? Number(lastEntry.currentBalance) : 0;
        // let newBalance = previousBalance - (itemcostprice*(gritem.quantityReceived - gritem.quantityDamaged));
        let transactionAmount = Number((itemcostprice * (gritem.quantityReceived - gritem.quantityDamaged)).toFixed(2));
    let newBalance = Number((previousBalance - transactionAmount).toFixed(2));


        await INSERT.into(RetailLedger).entries({
            entryType_ID:debitRecord.ID,
            department_ID:deptRecord.ID,
            amount:transactionAmount,
            currentBalance:newBalance
        })

    }
}
