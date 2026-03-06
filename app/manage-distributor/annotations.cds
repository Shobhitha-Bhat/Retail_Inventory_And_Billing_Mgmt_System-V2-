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
                Value : status_ID,
                Label : 'status_ID',
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
            $Type : 'UI.DataFieldForAction',
            Action : 'MasterDataService.inActivateDistributor',
            Label : 'inActivateDistributor',
        },
        {
            $Type : 'UI.DataField',
            Value : status.distriStatus,
            Label : 'distriStatus',
        },
    ],
);

annotate service.Distributors with {
    status @(
        Common.ExternalID : status.distriStatus,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'DistributorStatus',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'DistributorStatus',
        },
        Common.ValueListWithFixedValues : true,
)};

