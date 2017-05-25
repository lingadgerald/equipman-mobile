(function (ng) {
	'use strict';

	ng.module('controllers').controller('TabCtrl', TabCtrl);

	TabCtrl.$inject = [];
	function TabCtrl() {
		var vm = this;
		vm.platform = ionic.Platform.platform();
		vm.tabs = {};
		vm.init();
	}

	TabCtrl.prototype.init = function() {
		var vm = this, tabs = {
			event: {
				title: 'Events',
				name: 'events',
				href: '#/events',
				iconDefault: 'ion-calendar',
				iconAndroid: 'ion-android-calendar',
				iconIosOn: 'ion-ios-calendar',
				iconIosOff: 'ion-ios-calendar-outline'
			},
			item: {
				title: 'Items',
				name: 'items',
				href: '#/ministries',
				iconDefault: 'ion-bag',
				iconIosOn: 'ion-ios-box',
				iconIosOff: 'ion-ios-box-outline'
			},
			setting: {
				title: 'Settings',
				name: 'settings',
				href: '#/settings',
				iconDefault: 'ion-gear-b',
				// iconAndroid: 'ion-android-calendar',
				// iconIosOn: 'ion-ios-calendar',
				// iconIosOff: 'ion-ios-calendar-outline'
			}
		};
		ng.forEach(tabs, function(tab) {
			switch (vm.platform) {
				case 'android':
					if (('iconAndroidOn' in tab) && ('iconAndroidOff' in tab)) {
						tab.iconOn 	= tab.iconAndroidOn;
						tab.iconOff = tab.iconAndroidOff
					} else if ('iconAndroid' in tab) {
						tab.iconOn 	= tab.iconAndroid;
						tab.iconOff = tab.iconAndroid
					} else {
						tab.iconOn  = tab.iconDefault;
						tab.iconOff = tab.iconDefault;
					}
					break;
				case 'ios':
					if (('iconIosOn' in tab) && ('iconIosOff' in tab)) {
						tab.iconOn 	= tab.iconIosOn;
						tab.iconOff = tab.iconIosOff
					} else if ('iconIos' in tab) {
						tab.iconOn 	= tab.iconIos;
						tab.iconOff = tab.iconIos
					} else {
						tab.iconOn  = tab.iconDefault;
						tab.iconOff = tab.iconDefault;
					}
					break;
				default:
					tab.iconOn  = tab.iconDefault;
					tab.iconOff = tab.iconDefault;
					break;
			}
		});
		vm.tabs = tabs;
	};
})(angular);
