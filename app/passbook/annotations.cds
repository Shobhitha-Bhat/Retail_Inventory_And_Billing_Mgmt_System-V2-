using Financeservice as service from '../../srv/finance-service';
annotate service.RetailLedger with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'entryType',
                Value : entryType,
            },
            {
                $Type : 'UI.DataField',
                Label : 'department',
                Value : department,
            },
            {
                $Type : 'UI.DataField',
                Label : 'amount',
                Value : amount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'totalBalance',
                Value : totalBalance,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'amount',
            Value : amount,
        },
        {
            $Type : 'UI.DataField',
            Label : 'totalBalance',
            Value : totalBalance,
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
    ],
);

annotate service.RetailLedger with {
    department @Common.ExternalID : department.dept
};

annotate service.RetailLedger with {
    entryType @Common.ExternalID : entryType.entryType
};

