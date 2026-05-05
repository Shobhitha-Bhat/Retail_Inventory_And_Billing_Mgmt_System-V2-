using {my.retailshop as db} from '../db/schema';

service ProcurementService @(requires: ['authenticated-user','Auditor','POManager','POStaff']){

    entity Distributors        as projection on db.MockDistributors;
    entity Items               as projection on db.Items;
    entity IndependentDistributor as projection on db.IndependentDistributor;
    entity DistributorOrderItems as projection on db.DistributorOrderItems;
    entity RequestStatus as projection on db.RequestStatus;
    entity InventoryStatus as projection on db.InventoryStatus;
    entity Inventory as projection on db.Inventory;

    entity RetailLedger as projection on db.RetailLedger;
    entity PassbookEntryTypes as projection on db.PassbookEntryTypes;
    entity Departments as projection on db.Departments;

@(restrict: [
    { grant: 'READ', to: 'Auditor' },
    { grant: ['READ', 'CREATE', 'UPDATE', 'DELETE', 'closePO', 'openPO'],    to: 'POStaff' },
    { grant: '*',    to: 'POManager' }
])
    entity PO  as projection on db.PO 
        actions {
            // action approvePO() returns PO;
            @(restrict: [{ to: 'POManager' }])
            action approvePO() returns PO;
            action closePO()   returns PO;
            action openPO()    returns PO;
        };

    entity POStatus as projection on db.POStatus;
    entity POItems as projection on db.POItems as POI;


@(restrict: [
    { grant: 'READ', to: 'Auditor' },
    { grant: 'READ',    to: 'POStaff' },
    { grant: '*',    to: 'POManager' }
])
    entity GR as projection on db.GR
        actions {
            @(restrict: [{ to: 'POManager' }])
            action approveGR() returns GR;
        }

    entity GRStatus as projection on db.GRStatus;
    entity GRItems as projection on db.GRItems
        actions {
            @(restrict: [
    { grant: 'READ', to: 'Auditor' },
    { grant: '*',    to: 'POStaff' },
    { grant: '*',    to: 'POManager' }
])
            action markInspected(quantityDamaged: Integer) returns GRItems;
        }

    entity GRItemInspectStatus as projection on db.GRItemInspectStatus;
    entity GRPaymentStatus     as projection on db.GRPaymentStatus;
}

annotate ProcurementService.GRItems with @Common.SideEffects : {
    TargetEntities : [ '$self' ] // This tells the UI to refresh the specific row/table
} 
actions {
    markInspected @(
        Common.SideEffects : {
            TargetEntities : [ '$self' ]
        }
    )
};