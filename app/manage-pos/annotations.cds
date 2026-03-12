using ProcurementService as service from '../../srv/procurement-service';
annotate service.PO with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataFieldForAction',
                Action : 'ProcurementService.approvePO',
                Label : 'approvePO',
            },
            {
                $Type : 'UI.DataField',
                Value : status_ID,
                Label : 'status',
            },
            {
                $Type : 'UI.DataField',
                Value : supplier_ID,
                Label : 'supplier_ID',
            },
            {
                $Type : 'UI.DataField',
                Value : totalPOAmount,
                Label : 'totalPOAmount',
            },
            {
                $Type : 'UI.DataField',
                Value : paidAmount,
                Label : 'paidAmount',
            },
            {
                $Type : 'UI.DataField',
                Value : remainingAmount,
                Label : 'remainingAmount',
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
            Label : 'POItems',
            ID : 'POItems',
            Target : 'poItems/@UI.LineItem#POItems',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'PO_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : totalPOAmount,
            Label : 'totalPOAmount',
        },
        {
            $Type : 'UI.DataField',
            Value : supplier_ID,
            Label : 'supplier_ID',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'ProcurementService.approvePO',
            Label : 'approvePO',
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
                    Action : 'ProcurementService.closePO',
                    Label : 'closePO',
                },
                {
                    $Type : 'UI.DataFieldForAction',
                    Action : 'ProcurementService.openPO',
                    Label : 'openPO',
                },
            ],
            ID : 'POStatus',
            Label : 'PO Status',
        },
    ],
);

annotate service.POItems with @(
    UI.LineItem #POItems : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : parentPO_ID,
            Label : 'parentPO_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : poItem_ID,
            Label : 'poItem',
        },
        {
            $Type : 'UI.DataField',
            Value : poItem.totalCostprice,
            Label : 'Unit Item CostPrice (Including GST)',
        },
        {
            $Type : 'UI.DataField',
            Value : itemsYetToReceive,
            Label : 'itemsYetToReceive',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Item Information',
            ID : 'ItemInformation',
            Target : '@UI.FieldGroup#ItemInformation1',
        },
    ],
    UI.FieldGroup #ItemInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : items.ID,
                Label : 'ID',
            },
            {
                $Type : 'UI.DataField',
                Value : items.itemName,
                Label : 'itemName',
            },
            {
                $Type : 'UI.DataField',
                Value : items.marginPercent,
                Label : 'marginPercent',
            },
            {
                $Type : 'UI.DataField',
                Value : items.gstPercent,
                Label : 'gstPercent',
            },
            {
                $Type : 'UI.DataField',
                Value : items.status,
                Label : 'status',
            },
        ],
    },
    UI.FieldGroup #ItemInformation1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ID,
                Label : 'ID',
            },
            {
                $Type : 'UI.DataField',
                Value : poItem_ID,
                Label : 'poItem_ID',
            },
            {
                $Type : 'UI.DataField',
                Value : quantity,
                Label : 'UnitsRequired',
            },
            {
                $Type : 'UI.DataField',
                Value : poItem.gstPercent,
                Label : 'gstPercent',
            },
            {
                $Type : 'UI.DataField',
                Value : poItem.itemBasePrice,
                Label : 'itemBasePrice',
            },
            {
                $Type : 'UI.DataField',
                Value : poItem.totalCostprice,
                Label : 'UnitItemCostprice(including GST)',
            },
        ],
    },
);

annotate service.PO with {
    status @(
        Common.ExternalID : status.poStatus,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'POStatus',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'POStatus',
        },
        Common.ValueListWithFixedValues : true,
)};

annotate service.PO with {
    supplier @(
        Common.ExternalID : supplier.distributorName,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Distributors',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : supplier_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Distributor',
        },
        Common.ValueListWithFixedValues : true,
)};

annotate service.POItems with {
    poItem @(
        Common.ExternalID : poItem.itemName,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Items',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : poItem_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'poItem',
        },
        Common.ValueListWithFixedValues : true,
)};

