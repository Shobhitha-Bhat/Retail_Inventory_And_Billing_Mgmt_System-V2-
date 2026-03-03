using {my.retailshop as db} from '../db/schema';

service DistributorService{
    entity Distributors as projection on db.MockDistributors
    actions{
        action triggerGR();
    }
}