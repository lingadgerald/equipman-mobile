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
					'tab-events@tab': {
						templateUrl: baseUrl + '/ministries.html',
						controller : 'EventMinistriesCtrl as vm'
					}
				}
			},
			ministryItem: {
				url 	: '/:ministryId/items',
				views : {
					'tab-events@tab': {
						templateUrl: baseUrl + '/checked-items.html',
						controller : 'CheckedItemsCtrl as vm'
					}
				}
			}
		};

		$stateProvider
			.state('tab.events.ministries', events.ministry)
			.state('tab.events.ministries.items', events.ministryItem)
		;
	}
})(angular);
