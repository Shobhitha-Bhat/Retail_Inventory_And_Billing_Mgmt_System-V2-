using {my.retailshop as db} from '../db/schema';

service ProcurementService{
    entity PO as projection on db.PO
    actions{
        action approvePO();
        action closePO() returns PO;

    }
    entity POItems as projection on db.POItems;


    entity GR as projection on db.GR
    actions{
        action approveGR() returns GR;
    }
    entity GRItems as projection on db.GRItems;
}