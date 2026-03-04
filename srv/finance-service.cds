using {my.retailshop as db} from '../db/schema';

service Financeservice{

    //disable/hide Delete Edit Button
    @Capabilities.UpdateRestrictions.Updatable : false
    @Capabilities.DeleteRestrictions.Deletable : false
    entity RetailLedger as projection on db.RetailLedger;
}