using {my.retailshop as db} from '../db/schema';

service InventoryService @(requires: ['authenticated-user','Auditor','ProductManager']) {
    
    @(restrict: [
    { grant: 'READ', to: 'Auditor' },
    { grant: '*',    to: 'ProductManager' }
])
    entity Inventory as projection on db.Inventory;
    entity InventoryStatus as projection on db.InventoryStatus;

}