sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"ledger/test/integration/pages/RetailLedgerList",
	"ledger/test/integration/pages/RetailLedgerObjectPage"
], function (JourneyRunner, RetailLedgerList, RetailLedgerObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('ledger') + '/test/flp.html#app-preview',
        pages: {
			onTheRetailLedgerList: RetailLedgerList,
			onTheRetailLedgerObjectPage: RetailLedgerObjectPage
        },
        async: true
    });

    return runner;
});

