sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"passbook/test/integration/pages/RetailLedgerList",
	"passbook/test/integration/pages/RetailLedgerObjectPage"
], function (JourneyRunner, RetailLedgerList, RetailLedgerObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('passbook') + '/test/flp.html#app-preview',
        pages: {
			onTheRetailLedgerList: RetailLedgerList,
			onTheRetailLedgerObjectPage: RetailLedgerObjectPage
        },
        async: true
    });

    return runner;
});

