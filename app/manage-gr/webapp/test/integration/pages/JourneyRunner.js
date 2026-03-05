sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"managegr/test/integration/pages/GRList",
	"managegr/test/integration/pages/GRObjectPage",
	"managegr/test/integration/pages/GRItemsObjectPage"
], function (JourneyRunner, GRList, GRObjectPage, GRItemsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('managegr') + '/test/flp.html#app-preview',
        pages: {
			onTheGRList: GRList,
			onTheGRObjectPage: GRObjectPage,
			onTheGRItemsObjectPage: GRItemsObjectPage
        },
        async: true
    });

    return runner;
});

