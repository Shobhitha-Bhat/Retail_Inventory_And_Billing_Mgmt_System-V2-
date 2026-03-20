using {my.retailshop as db} from '../db/schema';

service FinanceService{

    //disable/hide Delete Edit Button
    // @Capabilities.UpdateRestrictions.Updatable : false
    // @Capabilities.DeleteRestrictions.Deletable : false
    entity RetailLedger as projection on db.RetailLedger;
    entity PassbookEntryTypes as projection on db.PassbookEntryTypes;
    entity Departments as projection on db.Departments;
}