using SalesService as service from '../../srv/sales-service';
using from '../../db/schema';

annotate service.Sales with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'paymentStatus',
                Value : paymentStatus,
            },
            {
                $Type : 'UI.DataField',
                Label : 'returnStatus',
                Value : returnStatus,
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
            Label : 'Invoice Items',
            ID : 'InvoiceItems',
            Target : 'items/@UI.LineItem#InvoiceItems',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'paymentStatus',
            Value : paymentStatus,
        },
        {
            $Type : 'UI.DataField',
            Label : 'returnStatus',
            Value : returnStatus,
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'SalesService.generateInvoice',
            Label : 'generateInvoice',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'SalesService.payForPurchase',
            Label : 'payForPurchase',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'SalesService.returnEntirePurchase',
            Label : 'returnEntirePurchase',
        },
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : customer_ID,
            Label : 'customer_ID',
        },
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Sales',
    },
);

annotate service.SalesItems with @(
    UI.LineItem #InvoiceItems : [
        {
            $Type : 'UI.DataField',
            Value : parentSales_ID,
            Label : 'parentSales_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : item_ID,
            Label : 'item_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : item.itemName,
            Label : 'itemName',
        },
        {
            $Type : 'UI.DataField',
            Value : gstPercent,
            Label : 'gstPercent',
        },
        {
            $Type : 'UI.DataField',
            Value : marginPercent,
            Label : 'marginPercent',
        },
        {
            $Type : 'UI.DataField',
            Value : costPrice,
            Label : 'costPrice',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : sellingPrice,
            Label : 'sellingPrice',
        },
        {
            $Type : 'UI.DataField',
            Value : totalAmount,
            Label : 'totalAmount',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'SalesService.removeItemsFromShopping',
            Label : 'removeItemsFromShopping',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'SalesService.returnItems',
            Label : 'returnItems',
        },
    ]
);

annotate service.SalesReturns with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : originalSales_ID,
            Label : 'originalSales_ID',
        },
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'SalesReturns',
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Returning Items',
            ID : 'ReturningItems',
            Target : 'returnItems/@UI.LineItem#ReturningItems',
        },
    ],
);

annotate service.SalesReturnItems with @(
    UI.LineItem #ReturningItems : [
        {
            $Type : 'UI.DataField',
            Value : parentReturn_ID,
            Label : 'parentReturn_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : item_ID,
            Label : 'item_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : item.totalAmount,
            Label : 'totalAmount',
        },
    ]
);

annotate service.Sales with {
    paymentStatus @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Sales',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : paymentStatus,
                    ValueListProperty : 'paymentStatus',
                },
            ],
            Label : 'Status',
        },
        Common.ValueListWithFixedValues : true,
)};

