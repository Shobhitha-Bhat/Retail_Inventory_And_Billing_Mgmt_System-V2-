sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"managecustomer/test/integration/pages/CustomersList",
	"managecustomer/test/integration/pages/CustomersObjectPage"
], function (JourneyRunner, CustomersList, CustomersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('managecustomer') + '/test/flp.html#app-preview',
        pages: {
			onTheCustomersList: CustomersList,
			onTheCustomersObjectPage: CustomersObjectPage
        },
        async: true
    });

    return runner;
});

