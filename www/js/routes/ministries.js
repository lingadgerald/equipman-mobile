(function (ng) {
	'use strict';

	ng.module('routes').config(configBlock);

	configBlock.$inject = ['$stateProvider'];
	function configBlock($stateProvider) {
		var baseUrl = 'templates/tab-items';
		var ministries = {
			items: {
				url: '/:ministryId/items',
				views: {
					'tab-items@tab': {
						templateUrl: baseUrl + '/items.html',
						controller: 'ItemsCtrl as vm'
					}
				}
			},
			itemDetails: {
				url: '/:itemId/details',
				views: {
					'tab-items@tab': {
						templateUrl: baseUrl + '/item-details.html',
						controller: 'ItemDetailsCtrl as vm'
					}
				}
			},
			itemAdd: {
				url: '/tab/ministries/add',
				cache: false,
				templateUrl: baseUrl + '/item-forms.html',
				controller: 'ItemFormsCtrl as vm'
			}
		};

		$stateProvider
			.state('ministry-item-add', ministries.itemAdd)
			.state('tab.ministries.items', ministries.items)
			.state('tab.ministries.items.details', ministries.itemDetails)
		;
	}
})(angular);
