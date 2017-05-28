(function (ng) {
	'use strict';

	ng.module('controllers').controller('TabItemCtrl', TabItemCtrl);

	TabItemCtrl.$inject = [
		'$ionicPopup',
		'$rootScope',
		'$scope',
		'User',
		'Ministry'
	];
	function TabItemCtrl(
		$ionicPopup,
		$rootScope,
		$scope,
		User,
		Ministry
	) {
		var vm = this;
		vm.$ionicPopup = $ionicPopup;
		vm.$rootScope = $rootScope;
		vm.$scope = $scope;
		vm.User = User;
		vm.Ministry = Ministry;

		vm.currentUserRole = User.currentUserRole();
		vm.isAdmin = (vm.currentUserRole === 'admin' || vm.currentUserRole === 'head');
		vm.list = [];
		vm.loadMoreData = true;
		vm.sortReversed = false;
		vm.conditions = {
			pageSize: 0,
			offset: 0,
			where: 'deleted is null',
			sortBy: 'created desc'
		}
		vm.sortItems = [
			{title: 'Default', model: 'created'},
			{title: 'Name', model: 'name'},
			{title: 'Description', model: 'description'}
		];
	}

	TabItemCtrl.prototype.getItemHeight = function(item, index) {
		return 75;
	};

	TabItemCtrl.prototype.handleOnRefresh = function() {
		console.log('handleOnRefresh');
		var vm = this;
		vm.loadMoreData = true;
		vm.conditions.pageSize = 0;
		vm.conditions.offset = 0;
		vm.Ministry.all(vm.conditions).then((res) => {
			vm.conditions.pageSize = vm.conditions.pageSize + 10;
			vm.conditions.offset = 10;
			vm.list.splice(0, vm.list.length);
			ng.forEach(res.data, (val) => vm.list.push(val));
			if (res.totalObjects === vm.list.length) {
				vm.loadMoreData = false;
			}
		}).catch((err) => {
			vm.$rootScope.$broadcast('alert-error:show');
			vm.loadMoreData = false;
		}).finally(() => {
			vm.$scope.$broadcast('scroll.refreshComplete');
		});
	};

	TabItemCtrl.prototype.handleOnInfiniteScroll = function() {
		console.log('handleOnInfiniteScroll');
		var vm = this;
		vm.Ministry.all(vm.conditions).then((res) => {
			ng.forEach(res.data, (val) => vm.list.push(val));
			if (res.totalObjects !== vm.list.length) {
				vm.conditions.pageSize = vm.conditions.pageSize + 10;
				vm.conditions.offset = 10;
			} else {
				vm.loadMoreData = false;
			}
		}).catch((err) => {
			vm.$rootScope.$broadcast('alert-error:show');
			vm.loadMoreData = false;
		}).finally(() => {
			vm.$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	TabItemCtrl.prototype.handleOptionGetter = function(option) {
		var vm = this;
		return option.model + ' ' + (!vm.sortReversed ? 'asc' : 'desc');
	};

	TabItemCtrl.prototype.handleOnSort = function() {
		var vm = this;
		vm.sortReversed = !vm.sortReversed;
		vm.conditions.pageSize = 0;
		vm.conditions.offset = 0;
		vm.list.splice(0, vm.list.length);
		vm.loadMoreData = true;
	};
})(angular);
