sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"managecategories/test/integration/pages/CategoriesList",
	"managecategories/test/integration/pages/CategoriesObjectPage",
	"managecategories/test/integration/pages/ItemsObjectPage"
], function (JourneyRunner, CategoriesList, CategoriesObjectPage, ItemsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('managecategories') + '/test/flp.html#app-preview',
        pages: {
			onTheCategoriesList: CategoriesList,
			onTheCategoriesObjectPage: CategoriesObjectPage,
			onTheItemsObjectPage: ItemsObjectPage
        },
        async: true
    });

    return runner;
});

