using {my.retailshop as db} from '../db/schema';

service MasterDataService{
    entity Categories as projection on db.Categories
    actions{
        action discontinueCategory() returns Categories;
    }


    entity Items as projection on db.Items
    actions{
        action discontinueItems() returns Items;
    }


    entity Customers as projection on db.MockCustomers;

    entity Distributors as projection on db.MockDistributors
    actions{
        action inActivateDistributor() returns Distributors;
        action blockDistributor() returns Distributors;
    }
}