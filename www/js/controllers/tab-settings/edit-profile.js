(function (ng) {
	'use strict';

	ng.module('controllers').controller('EditProfileCtrl', EditProfileCtrl);

	EditProfileCtrl.$inject = [
		'$ionicHistory',
		'$rootScope',
		'$stateParams',
		'$scope',
		'$state',
		'User'
	];
	function EditProfileCtrl(
		$ionicHistory,
		$rootScope,
		$stateParams,
		$scope,
		$state,
		User
	) {
		var vm = this;
		vm.$ionicHistory = $ionicHistory;
		vm.$rootScope = $rootScope;
		vm.$stateParams = $stateParams;
		vm.$scope = $scope;
		vm.$state = $state;
		vm.User = User;

		vm.currentUser = User.currentUser();
		vm.title = 'Edit Profile';
		vm.model = vm.currentUser;
		vm.fields = vm.getFormFields();
		vm.options = {
			formState: {
				readOnly: false,
				action: 'edit'
			}
		}
		vm.conditions = {}
	}

	EditProfileCtrl.prototype.getFormFields = function() {
		return [
			{
				key: 'firstname',
				type: 'stacked-input',
				templateOptions: {
					type: 'text',
					label: 'First Name',
					placeholder: 'First Name',
					required: true
				},
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
				}
			},
			{
				key: 'lastname',
				type: 'stacked-input',
				templateOptions: {
					type: 'text',
					label: 'Last Name',
					placeholder: 'Last Name',
					required: true
				},
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
				}
			},
			{
				key: 'email',
				type: 'stacked-input',
				templateOptions: {
					type: 'text',
					label: 'Email Address',
					placeholder: 'Email Address'
				},
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
				}
			},
			{
				key: 'ministry.name',
				type: 'stacked-input',
				templateOptions: {
					type: 'text',
					label: 'Ministry',
					placeholder: 'Ministry'
				},
				expressionProperties: {
					'templateOptions.disabled': 'true'
				}
			}
		];
	};

	EditProfileCtrl.prototype.handleOnCancel = function() {
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

	EditProfileCtrl.prototype.handleOnSubmit = function() {
		var vm = this;
		var model = ng.copy(vm.model);
		var resource = 'data.member@put';
		vm.options.formState.readOnly = true;
		vm.$rootScope.$broadcast('loading:show');

		model.name = '{firstname} {lastname}'.format(model);

		vm.User.save(resource, model).then((res) => {
			console.log('user saved:', res);
			vm.User.currentUser(res);
			vm.handleOnCancel();
		}).catch((err) => {
			vm.$rootScope.$broadcast('alert-error:show');
		}).finally(() => {
			vm.options.formState.readOnly = false;
			vm.$rootScope.$broadcast('loading:hide');
		});
	};
})(angular);
