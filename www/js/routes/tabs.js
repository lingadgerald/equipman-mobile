(function (ng) {
	'use strict';

	ng.module('routes').config(configBlock);

	configBlock.$inject = ['$stateProvider'];
	function configBlock($stateProvider) {
		var tabs = {
			tab: {
				url: '/tab',
				abstract: true,
				templateUrl: 'templates/tabs.html',
				controller: 'TabCtrl as vm'
			},
			event: {
				url: '/events',
				views: {
					'tab-events': {
						templateUrl: 'templates/tab-events/app.html',
						controller: 'TabEventCtrl as vm'
					}
				}
			},
			item: {
				url: '/ministries',
				views: {
					'tab-items': {
						templateUrl: 'templates/tab-items/app.html',
						controller: 'TabItemCtrl as vm'
					}
				}
			},
			setting: {
				url: '/settings',
				views: {
					'tab-settings': {
						templateUrl: 'templates/tab-settings/app.html',
						controller: 'TabSettingCtrl as vm'
					}
				}
			}
		};

		$stateProvider
			.state('tab', tabs.tab)
			.state('tab.events', tabs.event)
			.state('tab.ministries', tabs.item)
			.state('tab.settings', tabs.setting)
		;
	}
})(angular);
