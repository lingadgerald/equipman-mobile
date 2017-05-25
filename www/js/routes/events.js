(function (ng) {
	'use strict';

	ng.module('routes').config(configBlock);

	configBlock.$inject = ['$stateProvider'];
	function configBlock($stateProvider) {
		var baseUrl = 'templates/tab-events';
		var events = {
			ministry: {
				url 	: '/:eventId/ministries',
				views : {
					'tab-events': {
						templateUrl: baseUrl + '/ministries.html',
						// controller : 'EventMinistriesCtrl as vm'
					}
				}
			},
			ministryItem: {
				url 	: '/events/:eventId/ministries/:ministryId/items',
				views : {
					'tab-events': {
						templateUrl: baseUrl + '/checked-items.html',
						// controller : 'CheckedItemsCtrl as vm'
					}
				}
			}
		};

		$stateProvider
			.state('tab.event-ministries', events.ministry)
			.state('tab.event-ministry-items', events.ministryItem)
		;
	}
})(angular);
