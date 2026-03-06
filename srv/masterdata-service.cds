using {my.retailshop as db} from '../db/schema';

service MasterDataService{
    entity Categories as projection on db.Categories
    actions{
        action discontinueCategory() returns Categories;
    }

    entity CategoryStatus as projection on db.CategoryStatus;

    entity Items as projection on db.Items
    actions{
        action discontinueItems() returns Items;
    }

entity ItemStatus as projection on db.ItemStatus;
    //just viewing the customers
    entity Customers as projection on db.MockCustomers;

    entity Distributors as projection on db.MockDistributors
    actions{
        action inActivateDistributor() returns Distributors;
    }
    entity DistributorStatus as projection on db.DistributorStatus;
}