using DistributorService as service from '../../srv/distributor-service';
using from '../../srv/finance-service';

annotate FinanceService.RetailLedger with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : department_ID,
            Label : 'department',
        },
        {
            $Type : 'UI.DataField',
            Value : entryType_ID,
            Label : 'entryType',
        },
        {
            $Type : 'UI.DataField',
            Value : amount,
            Label : 'amount',
        },
        {
            $Type : 'UI.DataField',
            Value : currentBalance,
            Label : 'currentBalance',
        },
        {
            $Type : 'UI.DataField',
            Value : createdAt,
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Entry Information',
            ID : 'EntryInformation',
            Target : '@UI.FieldGroup#EntryInformation',
        },
    ],
    UI.FieldGroup #EntryInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ID,
                Label : 'ID',
            },
            {
                $Type : 'UI.DataField',
                Value : department_ID,
                Label : 'department_ID',
            },
            {
                $Type : 'UI.DataField',
                Value : amount,
                Label : 'amount',
            },
            {
                $Type : 'UI.DataField',
                Value : currentBalance,
                Label : 'currentBalance',
            },
            {
                $Type : 'UI.DataField',
                Value : entryType_ID,
                Label : 'entryType_ID',
            },
        ],
    },
);

annotate FinanceService.RetailLedger with {
    department @(
        Common.ExternalID : department.dept,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Departments',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : department_ID,
                    ValueListProperty : 'ID',
                },
            ],
        },
        Common.ValueListWithFixedValues : true,
    )
};

annotate FinanceService.RetailLedger with {
    entryType @Common.ExternalID : entryType.entryType
};

