module.exports = function(){
    this.on('DELETE','PO',async(req)=>{
        req.reject(400,'PO cant be deleted. Close PO instead. ')
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