using ProcurementService as service from '../../srv/procurement-service';
annotate service.GR with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : status.grStatus,
                Label : 'grStatus',
            },
            {
                $Type : 'UI.DataField',
                Value : totalPOAmount,
                Label : 'totalPOAmount',
            },
            {
                $Type : 'UI.DataField',
                Value : paymentStatus_ID,
                Label : 'paymentStatus_ID',
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
            Label : 'GRItems',
            ID : 'GRItems',
            Target : 'grItems/@UI.LineItem#GRItems',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'ProcurementService.approveGR',
            Label : 'approveGR',
        },
        {
            $Type : 'UI.DataField',
            Value : status.grStatus,
            Label : 'grStatus',
        },
        {
            $Type : 'UI.DataField',
            Value : paymentStatus.grPayStatus,
            Label : 'grPayStatus',
        },
        {
            $Type : 'UI.DataField',
            Value : originalPO.ID,
            Label : 'poID',
        },
        {
            $Type : 'UI.DataField',
            Value : totalPOAmount,
            Label : 'totalPOAmount',
        },
        {
            $Type : 'UI.DataField',
            Value : currentOrderAmount,
            Label : 'currentOrderAmount',
        },
    ],
);

annotate service.GRItems with @(
    UI.LineItem #GRItems : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : parentGR_ID,
            Label : 'parentGR_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : poItem.poItem.itemName,
            Label : 'itemName',
        },
        {
            $Type : 'UI.DataField',
            Value : poItem_ID,
            Label : 'poItem_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : quantityDamaged,
            Label : 'quantityDamaged',
        },
        {
            $Type : 'UI.DataField',
            Value : quantityReceived,
            Label : 'quantityReceived',
        },
        {
            $Type : 'UI.DataField',
            Value : inspectionStatus.inspectStatus,
            Label : 'inspectStatus',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'ProcurementService.markInspected',
            Label : 'markInspected',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'GRItem Information',
            ID : 'GRItemInformation',
            Target : '@UI.FieldGroup#GRItemInformation',
        },
    ],
    UI.FieldGroup #GRItemInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    },
);

annotate service.GR with {
    paymentStatus @Common.ExternalID : paymentStatus.grPayStatus
};

