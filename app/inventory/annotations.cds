using InventoryService as service from '../../srv/inventory-service';
annotate service.Inventory with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'quantity',
                Value : quantity,
            },
            {
                $Type : 'UI.DataField',
                Label : 'costPrice',
                Value : costPrice,
            },
            {
                $Type : 'UI.DataField',
                Label : 'status',
                Value : status,
            },
            {
                $Type : 'UI.DataField',
                Value : inventoryItem.ID,
                Label : 'itemID',
            },
            {
                $Type : 'UI.DataField',
                Value : inventoryItem.itemName,
                Label : 'itemName',
            },
            {
                $Type : 'UI.DataField',
                Value : inventoryItem.gstPercent,
                Label : 'gstPercent',
            },
            {
                $Type : 'UI.DataField',
                Value : inventoryItem.marginPercent,
                Label : 'marginPercent',
            },
            {
                $Type : 'UI.DataField',
                Value : inventoryItem.category_ID,
                Label : 'category_ID',
            },
            {
                $Type : 'UI.DataField',
                Value : inventoryItem.status,
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
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : inventoryItem.itemName,
            Label : 'itemName',
        },
        {
            $Type : 'UI.DataField',
            Label : 'quantity',
            Value : quantity,
        },
        {
            $Type : 'UI.DataField',
            Label : 'costPrice',
            Value : costPrice,
        },
        {
            $Type : 'UI.DataField',
            Label : 'status',
            Value : status,
        },
    ],
);

annotate service.Inventory with {
    inventoryItem @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Items',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : inventoryItem_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'itemName',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'marginPercent',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'gstPercent',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'status',
            },
        ],
    }
};

