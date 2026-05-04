using {my.retailshop as db} from '../db/schema';

service InventoryService @(restrict: [
    { grant: 'READ', to: 'Auditor' },
    { grant: '*',    to: 'ProductManager' }
]){
    
    entity Inventory as projection on db.Inventory;
    entity InventoryStatus as projection on db.InventoryStatus;

}