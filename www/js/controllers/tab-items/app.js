(function (ng) {
	'use strict';

	ng.module('controllers').controller('TabItemCtrl', TabItemCtrl);

	TabItemCtrl.$inject = [
		'Ministry',
		'$scope',
		'$ionicPopup',
		'$ionicModal'
	];
	function TabItemCtrl(
		Ministry,
		$scope,
		$ionicPopup,
		$ionicModal
	) {
		var vm = this;
		vm.Ministry = Ministry;
		vm.$scope = $scope;
		vm.$ionicPopup = $ionicPopup;
		vm.$ionicModal = $ionicModal;
		vm.list = [];
		vm.data = {};
		vm.sortBy = 'created';
		vm.owners = [
			{title: 'Member', model: 'member'},
			{title: 'Ministry', model: 'ministry'}
		];

		$ionicModal.fromTemplateUrl(
			'templates/others/modal-items.html',
			{ scope: $scope }
		).then(function (modal) { $scope.modal = modal; });

		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
		$scope.$on('modal.hidden', function() {
			// Execute action on hide modal
			vm.data = {};
		});
		$scope.$on('modal.removed', function() {
			// Execute action on remove modal
		});
	}

	TabItemCtrl.prototype.getItemHeight = function(item, index) {
		return 75;
	};

	TabItemCtrl.prototype.handleOnRefresh = function() {
		var vm = this, id = Math.floor((Math.random()*100));
		setTimeout(function() {
			vm.list.unshift({
				id: id, title: 'Sample ' + id,
				description: 'Sample description ' + id
			});
			vm.$scope.$broadcast('scroll.refreshComplete');
		}, 1000);
	};

	TabItemCtrl.prototype.handleOnInfiniteScroll = function() {
		var vm = this;
		setTimeout(function() {
			if (ng.equals([], vm.list)) {
				Array.prototype.push.apply(vm.list, vm.Ministry.all());
			} else if (vm.list.length <= 20) {
				for (var i = 0; i < 10; i++) {
					var id = Math.floor((Math.random()*100));
					vm.list.push({
						id: id, title: 'Sample ' + id,
						description: 'Sample description ' + id
					});
				}
			}
		}, 1000);
		vm.$scope.$broadcast('scroll.infiniteScrollComplete');
	};

	TabItemCtrl.prototype.handleOnFilter = function() {
		var vm = this;
		vm.$scope.data = {};
		vm.$scope.data.sortBy = vm.sortBy;
		vm.$scope.sortItems = [
			{title: 'Default', model: 'created'},
			{title: 'Name', model: 'name'},
			{title: 'Description', model: 'description'}
		];
		var popup = {
			title: 'Sort ministries by',
			cssClass: 'sort-popup',
			scope: vm.$scope,
			templateUrl: 'templates/others/popup-sort.html'
		}
		vm.$ionicPopup.confirm(popup).then(function (res) {
			if (res) {
				vm.sortBy = vm.$scope.data.sortBy;
			}
		});
	};

	TabItemCtrl.prototype.handleOpenModal = function() {
		var vm = this;
		vm.$scope.modal.show();
	};

	TabItemCtrl.prototype.handleCloseModal = function() {
		var vm = this;
		vm.$scope.modal.hide();
	};

	TabItemCtrl.prototype.handleOnModalAdd = function() {
		var vm = this;
		console.log(vm.data);
	};
})(angular);
