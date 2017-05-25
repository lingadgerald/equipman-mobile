(function (ng) {
	'use strict';

	ng.module('app.event', []).config(Config);

	Config.$inject = ['$stateProvider'];
	function Config($stateProvider) {
		$stateProvider
			.state('app.tabs.events', {
				url		 : '/events',
				params : {name: 'events'},
				// cache	 : false,
				views	 : {
					'events@app.tabs': {
						templateUrl: 'templates/app/list.html',
						controller : 'ListCtrl as ctrl'
					}
				},
				resolve: {
					ListData: function (MainService) {
						return MainService.getData({name: 'events', group: 'app'});
					}
				}
			})
			.state('app.tabs.events.attendance', {
				url		 : '/:event/attendance',
				params : {event: ''},
				// cache	 : false,
				views	 : {
					'events@app.tabs': {
						templateUrl: 'templates/app/attendance.html',
						controller : 'AttendanceCtrl as ctrl'
					}
				},
				resolve: {
					ListData: function (MainService) {
						return MainService.getData({name: 'attendance', group: 'app'});
					}
				}
			})
			.state('app.tabs.events.ministries', {
				url		 : '/:event/ministries',
				params : {event: ''},
				// cache	 : false,
				views	 : {
					'events@app.tabs': {
						templateUrl: 'templates/app/list_btn_header.html',
						controller : 'ListCtrl as ctrl'
					}
				},
				resolve: {
					ListData: function (MainService) {
						return MainService.getData({name: 'event_ministries', group: 'app'});
					}
				}
			})
			.state('app.tabs.events.ministries.items', {
				abstract: true,
				url			: '/:ministry',
				params	: {ministry: ''},
				views		: {
					'events@app.tabs': {
						templateUrl: 'templates/core/content-sub_tabs.html',
						controller : 'SubTabCtrl as ctrl'
					}
				},
				resolve: {
					SubTabData: function (MainService) {
						return MainService.getData({name: 'event_items', group: 'app'});
					}
				}
			})
			.state('app.tabs.events.ministries.items.checked', {
				url		: '/checked',
				params: {checked: 'checkedIn'},
				// cache	: false,
				views	: {
					'checked@app.tabs.events.ministries.items': {
						templateUrl: 'templates/app/checked_list.html',
						controller : 'CheckedListCtrl as ctrl'
					}
				},
				resolve: {
					ListData: function (MainService) {
						return MainService.getData({name: 'event_items', group: 'app'});
					}
				}
			})
			.state('app.tabs.events.ministries.items.checked.details', {
				url		: '/items/:item',
				params: {item: ''},
				views	: {
					'checked@app.tabs.events.ministries.items': {
						templateUrl: 'templates/app/details.html',
						controller : 'DetailCtrl as ctrl'
					}
				},
				resolve: {
					DetailData: function (MainService) {
						return MainService.getData({name: 'event_items', group: 'app'});
					}
				}
			})
			.state('app.tabs.events.ministries.items.assign_members', {
				url		: '/checked/assign_members',
				params: {},
				views	: {
					'events@app.tabs': {
						templateUrl: 'templates/app/assign_member.html',
						controller : 'AssignMemberCtrl as ctrl'
					}
				},
				resolve: {
					ListData: function (MainService) {
						return MainService.getData({name: 'assign_members', group: 'app'});
					}
				}
			})
		;
	}
})(angular);