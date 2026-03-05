sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"distributorportal/test/integration/pages/DistributorsList",
	"distributorportal/test/integration/pages/DistributorsObjectPage",
	"distributorportal/test/integration/pages/POObjectPage"
], function (JourneyRunner, DistributorsList, DistributorsObjectPage, POObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('distributorportal') + '/test/flp.html#app-preview',
        pages: {
			onTheDistributorsList: DistributorsList,
			onTheDistributorsObjectPage: DistributorsObjectPage,
			onThePOObjectPage: POObjectPage
        },
        async: true
    });

    return runner;
});

