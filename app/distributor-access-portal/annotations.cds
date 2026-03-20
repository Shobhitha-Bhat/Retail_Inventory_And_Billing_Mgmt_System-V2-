using DistributorService as service from '../../srv/distributor-service';
annotate service.MockDistributors with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'distributorName',
                Value : distributorName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'location',
                Value : location,
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
            Label : 'Received Po''s',
            ID : 'ReceivedPos',
            Target : 'portalAccess/@UI.LineItem#ReceivedPos',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'distributorName',
            Value : distributorName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'location',
            Value : location,
        },
    ],
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : distributorName,
        },
        TypeName : '',
        TypeNamePlural : '',
        Description : {
            $Type : 'UI.DataField',
            Value : ID,
        },
    },
);

annotate service.IndependentDistributor with @(
    UI.LineItem #ReceivedPos : [
        {
            $Type : 'UI.DataField',
            Value : poID,
            Label : 'poID',
        },
        {
            $Type : 'UI.DataField',
            Value : toDistributor_ID,
            Label : 'toDistributor_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : totalOrderAmount,
            Label : 'totalOrderAmount',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'DistributorService.triggerGRtoRetailer',
            Label : 'triggerGRtoRetailer',
        },
        {
            $Type : 'UI.DataField',
            Value : requestStatus_ID,
            Label : 'requestStatus',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'DistributorService.closeRequest',
            Label : 'closeRequest',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Items in PO Invoice',
            ID : 'ItemsinPOInvoice',
            Target : 'orderItems/@UI.LineItem#ItemsinPOInvoice',
        },
    ],
);

annotate service.DistributorOrderItems with @(
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Items In PO Request',
            ID : 'ItemsInPORequest',
            Target : '@UI.FieldGroup#ItemsInPORequest',
        },
    ],
    UI.FieldGroup #ItemsInPORequest : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : itemName,
                Label : 'itemName',
            },
            {
                $Type : 'UI.DataField',
                Value : itemBasePrice,
                Label : 'itemBasePrice',
            },
            {
                $Type : 'UI.DataField',
                Value : gstPercent,
                Label : 'gstPercent',
            },
            {
                $Type : 'UI.DataField',
                Value : quantity,
                Label : 'quantity',
            },
            {
                $Type : 'UI.DataField',
                Value : totalCostprice,
                Label : 'totalCostprice',
            },
        ],
    },
    UI.LineItem #ItemsinPOInvoice : [
        {
            $Type : 'UI.DataField',
            Value : itemName,
            Label : 'itemName',
        },
        {
            $Type : 'UI.DataField',
            Value : itemBasePrice,
            Label : 'itemBasePrice',
        },
        {
            $Type : 'UI.DataField',
            Value : gstPercent,
            Label : 'gstPercent',
        },
        {
            $Type : 'UI.DataField',
            Value : totalCostprice,
            Label : 'UnitItemCostprice',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : itemsYetToSend,
            Label : 'itemsYetToSend',
        },
    ],
);

annotate service.IndependentDistributor with {
    requestStatus @Common.ExternalID : requestStatus.reqStatus
};

