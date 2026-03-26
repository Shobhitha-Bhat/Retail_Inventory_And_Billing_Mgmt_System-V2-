using {my.retailshop as db} from '../db/schema';

service SalesService{
    entity Sales as projection on db.Sales
    actions{
        action payForPurchase() returns Sales;
        action returnEntirePurchase() returns Sales;
        action generateInvoice() returns LargeBinary;
        action addnewCustomer(customername:String,city:String,contactNumber:String(20));
    }

    entity SalesPayStatus as projection on db.SalesPayStatus;
    entity SalesReturnStatus as projection on db.SalesReturnStatus;
    entity MockCustomers as projection on db.MockCustomers;
    entity Items as projection on db.Items;

    
    entity SalesItems as projection on db.SalesItems
    actions{
        action removeItemsFromShopping(quantity:Integer) returns SalesItems;    //before paying for a purchase
        action returnItems(quantity:Integer) returns SalesItems;               // after paying 
    }

    entity SalesReturns as projection on db.SalesReturns;
   // entity SalesReturnItems as projection on db.SalesReturnItems;   already exposed by SalesReturns and since no bound actions to this its not projected explicitly
}