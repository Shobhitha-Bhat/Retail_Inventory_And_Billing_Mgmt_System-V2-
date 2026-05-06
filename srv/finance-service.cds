using {my.retailshop as db} from '../db/schema';

service FinanceService @(requires: ['authenticated-user','Auditor','FinanceManager','SystemAdmin']){

    @(restrict: [
        { grant: 'READ', to: 'Auditor' },
        { grant: '*', to: 'FinanceManager' },
        {grant:'*',to:'SystemAdmin'}
    ])
    entity RetailLedger as projection on db.RetailLedger;

    @readonly
    entity PassbookEntryTypes as projection on db.PassbookEntryTypes;
    
    @readonly
    entity Departments as projection on db.Departments;
}