sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"distributoraccessportal/test/integration/pages/MockDistributorsList",
	"distributoraccessportal/test/integration/pages/MockDistributorsObjectPage",
	"distributoraccessportal/test/integration/pages/IndependentDistributorObjectPage"
], function (JourneyRunner, MockDistributorsList, MockDistributorsObjectPage, IndependentDistributorObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('distributoraccessportal') + '/test/flp.html#app-preview',
        pages: {
			onTheMockDistributorsList: MockDistributorsList,
			onTheMockDistributorsObjectPage: MockDistributorsObjectPage,
			onTheIndependentDistributorObjectPage: IndependentDistributorObjectPage
        },
        async: true
    });

    return runner;
});

