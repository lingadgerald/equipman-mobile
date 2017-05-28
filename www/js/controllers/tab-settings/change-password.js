(function (ng) {
	'use strict';

	ng.module('controllers').controller('ChangePasswordCtrl', ChangePasswordCtrl);

	ChangePasswordCtrl.$inject = [
		'$ionicHistory',
		'$ionicPopup',
		'$rootScope',
		'$stateParams',
		'$scope',
		'$state',
		'User'
	];
	function ChangePasswordCtrl(
		$ionicHistory,
		$ionicPopup,
		$rootScope,
		$stateParams,
		$scope,
		$state,
		User
	) {
		var vm = this;
		vm.$ionicHistory = $ionicHistory;
		vm.$ionicPopup = $ionicPopup;
		vm.$rootScope = $rootScope;
		vm.$stateParams = $stateParams;
		vm.$scope = $scope;
		vm.$state = $state;
		vm.User = User;

		vm.currentUser = User.currentUser();
		vm.title = 'Change Password';
		vm.model = {};
		vm.fields = vm.getFormFields();
		vm.options = {
			formState: {
				readOnly: false,
				action: 'edit'
			}
		}
		vm.conditions = {}
	}

	ChangePasswordCtrl.prototype.getFormFields = function() {
		return [
			{
				key: 'currentPassword',
				type: 'stacked-input',
				templateOptions: {
					type: 'password',
					label: 'Current Password',
					placeholder: 'Current Password',
					required: true
				},
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
				}
			},
			{
				key: 'password',
				type: 'stacked-input',
				templateOptions: {
					type: 'password',
					label: 'New Password',
					placeholder: 'New Password',
					required: true
				},
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
				}
			},
			{
				key: 'confirmPassword',
				type: 'stacked-input',
				templateOptions: {
					type: 'password',
					label: 'Re-type New Password',
					placeholder: 'Re-type New Password'
				},
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
				}
			}
		];
	};

	ChangePasswordCtrl.prototype.handleOnCancel = function() {
		var vm = this;
		vm.model = {};
		if (!!vm.$ionicHistory.backView()) {
			console.log('goBack');
			vm.$ionicHistory.goBack();
		} else {
			console.log('goState');
			vm.$state.go('tab.settings');
		}
	};

	ChangePasswordCtrl.prototype.handleOnSubmit = function() {
		var vm = this;
		var model = ng.copy(vm.model);
		var resource = 'data.user';
		vm.options.formState.readOnly = true;
		vm.$rootScope.$broadcast('loading:show');

		if (model.password === model.confirmPassword) {
			var params = {
				where: 'user.email = \'' + vm.currentUser.email + '\''
			};

			vm.User.save(resource + '@get', params).then((res) => {
				var obj = ng.copy(res.data[0]);
				obj.password = model.password;
				return vm.User.save(resource + '@put', obj);
			}).then((res) => {
				console.log('password changed');
				vm.handleOnCancel();
			}).catch((err) => {
				vm.$rootScope.$broadcast('alert-error:show');
			}).finally(() => {
				vm.options.formState.readOnly = false;
				vm.$rootScope.$broadcast('loading:hide');
			});
		} else {
			vm.$ionicPopup.alert({
				title: 'Error changing your password',
				template: 'Confirm password does not match your new password'
			});
		}
	};
})(angular);
