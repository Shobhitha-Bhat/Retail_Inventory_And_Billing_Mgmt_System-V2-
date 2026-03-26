using SalesService as service from '../../srv/sales-service';
using from '../../db/schema';

annotate service.Sales with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
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
            {
                $Type : 'UI.DataField',
                Value : returnStatus_ID,
                Label : 'returnStatus',
            },
            {
                $Type : 'UI.DataField',
                Value : paymentStatus_ID,
                Label : 'paymentStatus_ID',
            },
            {
                $Type : 'UI.DataField',
                Value : customer.contactNumber,
                Label : 'contactNumber',
            },
            {
                $Type : 'UI.DataFieldForAction',
                Action : 'SalesService.addnewCustomer',
                Label : 'addnewCustomer',
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
        {
            $Type : 'UI.DataField',
            Value : customer.customername,
            Label : 'customername',
        },
        {
            $Type : 'UI.DataField',
            Value : customer.city,
            Label : 'city',
        },
        {
            $Type : 'UI.DataField',
            Value : returnStatus.retStatus,
            Label : 'retStatus',
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
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : customer.customername,
        },
        TypeName : '',
        TypeNamePlural : '',
    },
);

annotate service.SalesItems with @(
    UI.LineItem #InvoiceItems : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
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
            Value : quantity,
            Label : 'quantity',
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
        {
            $Type : 'UI.DataField',
            Value : totalPayableAmount,
            Label : 'totalPayableAmount',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Purchased Item Information',
            ID : 'PurchasedItemInformation',
            Target : '@UI.FieldGroup#PurchasedItemInformation',
        },
    ],
    UI.FieldGroup #SalesItemInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ID,
                Label : 'ID',
            },
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
                Value : item.gstPercent,
                Label : 'gstPercent',
            },
            {
                $Type : 'UI.DataField',
                Value : item.itemBasePrice,
                Label : 'itemBasePrice',
            },
            {
                $Type : 'UI.DataField',
                Value : item.totalCostprice,
                Label : 'totalCostprice',
            },
            {
                $Type : 'UI.DataField',
                Value : quantity,
                Label : 'quantity',
            },
            {
                $Type : 'UI.DataField',
                Value : item.marginPercent,
                Label : 'marginPercent',
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
        ],
    },
    UI.FieldGroup #newsection : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    },
    UI.HeaderInfo : {
        TypeName : '',
        TypeNamePlural : '',
    },
    UI.FieldGroup #PurchasedItemInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ID,
                Label : 'ID',
            },
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
                Value : item.gstPercent,
                Label : 'gstPercent',
            },
            {
                $Type : 'UI.DataField',
                Value : item.itemBasePrice,
                Label : 'itemBasePrice',
            },
            {
                $Type : 'UI.DataField',
                Value : item.totalCostprice,
                Label : 'totalCostprice',
            },
            {
                $Type : 'UI.DataField',
                Value : item.marginPercent,
                Label : 'marginPercent',
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
                Value : discountPercent,
                Label : 'discountPercent',
            },
            {
                $Type : 'UI.DataField',
                Value : totalAmount,
                Label : 'totalAmount',
            },
            {
                $Type : 'UI.DataField',
                Value : totalPayableAmount,
                Label : 'totalPayableAmount',
            },
        ],
    },
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
    UI.LineItem #tableView1 : [
    ],
    UI.SelectionPresentationVariant #tableView1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView1',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Table View SalesReturns 1',
    },
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
    returnStatus @(
        Common.ExternalID : returnStatus.retStatus,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'SalesReturnStatus',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : returnStatus_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'ReturnStatus',
        },
        Common.ValueListWithFixedValues : true,
)};

annotate service.Sales with {
    customer @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'MockCustomers',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : customer_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Customers',
        },
        Common.ValueListWithFixedValues : true,
        Common.ExternalID : customer.customername,
)};



annotate service.SalesItems with {
    item @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Items',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : item_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Item',
        },
        Common.ValueListWithFixedValues : true,
        Common.ExternalID : item.itemName,
        )};

annotate service.Sales with {
    paymentStatus @(
        Common.ExternalID : paymentStatus.payStatus,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'SalesPayStatus',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : paymentStatus_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Paymentstatus',
        },
        Common.ValueListWithFixedValues : true,
)};


annotate service.MockCustomers with {
    customername @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'MockCustomers',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : customername,
                    ValueListProperty : 'customername',
                },
            ],
            Label : 'customer name',
        },
        Common.ValueListWithFixedValues : true,
        Common.Text : contactNumber,
        Common.Text.@UI.TextArrangement : #TextLast,
)};

annotate service.Items with {
    itemName @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Items',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : itemName,
                    ValueListProperty : 'itemName',
                },
            ],
            Label : 'Itemname',
        },
        Common.ValueListWithFixedValues : true,
)};

annotate service.SalesItems with {
    discountPercent @Common.FieldControl : #Mandatory
};

