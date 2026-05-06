using {my.retailshop as db} from '../db/schema';

service InventoryService @(requires: ['authenticated-user','Auditor','ProductManager','SystemAdmin']) {
    
    @(restrict: [
    { grant: 'READ', to: 'Auditor' },
    { grant: '*',    to: 'ProductManager' },
    {grant:'*',to:'SystemAdmin'}
])
    entity Inventory as projection on db.Inventory;
    entity InventoryStatus as projection on db.InventoryStatus;

}