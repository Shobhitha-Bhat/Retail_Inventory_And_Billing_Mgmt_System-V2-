using MasterDataService as service from '../../srv/masterdata-service';
annotate service.Distributors with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'distributorName',
                Value : distributorName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'location',
                Value : location,
            },
            {
                $Type : 'UI.DataField',
                Label : 'status',
                Value : status,
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
            Label : 'distributorName',
            Value : distributorName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'location',
            Value : location,
        },
        {
            $Type : 'UI.DataField',
            Label : 'status',
            Value : status,
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'MasterDataService.inActivateDistributor',
            Label : 'inActivateDistributor',
        },
    ],
);

