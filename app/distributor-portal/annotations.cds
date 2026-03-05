using DistributorService as service from '../../srv/distributor-service';
using from '../../db/schema';

annotate service.Distributors with @(
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
            Label : 'Received PO''s',
            ID : 'ReceivedPOs',
            Target : 'receievedPOs/@UI.LineItem#ReceivedPOs',
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
        {
            $Type : 'UI.DataField',
            Label : 'status',
            Value : status,
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
            Value : location,
        },
    },
);

annotate service.PO with @(
    UI.LineItem #ReceivedPOs : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'status',
        },
        {
            $Type : 'UI.DataField',
            Value : totalAmount,
            Label : 'totalAmount',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'DistributorService.triggerGR',
            Label : 'triggerGR',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'POItems',
            ID : 'POItems',
            Target : 'poItems/@UI.LineItem#POItems',
        },
    ],
    UI.FieldGroup #POItems : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    },
);

annotate service.POItems with @(
    UI.LineItem #POItems : [
        {
            $Type : 'UI.DataField',
            Value : parentPO_ID,
            Label : 'parentPO_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : itemPrice,
            Label : 'itemPrice',
        },
        {
            $Type : 'UI.DataField',
            Value : items.itemName,
            Label : 'itemName',
        },
        {
            $Type : 'UI.DataField',
            Value : openQty,
            Label : 'openQty',
        },
    ]
);

