sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"inventory/test/integration/pages/InventoryList",
	"inventory/test/integration/pages/InventoryObjectPage"
], function (JourneyRunner, InventoryList, InventoryObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('inventory') + '/test/flp.html#app-preview',
        pages: {
			onTheInventoryList: InventoryList,
			onTheInventoryObjectPage: InventoryObjectPage
        },
        async: true
    });

    return runner;
});

