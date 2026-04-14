namespace my.retailshop;

using {
    cuid,
    managed
} from '@sap/cds/common';


//MASTER_DATA
@odata.draft.enabled
entity Categories : cuid, managed {
    categoryName : String;
    catItems     : Composition of many Items
                       on catItems.category = $self;
    // status       : String enum {
    //     ACTIVE;
    //     NO_MORE_SOLD;
    // };
    status:Association to CategoryStatus default '5d9165e4-6374-4a0c-b4aa-c5a1330bee05';
}

entity CategoryStatus:cuid{
    catStatus:String;

}

// @odata.draft.enabled
entity Items : cuid, managed {
    itemName      : String;
    category      : Association to Categories ;
    // status        : String enum {
    //     ACTIVE;
    //     DISCONTINUED;
    // };
    status:Association to ItemStatus default '7181a2e0-ba47-478a-adf2-6c49f8e8720d';
    itemBasePrice:Decimal(10,2);
    gstPercent    : Decimal(5, 2);
    totalCostprice:Decimal(10,2) = (itemBasePrice+((itemBasePrice*gstPercent)/100));
    marginPercent : Decimal(5, 2);

}

entity ItemStatus:cuid{
    itStatus:String;
}

@odata.draft.enabled
entity MockDistributors : cuid, managed {
    distributorName : String;
    location        : String;
    // status          : String enum {
    //     ACTIVE;
    //     INACTIVE;
    // };
    status:Association to DistributorStatus;
    // receievedPOs: Association to many PO on receievedPOs.supplier=$self;
    
    //inorder to show possible distribuors in distributor portal 
    portalAccess    : Association to many IndependentDistributor on portalAccess.toDistributor = $self;
}


entity DistributorStatus:cuid{
    distriStatus:String;
}


@odata.draft.enabled
entity MockCustomers : cuid, managed {
    customername : String;
    city         : String;
    contactNumber:String(20)  @UI.CreateHidden;
}



//PROCUREMENT
@odata.draft.enabled
entity PO : cuid, managed {
    // status   : String enum {
    //     Open;
    //     Closed;
    //     Partial;        
    // }
    status:Association to POStatus default '08ea8f8f-db3c-4b63-b3a4-4885b55d4346';
    poItems  : Composition of many POItems
                   on poItems.parentPO = $self;
    supplier : Association to MockDistributors;
    virtual totalPOAmount : Decimal(15, 2) ;
    virtual paidAmount: Decimal(15,2) ;
    virtual remainingAmount: Decimal(15,2) ;
    
}


entity POStatus:cuid{
    poStatus:String;
}


entity POItems : cuid, managed {
    parentPO   : Association to PO;
    poItem      : Association to Items;
    quantity   : Integer;
    itemsYetToReceive : Integer

    //Based on Mutual Agreement with the Distributor.
    //for transactional data snapshot to keep previous data
    // gstPercent : Decimal(5, 2);
    // itemPrice  : Decimal(10, 2);
}

entity GR : cuid, managed {
    originalPO : Association to PO;
    // status     : String enum {
    //     StockRcvd_InspectionInProgress;
    //     Accepted;
    //     Returned;
    //     PartialReturn;
    // }
    status:Association to GRStatus;
    grItems    : Composition of many GRItems
                     on grItems.parentGR = $self;
    // paymentStatus : String enum {
    //     Pending;
    //     PartiallyPaid;
    //     Paid;
    // };
    paymentStatus:Association to GRPaymentStatus;
    // totalAmount  : Decimal(15,2);   // actual payable amount
    // amountPaid   : Decimal(15,2);
    totalPOAmount : Decimal(15, 2) ;
    currentOrderAmount : Decimal(15,2);
    // virtual paidAmount: Decimal(15,2) ;
    // virtual remainingAmount: Decimal(15,2) ;
}

entity GRPaymentStatus:cuid{
    grPayStatus:String;
}

entity GRStatus:cuid{
    grStatus:String;
}

entity GRItems : cuid, managed {
    parentGR         : Association to GR;
    poItem           : Association to POItems;
    // items            : Association to Items;
    quantityReceived : Integer;
    quantityDamaged  : Integer;
    // inspectionStatus : String enum {
    //     Pending;
    //     Inspected;
    // };
    inspectionStatus:Association to GRItemInspectStatus;
}

entity GRItemInspectStatus:cuid{
    inspectStatus:String;
}

//INVENTORY
entity Inventory : cuid, managed {
    inventoryItem        : Association to Items;
    // inventoryItem: Association to POItems;
    quantity    : Integer;
    costPrice   : Decimal(10, 2);
    criticality : Integer;
    // status      : String enum {
    //     LOWSTOCK;
    //     AVAILABLE;
    // }
    status:Association to InventoryStatus;
}

entity InventoryStatus:cuid{
    invStatus:String;
}


//SALES
@odata.draft.enabled
entity Sales : cuid, managed {
    customer      : Association to MockCustomers;
    items         : Composition of many SalesItems
                        on items.parentSales = $self;
    // paymentStatus : String enum {
    //     Pending;
    //     Paid;
    // }
    // returnStatus  : String enum {
    //     None;
    //     Partial;
    //     CompleteReturn;
    // }
    paymentStatus:Association to SalesPayStatus default '78493af3-1732-450d-9970-ba53be69c9ac';
    returnStatus:Association to SalesReturnStatus default '2caa2484-0788-48bd-b45b-9f14ba6f3dd8';
    billTotal:Decimal(15,2) @Core.Computed;
}


entity SalesPayStatus:cuid{
    payStatus:String;
}

entity SalesReturnStatus:cuid{
    retStatus:String;
}


entity SalesItems : cuid, managed {
    parentSales   : Association to Sales;
    item          : Association to Items;

    // costPrice     : Decimal(10, 2); // from Inventory
    // gstPercent    : Decimal(5, 2); // output GST from Inventory
    // totalCostprice:Decimal(10,2) = (costPrice+((costPrice*gstPercent)/100));
    // marginPercent : Decimal(5, 2); // from Items

    quantity      : Integer;
    returnedQuantity:Integer default 0;
    itemStatus:Association to SalesItemStatus default '131ce0ae-758d-4144-b92d-8bf61abbf9a9' ;
    sellingPrice  : Decimal(10, 2) @Core.Computed; // calculated using item information
    totalAmount   : Decimal(12, 2) @Core.Computed; //calculated using selling price and quantity
    discountPercent:Decimal(10,2) default 0.00;  //entered using filling form
    totalPayableAmount:Decimal(12,2) @Core.Computed;//discounting from totalAmount
}

entity SalesItemStatus:cuid,managed{
    saleItStatus:String;
}
@odata.draft.enabled
entity SalesReturns : cuid, managed {
    originalSales : Association to Sales;
    returnItems   : Composition of many SalesReturnItems
                        on returnItems.parentReturn = $self;
}

entity SalesReturnItems : cuid, managed {
    parentReturn : Association to SalesReturns;
    saleitem         : Association to SalesItems;
    quantity     : Integer;

}


//FINANCE

@odata.draft.enabled
entity RetailLedger : cuid, managed {
    // entryType    : String enum {
    //     CREDIT; 
    //     DEBIT; 
    // };
    // department   : String enum {
    //     PROCUREMENT;
    //     SALES;
    //     MISC;
    //     INVESTMENT; 
    // };
    entryType:Association to PassbookEntryTypes;
    department:Association to Departments;
    amount       : Decimal(15, 2);
    currentBalance : Decimal(15, 2) @Core.Computed; // Running balance 
}

entity PassbookEntryTypes:cuid{
    entryType:String;
}

entity Departments:cuid{
    dept:String;
}


//================================================================//
//================================================================//
//============INDEPENDENT DISTRIBUTOR PORTAL======================//

entity IndependentDistributor:cuid,managed{
    poID:UUID;
    toDistributor : Association to MockDistributors;
    orderItems  : Composition of many DistributorOrderItems
                   on orderItems.parentDistributor = $self;
    virtual totalOrderAmount : Decimal(15, 2) ;
    requestStatus:Association to RequestStatus;
}

entity RequestStatus:cuid,managed{
    reqStatus:String;   //open ... close
}

entity DistributorOrderItems:cuid,managed{
    parentDistributor   : Association to IndependentDistributor;
    refPOItemID:UUID;
    itemName   : String;
    quantity   : Integer;
    itemsYetToSend : Integer;
    itemBasePrice:Decimal(10, 2);
    gstPercent    : Decimal(5, 2);
    totalCostprice:Decimal(10,2) = (itemBasePrice+((itemBasePrice*gstPercent)/100));
}
