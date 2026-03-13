using {my.retailshop as db} from '../db/schema';

// service DistributorService{
//     entity Distributors as projection on db.MockDistributors;
//     entity PO as projection on db.PO
//     actions{
//         action triggerGR();
//     }
//     entity POItems as projection on db.POItems{
//        *,
//     @Core.Computed
//     (
//         quantity -
//         coalesce(         //coalesce(a,b) if either of them is NULL the other is returned
//             ( select sum(g.quantityReceived - g.quantityDamaged)
//               from db.GRItems as g
//               where g.poItem.ID = ID
//             ), 0
//         )
//     ) as openQty : Integer
//     }
// }

service DistributorService{
    entity MockDistributors as projection on db.MockDistributors;
    entity IndependentDistributor as projection on db.IndependentDistributor
    actions{
        action triggerGRtoRetailer();
    }
    entity DistributorOrderItems as projection on db.DistributorOrderItems;
}