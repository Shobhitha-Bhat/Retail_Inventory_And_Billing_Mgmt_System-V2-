namespace my.retailshop;

using {
    cuid,
    managed
} from '@sap/cds/common';


//MASTER_DATA
entity Categories : cuid, managed {
    categoryName : String;
    catItems     : Association to many Items
                       on catItems.category = $self;
    status : String enum {
        ACTIVE;        
        NO_MORE_SOLD;    
    };
}

entity Items : cuid, managed {
    itemName  : String;
    marginPercent : Decimal(5,2);
    gstPercent    : Decimal(5,2);
    category  : Association to Categories;
    status : String enum {
        ACTIVE;
        DISCONTINUED;
    };
}

entity MockDistributors : cuid, managed {
    distributorName : String;
    location:String;
    status          : String enum {
        ACTIVE;
        INACTIVE;
        BLOCKED;
    };
}

entity MockCustomers : cuid, managed {
    customername : String;
    city         : String;
}


//PROCUREMENT
entity PO : cuid, managed {
    status   : String enum {
        Open;
        Closed;
        Partial;
    }
    poItems  : Composition of many POItems
                   on poItems.parentPO = $self;
    supplier : Association to MockDistributors;
}

entity POItems : cuid, managed {
    parentPO : Association to PO;
    items    : Association to Items;
    quantity : Integer;

    //Based on Mutual Agreement with the Distributor.
    //for transactional data snapshot to keep previous data
    gstPercent    : Decimal(5,2);  
    itemPrice : Decimal(10,2);   
}


//INVENTORY
entity Inventory : cuid, managed {
    item     : Association to Items;
    quantity : Integer;
    costPrice:Decimal(10, 2);
    criticality:Integer;
    status:String enum{
        LOWSTOCK;
        AVAILABLE;
    }
}

entity GR : cuid, managed {
    originalPO : Association to PO;
    status     : String enum {
        Accepted;
        Returned;
        PartialReturn;
    }
    grItems    : Composition of many GRItems
                     on grItems.parentGR = $self;

}

entity GRItems : cuid, managed {
    parentGR         : Association to GR;
    items            : Association to Items;
    quantityReceived : Integer;
    quantityDamaged  : Integer;

}


//SALES
entity Sales : cuid, managed {
    customer      : Association to MockCustomers;
    items         : Composition of many SalesItems
                        on items.parentSales = $self;
    paymentStatus : String enum {
        Pending;
        Paid;
    }
    returnStatus  : String enum {
        None;
        Partial;
        CompleteReturn;
    }
}

entity SalesItems : cuid, managed {
    parentSales : Association to Sales;
    item        : Association to Items;
    quantity    : Integer;
    costPrice     : Decimal(10,2);   // from Inventory
    gstPercent    : Decimal(5,2);    // output GST from Inventory
    marginPercent : Decimal(5,2);    // from Items
    sellingPrice  : Decimal(10,2);   // calculated
    totalAmount   : Decimal(12,2);
}

entity SalesReturns : cuid, managed {
    originalSales : Association to Sales;
    returnItems   : Composition of many SalesReturnItems
                        on returnItems.parentReturn = $self;
}

entity SalesReturnItems : cuid, managed {
    parentReturn : Association to SalesReturns;
    item         : Association to Items;
    quantity     : Integer;

}


