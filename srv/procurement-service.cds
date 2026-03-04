using {my.retailshop as db} from '../db/schema';

service ProcurementService{
    entity PO as projection on db.PO
    actions{
        action approvePO(); 
    }

    entity POItems as projection on db.POItems{
       *,
    @Core.Computed
    (
        quantity -
        coalesce(         //coalesce(a,b) if either of them is NULL the other is returned
            ( select sum(g.quantityReceived - g.quantityDamaged)
              from db.GRItems as g
              where g.poItem.ID = ID
            ), 0
        )
    ) as openQty : Integer
    }


    entity GR as projection on db.GR
    actions{
        action approveGR() returns GR;
    }
    entity GRItems as projection on db.GRItems
    actions{
        action markInspected(quantityDamaged:Integer) returns GRItems;
    }
}