(function (ng) {
	'use strict';

	ng.module('app.item', []).config(Config);

	Config.$inject = ['$stateProvider'];
	function Config($stateProvider) {
		$stateProvider
			.state('app.tabs.ministries', {
				url		 : '/ministries',
				params : {name: 'ministries'},
				// cache	 : false,
				views	 : {
					'items@app.tabs': {
						templateUrl: 'templates/app/list_ministry.html',
						controller : 'ListCtrl as ctrl'
					}
				},
				resolve: {
					ListData: function (MainService) {
						return MainService.getData({name: 'ministries', group: 'app'});
					}
				}
			})
			.state('app.tabs.ministries.items', {
				url		 : '/:ministry/items',
				params : {ministry: ''},
				// cache	 : false,
				views	 : {
					'items@app.tabs': {
						templateUrl: 'templates/app/list_item.html',
						controller : 'ListCtrl as ctrl'
					}
				},
				resolve: {
					ListData: function (MainService) {
						return MainService.getData({name: 'items', group: 'app'});
					}
				}
			})
			.state('app.tabs.ministries.items.details', {
				url		 : '/:item',
				params : {item: ''},
				cache	 : false,
				views	 : {
					'items@app.tabs': {
						templateUrl: 'templates/app/details.html',
						controller : 'DetailCtrl as ctrl'
					}
				},
				resolve: {
					DetailData: function (MainService) {
						return MainService.getData({name: 'items', group: 'app'});
					}
				}
			})
		;
	}
})(angular);