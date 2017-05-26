(function (ng) {
	'use strict';

	ng.module('controllers').controller('ItemFormsCtrl', ItemFormsCtrl);

	ItemFormsCtrl.$inject = [
		'$ionicHistory',
		'$ionicPopup',
		'$rootScope',
		'$stateParams',
		'$scope',
		'$state',
		'Ministry',
		'Item'
	];
	function ItemFormsCtrl(
		$ionicHistory,
		$ionicPopup,
		$rootScope,
		$stateParams,
		$scope,
		$state,
		Ministry,
		Item
	) {
		var vm = this;
		vm.$ionicHistory = $ionicHistory;
		vm.$ionicPopup = $ionicPopup;
		vm.$rootScope = $rootScope;
		vm.$stateParams = $stateParams;
		vm.$scope = $scope;
		vm.$state = $state;
		vm.Ministry = Ministry;
		vm.Item = Item;

		vm.item = {};
		vm.model = {};
		vm.fields = [];
		vm.options = {
			formState: {
				readOnly: false,
				action: 'add'
			}
		}
		vm.conditions = {
			loadRelations: 'ministry,ownerMinistry,ownerMember'
		}

		vm.init(vm);
	}

	ItemFormsCtrl.prototype.init = function(vm) {
		if (vm.$stateParams.itemId != null) {
			vm.$rootScope.$broadcast('loading:show');
			vm.Item.get(vm.$stateParams.itemId, vm.conditions).then((res) => {
				vm.item = res;
				vm.model = ng.copy(res);
				vm.fields = vm.getFormFields();
			}).catch((err) => {
				vm.$ionicPopup.alert({
					title: 'Something went wrong!',
					template: 'Please try again later'
				});
			}).finally(() => {
				vm.$rootScope.$broadcast('loading:hide');
			});
		} else {
			vm.fields = vm.getFormFields();
		}
	};

	ItemFormsCtrl.prototype.getFormFields = function() {
		return [
			{
				key: 'image',
				type: 'image-input',
				templateOptions: {
					label: 'Image',
					placeholder: 'Image'
				}
			},
			{
				key: 'name',
				type: 'stacked-input',
				templateOptions: {
					type: 'text',
					label: 'Name',
					placeholder: 'Name',
					required: true
				},
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
				}
			},
			{
				key: 'itemId',
				type: 'stacked-input',
				templateOptions: {
					type: 'text',
					label: 'Item Id',
					placeholder: 'Item Id'
				},
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
				}
			},
			{
				key: 'ministry',
				type: 'select-modal',
				templateOptions: {
					label: 'Ministry',
					options: [],
					optionProperties: {
						resource: 'data.ministry',
						conditions: {
							where: 'deleted is null'
						}
					}
				}
			},
			{
				key: 'ownerVal',
				type: 'select-modal',
				templateOptions: {
					label: 'Owner Type',
					options: [
						{name: 'Ministry', value: 'ministry'},
						{name: 'Member', value: 'member'}
					],
					required: true
				}
			},
			{
				key: 'ownerMember',
				type: 'select-modal',
				templateOptions: {
					label: 'Owner Member',
					options: [],
					optionProperties: {
						resource: 'data.member',
						conditions: {
							where: 'deleted is null'
						}
					},
					required: true
				},
				hideExpression: '!(model.ownerVal === \'member\')'
			},
			{
				key: 'ownerMinistry',
				type: 'select-modal',
				templateOptions: {
					label: 'Owner Ministry',
					options: [],
					optionProperties: {
						resource: 'data.ministry',
						conditions: {
							where: 'deleted is null'
						}
					},
					required: true
				},
				hideExpression: '!(model.ownerVal === \'ministry\')'
			},
			{
				key: 'condition',
				type: 'stacked-input',
				templateOptions: {
					type: 'text',
					label: 'Condition',
					placeholder: 'Condition'
				},
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
				}
			},
			{
				key: 'description',
				type: 'stacked-input',
				templateOptions: {
					type: 'text',
					label: 'Description',
					placeholder: 'Description'
				},
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
				}
			}
		];
	};

	ItemFormsCtrl.prototype.getItemHeight = function(item, index) {
		return 75;
	};

	ItemFormsCtrl.prototype.handleOptionGetter = function(option) {
		var vm = this;
		return option.model + ' ' + (!vm.sortReversed ? 'asc' : 'desc');
	};

	ItemFormsCtrl.prototype.handleOnCancel = function() {
		var vm = this;
		vm.model = {};
		if (!!vm.$ionicHistory.backView()) {
			console.log('goBack');
			vm.$ionicHistory.goBack();
		} else {
			console.log('goState');
			vm.$state.go('tab.ministries');
		}
	};

	ItemFormsCtrl.prototype.handleOnSubmit = function() {
		var vm = this;
		console.log('handleOnSubmit:', vm.model);
	};
})(angular);
