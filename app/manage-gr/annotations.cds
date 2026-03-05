using ProcurementService as service from '../../srv/procurement-service';
annotate service.GR with @(
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
                Label : 'paymentStatus',
                Value : paymentStatus,
            },
            {
                $Type : 'UI.DataField',
                Label : 'totalAmount',
                Value : totalAmount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'amountPaid',
                Value : amountPaid,
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
            $Type : 'UI.DataField',
            Value : originalPO_ID,
            Label : 'originalPO_ID',
        },
        {
            $Type : 'UI.DataField',
            Label : 'status',
            Value : status,
        },
        {
            $Type : 'UI.DataField',
            Label : 'paymentStatus',
            Value : paymentStatus,
        },
        {
            $Type : 'UI.DataField',
            Label : 'totalAmount',
            Value : totalAmount,
        },
        {
            $Type : 'UI.DataField',
            Label : 'amountPaid',
            Value : amountPaid,
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'ProcurementService.approveGR',
            Label : 'approveGR',
        },
    ],
);

annotate service.GR with {
    originalPO @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'PO',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : originalPO_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'status',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'totalAmount',
            },
        ],
    }
};

annotate service.GRItems with @(
    UI.LineItem #GRItems : [
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'ProcurementService.markInspected',
            Label : 'markInspected',
        },
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
            Value : poItem_ID,
            Label : 'poItem_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : inspectionStatus,
            Label : 'inspectionStatus',
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

