using ProcurementService as service from '../../srv/procurement-service';
annotate service.PO with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'status',
                Value : status,
            },
            {
                $Type : 'UI.DataField',
                Label : 'totalAmount',
                Value : totalAmount,
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
            Label : 'status',
            Value : status,
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
            Value : items_ID,
            Label : 'items_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : items.itemName,
            Label : 'itemName',
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
    ],
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
);

