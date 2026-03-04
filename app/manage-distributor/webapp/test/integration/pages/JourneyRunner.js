sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"managedistributor/test/integration/pages/DistributorsList",
	"managedistributor/test/integration/pages/DistributorsObjectPage"
], function (JourneyRunner, DistributorsList, DistributorsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('managedistributor') + '/test/flp.html#app-preview',
        pages: {
			onTheDistributorsList: DistributorsList,
			onTheDistributorsObjectPage: DistributorsObjectPage
        },
        async: true
    });

    return runner;
});

