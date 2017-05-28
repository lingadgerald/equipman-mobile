(function (ng) {
	'use strict';

	ng.module('controllers').controller('ItemFormsCtrl', ItemFormsCtrl);

	ItemFormsCtrl.$inject = [
		'$ionicHistory',
		'$rootScope',
		'$stateParams',
		'$scope',
		'$state',
		'Ministry',
		'Item'
	];
	function ItemFormsCtrl(
		$ionicHistory,
		$rootScope,
		$stateParams,
		$scope,
		$state,
		Ministry,
		Item
	) {
		var vm = this;
		vm.$ionicHistory = $ionicHistory;
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
				vm.$rootScope.$broadcast('alert-error:show');
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
				},
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
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
				},
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
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
				},
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
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
				hideExpression: '!(model.ownerVal === \'member\')',
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
				}
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
				hideExpression: '!(model.ownerVal === \'ministry\')',
				expressionProperties: {
					'templateOptions.disabled': 'formState.readOnly'
				}
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
		var model = ng.copy(vm.model);
		var resource = 'data.item@post';
		vm.options.formState.readOnly = true;
		vm.$rootScope.$broadcast('loading:show');

		ng.forEach(model, (val, key) => {
			if (key === 'image') {
				model.image = new Date().getTime() + (('_' + val.filename) || '.jpg');
				model.base64Image = val.base64;
			}
		});

		model.code = model.name.trim().underscore();
		if (model.ownerVal === 'member' && model.ownerMinistry != null) {
			model.ownerMinistry = null;
		} else if (model.ownerVal === 'ministry' && model.ownerMember != null) {
			model.ownerMember = null;
		}
		
		if (model.image != null) {
			var resourceImg = 'file.image@put@{image}'.format(model);
			var headers = { 'Content-Type': 'text/plain' };
			vm.Item.save(resourceImg, model.base64Image, headers).then((res) => {
				console.log('image saved:', res);
				model.image = res;
				delete model.base64Image;
				return vm.Item.save(resource, model);
			}).then((res) => {
				console.log('item saved:', res);
				vm.handleOnCancel();
			}).catch((err) => {
				vm.$rootScope.$broadcast('alert-error:show');
			}).finally(() => {
				vm.options.formState.readOnly = false;
				vm.$rootScope.$broadcast('loading:hide');
			});
		} else {
			vm.Item.save(resource, model).then((res) => {
				console.log('item saved:', res);
				vm.handleOnCancel();
			}).catch((err) => {
				vm.$rootScope.$broadcast('alert-error:show');
			}).finally(() => {
				vm.options.formState.readOnly = false;
				vm.$rootScope.$broadcast('loading:hide');
			});
		}

		console.log('handleOnSubmit:', model);
	};
})(angular);
