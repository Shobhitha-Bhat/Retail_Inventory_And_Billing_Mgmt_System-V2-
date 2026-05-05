using {my.retailshop as db} from '../db/schema';

service FinanceService @(requires: ['authenticated-user','Auditor','FinanceManager']){

    @(restrict: [
        { grant: 'READ', to: 'Auditor' },
        { grant: '*', to: 'FinanceManager' }
    ])
    entity RetailLedger as projection on db.RetailLedger;

    @readonly
    entity PassbookEntryTypes as projection on db.PassbookEntryTypes;
    
    @readonly
    entity Departments as projection on db.Departments;
}