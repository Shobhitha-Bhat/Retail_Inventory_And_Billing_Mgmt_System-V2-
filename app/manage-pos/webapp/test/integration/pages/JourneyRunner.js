sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"managepos/test/integration/pages/POList",
	"managepos/test/integration/pages/POObjectPage",
	"managepos/test/integration/pages/POItemsObjectPage"
], function (JourneyRunner, POList, POObjectPage, POItemsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('managepos') + '/test/flp.html#app-preview',
        pages: {
			onThePOList: POList,
			onThePOObjectPage: POObjectPage,
			onThePOItemsObjectPage: POItemsObjectPage
        },
        async: true
    });

    return runner;
});

