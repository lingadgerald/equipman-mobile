(function (ng) {
	'use strict';

	ng.module('routes').config(configBlock);

	configBlock.$inject = ['$stateProvider'];
	function configBlock($stateProvider) {
		var baseUrl = 'templates/tab-settings';
		var settings = {
			editProfile: {
				url: '/tab/settings/profile/edit',
				cache: false,
				templateUrl: baseUrl + '/profile-forms.html',
				controller: 'EditProfileCtrl as vm'
			},
			changePassword: {
				url: '/tab/settings/profile/change_password',
				templateUrl: baseUrl + '/profile-forms.html',
				controller: 'ChangePasswordCtrl as vm'
			},
			event: {
				url  : '/events',
				views: {
					'tab-settings@tab': {
						templateUrl: baseUrl + '/events.html',
						controller: 'TabEventCtrl as vm'
					}
				}
			},
			eventItem: {
				url  : '/:eventId/items',
				views: {
					'tab-settings@tab': {
						templateUrl: baseUrl + '/items.html',
						controller: 'SettingsItemCtrl as vm'
					}
				}
			}
		};

		$stateProvider
			.state('setting-profile-edit', settings.editProfile)
			.state('setting-profile-changepassword', settings.changePassword)
			.state('tab.settings.events', settings.event)
			.state('tab.settings.events.items', settings.eventItem)
		;
	}
})(angular);
