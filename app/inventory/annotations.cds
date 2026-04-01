using InventoryService as service from '../../srv/inventory-service';
annotate service.Inventory with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
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
                Value : inventoryItem.gstPercent,
                Label : 'gstPercent',
            },
            {
                $Type : 'UI.DataField',
                Value : inventoryItem.marginPercent,
                Label : 'marginPercent',
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
            Criticality : {
                $edmJson : {
                    $If : [
                        { $Lt : [ { $Path : 'quantity' }, 10 ] },
                        1, // If quantity < 10, return 1 (Red)
                        3  // Else, return 3 (Green) or 0 for neutral
                    ]
                }
            },
            CriticalityRepresentation : #WithoutIcon
        },
        {
            $Type : 'UI.DataField',
            Label : 'costPrice',
            Value : costPrice,
        },
        {
            $Type : 'UI.DataField',
            Value : status_ID,
            Label : 'status_ID',
        },
    ],
    UI.DataPoint #progress : {
        $Type : 'UI.DataPointType',
        Value : quantity,
        Title : 'quantity',
        TargetValue : 100,
        Visualization : #Progress,
    },
    UI.HeaderFacets : [
        
    ],
    UI.DataPoint #status_ID : {
        $Type : 'UI.DataPointType',
        Value : status_ID,
        Title : 'status_ID',
    },
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

annotate service.Inventory with {
    status @Common.ExternalID : status.invStatus
};

