using {my.retailshop as db} from '../db/schema';

service ProcurementService {

    entity Distributors        as projection on db.MockDistributors;
    entity Items               as projection on db.Items;
    entity IndependentDistributor as projection on db.IndependentDistributor;
    entity DistributorOrderItems as projection on db.DistributorOrderItems;

    entity PO  as projection on db.PO 
        actions {
            // action approvePO() returns PO;
            action approvePO() returns PO;
            action closePO()   returns PO;
            action openPO()    returns PO;
        };

    entity POStatus as projection on db.POStatus;

    entity POItems as projection on db.POItems {
            *,
            @Core.Computed
            (
                quantity - coalesce(
                    //coalesce(a,b) if either of them is NULL the other is returned
                    (
                        select sum(g.quantityReceived - g.quantityDamaged) from db.GRItems as g
                        where
                            g.poItem.ID = ID
                    ), 0
                )
            ) as itemsYetToReceive : Integer
        }


    entity GR as projection on db.GR
        actions {
            action approveGR() returns GR;
        }

    entity GRStatus as projection on db.GRStatus;

    entity GRItems as projection on db.GRItems
        actions {
            action markInspected(quantityDamaged: Integer) returns GRItems;
        }

    entity GRItemInspectStatus as projection on db.GRItemInspectStatus;
    entity GRPaymentStatus     as projection on db.GRPaymentStatus;
}
