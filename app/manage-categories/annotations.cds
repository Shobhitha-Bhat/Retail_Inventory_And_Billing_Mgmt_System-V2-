using MasterDataService as service from '../../srv/masterdata-service';
annotate service.Categories with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'categoryName',
                Value : categoryName,
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
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Items In Category',
            ID : 'ItemsInCategory',
            Target : 'catItems/@UI.LineItem#ItemsInCategory',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'categoryName',
            Value : categoryName,
        },
        {
            $Type : 'UI.DataField',
            Value : catItems.itemName,
            Label : 'itemName',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'MasterDataService.discontinueCategory',
            Label : 'discontinueCategory',
        },
        {
            $Type : 'UI.DataField',
            Value : status.catStatus,
            Label : 'catStatus',
        },
    ],
);

annotate service.Items with @(
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Item Information',
            ID : 'ItemInformation',
            Target : '@UI.FieldGroup#ItemInformation',
        },
    ],
    UI.FieldGroup #ItemInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ID,
                Label : 'ID',
            },
            {
                $Type : 'UI.DataField',
                Value : itemName,
                Label : 'itemName',
            },
            {
                $Type : 'UI.DataField',
                Value : marginPercent,
                Label : 'marginPercent',
            },
            {
                $Type : 'UI.DataField',
                Value : gstPercent,
                Label : 'gstPercent',
            },
            {
                $Type : 'UI.DataField',
                Value : status_ID,
                Label : 'status_ID',
            },
        ],
    },
    UI.LineItem #ItemsInCategory : [
        {
            $Type : 'UI.DataField',
            Value : itemName,
            Label : 'itemName',
        },
        {
            $Type : 'UI.DataField',
            Value : marginPercent,
            Label : 'marginPercent',
        },
        {
            $Type : 'UI.DataField',
            Value : gstPercent,
            Label : 'gstPercent',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'MasterDataService.discontinueItems',
            Label : 'discontinueItems',
        },
    ],
);

annotate service.Categories with {
    status @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'CategoryStatus',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'CategoryStatus',
        },
        Common.ValueListWithFixedValues : true,
        Common.ExternalID : status.catStatus,
)};

annotate service.CategoryStatus with {
    ID @Common.Text : catStatus
};

annotate service.Items with {
    status @(
        Common.ExternalID : status.itStatus,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'ItemStatus',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'ItemStatus',
        },
        Common.ValueListWithFixedValues : true,
)};

