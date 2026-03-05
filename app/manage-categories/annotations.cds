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
            Label : 'status',
            Value : status,
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

