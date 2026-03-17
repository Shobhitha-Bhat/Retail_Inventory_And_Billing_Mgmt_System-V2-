using {my.retailshop as db} from '../db/schema';

service InventoryService{
    
    entity Inventory as projection on db.Inventory;
    entity InventoryStatus as projection on db.InventoryStatus;

}