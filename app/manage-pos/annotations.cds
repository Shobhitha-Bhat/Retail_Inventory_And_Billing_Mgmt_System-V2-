using ProcurementService as service from '../../srv/procurement-service';
annotate service.PO with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'totalAmount',
                Value : totalAmount,
            },
            {
                $Type : 'UI.DataFieldForAction',
                Action : 'ProcurementService.approvePO',
                Label : 'approvePO',
            },
            {
                $Type : 'UI.DataField',
                Value : status_ID,
                Label : 'status_ID',
            },
            {
                $Type : 'UI.DataField',
                Value : supplier_ID,
                Label : 'supplier_ID',
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
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : supplier_ID,
            Label : 'supplier_ID',
        },
        {
            $Type : 'UI.DataField',
            Label : 'totalAmount',
            Value : totalAmount,
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'ProcurementService.approvePO',
            Label : 'approvePO',
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
            Value : itemPrice,
            Label : 'itemPrice',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : openQty,
            Label : 'openQty',
        },
        {
            $Type : 'UI.DataField',
            Value : poItem_ID,
            Label : 'poItem',
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
                Value : poItem.itemName,
                Label : 'itemName',
            },
            {
                $Type : 'UI.DataField',
                Value : poItem.marginPercent,
                Label : 'marginPercent',
            },
            {
                $Type : 'UI.DataField',
                Value : poItem.gstPercent,
                Label : 'gstPercent',
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

