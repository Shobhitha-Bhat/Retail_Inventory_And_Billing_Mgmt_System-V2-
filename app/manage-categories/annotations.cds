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
                Label : 'status',
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
            Value : status.catStatus,
            Label : 'catStatus',
        },
        {
            $Type : 'UI.DataFieldForActionGroup',
            Actions : [
                {
                    $Type : 'UI.DataFieldForAction',
                    Action : 'MasterDataService.continueCategory',
                    Label : 'continueCategory',
                },
                {
                    $Type : 'UI.DataFieldForAction',
                    Action : 'MasterDataService.discontinueCategory',
                    Label : 'discontinueCategory',
                },
            ],
            ID : 'ContinueDiscontinue',
            Label : 'Continue/Discontinue',
        },
    ],
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : categoryName,
        },
        TypeName : '',
        TypeNamePlural : '',
        Description : {
            $Type : 'UI.DataField',
            Value : status.catStatus,
        },
    },
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
                Label : 'status',
            },
            {
                $Type : 'UI.DataField',
                Value : itemBasePrice,
                Label : 'itemBasePrice',
            },
            {
                $Type : 'UI.DataField',
                Value : totalCostprice,
                Label : 'totalCostprice',
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
            Value : status_ID,
            Label : 'status',
        },
        {
            $Type : 'UI.DataFieldForActionGroup',
            Actions : [
                {
                    $Type : 'UI.DataFieldForAction',
                    Action : 'MasterDataService.discontinueItems',
                    Label : 'discontinueItems',
                },
                {
                    $Type : 'UI.DataFieldForAction',
                    Action : 'MasterDataService.continueItems',
                    Label : 'continueItems',
                },
            ],
            ID : 'ContinueDiscontinue',
            Label : 'Continue/Discontinue',
        },
        {
            $Type : 'UI.DataField',
            Value : totalCostprice,
            Label : 'totalCostprice',
        },
    ],
    UI.DataPoint #gstPercent : {
        Value : gstPercent,
    },
    UI.Chart #gstPercent : {
        ChartType : #Line,
        Measures : [
            gstPercent,
        ],
        MeasureAttributes : [
            {
                DataPoint : '@UI.DataPoint#gstPercent',
                Role : #Axis1,
                Measure : gstPercent,
            },
        ],
        Dimensions : [
            marginPercent,
        ],
    },
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : itemName,
        },
        TypeName : '',
        TypeNamePlural : '',
    },
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

