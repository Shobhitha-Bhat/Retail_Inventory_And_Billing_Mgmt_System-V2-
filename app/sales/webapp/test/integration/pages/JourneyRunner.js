sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"sales/test/integration/pages/SalesList",
	"sales/test/integration/pages/SalesObjectPage",
	"sales/test/integration/pages/SalesItemsObjectPage"
], function (JourneyRunner, SalesList, SalesObjectPage, SalesItemsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('sales') + '/test/flp.html#app-preview',
        pages: {
			onTheSalesList: SalesList,
			onTheSalesObjectPage: SalesObjectPage,
			onTheSalesItemsObjectPage: SalesItemsObjectPage
        },
        async: true
    });

    return runner;
});

