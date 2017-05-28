(function (ng) {
	'use strict';

	ng.module('controllers').controller('SendItemsCtrl', SendItemsCtrl);

	SendItemsCtrl.$inject = [
		'$cordovaSms',
		'$ionicHistory',
		'$ionicPopup',
		'$rootScope',
		'$localStorage',
		'$stateParams',
		'$state',
		'$scope',
		'User',
		'Event',
		'Ministry',
		'Item'
	];
	function SendItemsCtrl(
		$cordovaSms,
		$ionicHistory,
		$ionicPopup,
		$rootScope,
		$localStorage,
		$stateParams,
		$state,
		$scope,
		User,
		Event,
		Ministry,
		Item
	) {
		var vm = this;
		vm.$cordovaSms = $cordovaSms;
		vm.$ionicHistory = $ionicHistory;
		vm.$ionicPopup = $ionicPopup;
		vm.$rootScope = $rootScope;
		vm.$localStorage = $localStorage;
		vm.$stateParams = $stateParams;
		vm.$state = $state;
		vm.$scope = $scope;
		vm.User = User;
		vm.Event = Event;
		vm.Ministry = Ministry;
		vm.Item = Item;

		vm.currentUser = User.currentUser();
		vm.event = {};
		vm.ministry = {};
		vm.list = vm.getListData() || [];
		vm.cpObj = {};
		vm.cpNumbers = [];
		vm.userNumbers = [];

		vm.init(vm);
	}

	SendItemsCtrl.prototype.init = function(vm) {
		vm.$rootScope.$broadcast('loading:show');
		vm.Event.get(vm.$stateParams.eventId).then((res) => {
			vm.event = res;
			vm.lsEventItems = vm.$localStorage[vm.event.code];
			return vm.Ministry.get(vm.$stateParams.ministryId);
		}).then((res) => {
			vm.ministry = res;
			ng.forEach(vm.lsEventItems, (val) => {
				if (val.mobile != null && vm.cpObj[val.mobile] == null) { vm.cpObj[val.mobile] = []; }
				if (vm.cpObj[val.mobile] != null) {
					var result = vm.userNumbers.filter((x) => x.mobile === val.mobile);
					if (result <= 0) {
						vm.userNumbers.push({mobile: val.mobile, name: val.name, checked: false});
					}
					vm.cpObj[val.mobile].push(val);
				}
			});
			vm.cpNumbers = Object.keys(vm.cpObj);
			console.log(vm.cpNumbers, vm.userNumbers);
		}).catch((err) => {
			vm.$rootScope.$broadcast('alert-error:show');
		}).finally(() => {
			vm.$rootScope.$broadcast('loading:hide');
		});
	};

	SendItemsCtrl.prototype.getListData = function() {
		return [
			{label: 'Send via email', model: 'email'},
			{label: 'Send via SMS', model: 'sms'},
			{label: 'Send via email and SMS', model: 'both'}
		];
	};

	SendItemsCtrl.prototype.handleOnCancel = function() {
		var vm = this;
		if (!!vm.$ionicHistory.backView()) {
			console.log('goBack');
			vm.$ionicHistory.goBack();
		} else {
			console.log('goState');
			vm.$state.go('tab.events');
		}
	};

	SendItemsCtrl.prototype.handleItemClicked = function(item) {
		var vm = this;
		switch (item.model) {
			case 'email':
				vm.sendEmail();
				break;
			case 'sms':
				vm.buildSMS();
				break;
			case 'both':
				break;
			default: break;
		}
	};

	SendItemsCtrl.prototype.buildSMS = function() {
		var vm = this;
		vm.$scope.userNumbers = vm.userNumbers;
		vm.$scope.model = {};

		vm.$ionicPopup.show({
			title: 'Send SMS to',
			scope: vm.$scope,
			template: [
				'<ion-scroll style="height: 165px;">',
					'<ion-list>',
						'<ion-radio',
							'ng-repeat="item in userNumbers"',
							'ng-model="model.mobile"',
							'ng-value="item.mobile"',
						'>',
							'<h2>{{item.name}}</h2>',
							'<p>{{item.mobile}}</p>',
						'</ion-radio>',
					'</ion-list>',
				'</ion-scroll>'
			].join(' '),
			buttons: [
				{text: 'Cancel', type: 'button-light'},
				{
					text: 'OK', type: 'button-positive', onTap: (ev) => {
						if (vm.$scope.model.mobile == null) {
							vm.$rootScope.$broadcast('toast:show', { message: 'Please select something' });
							ev.preventDefault();
						} else {
							return vm.$scope.model.mobile;
						}
					}
				}
			]
		}).then((res) => {
			if (!!res) { vm.sendSMS(res); }
		});
	};

	SendItemsCtrl.prototype.sendSMS = function(mobile) {
		var vm = this, str = '';
		vm.$rootScope.$broadcast('loading:show');
		var options = { replaceLineBreaks: true, android: {intent: 'INTENT'} };
		if (vm.cpObj[mobile] != null) {
			str = 'In event {name}, the items that I\'ve checked out using my phone are:'.format(vm.event);
			ng.forEach(vm.cpObj[mobile], (val) => {
				str += '\n{itemId}: {itemName} checked out by {coName}'.format(val);
			});
		}

		// -----
		console.log(str);
		vm.$rootScope.$broadcast('loading:hide');
		// -----

		document.addEventListener('deviceready', () => {
			vm.$cordovaSms.send(mobile, str, options).then((res) => {
				vm.$rootScope.$broadcast('toast:show', { message: 'Opening messaging app' });
				vm.handleOnCancel();
			}).catch((err) => {
				vm.$rootScope.$broadcast('alert-error:show');
			}).finally(() => {
				vm.$rootScope.$broadcast('loading:hide');
			});
		})
	};

	SendItemsCtrl.prototype.sendEmail = function() {
		var vm = this;
		vm.$rootScope.$broadcast('loading:show');
		vm.Item.sendEmail(vm.lsEventItems, vm.event.name, vm.currentUser).then((res) => {
			vm.$ionicPopup({
				title: 'Success',
				template: 'Email successfully sent'
			});
		}).catch((err) => {
			vm.$rootScope.$broadcast('alert-error:show');
		}).finally(() => {
			vm.$rootScope.$broadcast('loading:hide');
		});
	};
})(angular);
