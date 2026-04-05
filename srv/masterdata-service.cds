using {my.retailshop as db} from '../db/schema';


service MasterDataService{
    entity Categories as projection on db.Categories
    actions{
        action discontinueCategory() returns Categories;
        action continueCategory() returns Categories;
    }

    entity CategoryStatus as projection on db.CategoryStatus;

    entity Items as projection on db.Items
    actions{
        action discontinueItems() returns Items;
        action continueItems() returns Items;
    }

entity ItemStatus as projection on db.ItemStatus;
    //just viewing the customers
    entity Customers as projection on db.MockCustomers;

    entity Distributors as projection on db.MockDistributors
    actions{
        action inActivateDistributor() returns Distributors;
        action activateDistributor() returns Distributors;
    }
    entity DistributorStatus as projection on db.DistributorStatus;
}

// annotate MasterDataService.Categories with @(restrict: [
//     { grant: '*', to: 'admin' },
//     { grant: ['READ', 'discontinueCategory', 'continueCategory'], to: 'categorymanager' },
//     { grant: 'READ', to: 'support' }
// ]);