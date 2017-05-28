(function (ng) {
	'use strict';

	ng.module('controllers').controller('TabEventCtrl', TabEventCtrl);

	TabEventCtrl.$inject = [
		'$ionicPopup',
		'$rootScope',
		'$scope',
		'Event'
	];
	function TabEventCtrl(
		$ionicPopup,
		$rootScope,
		$scope,
		Event
	) {
		var vm = this;
		vm.$ionicPopup = $ionicPopup;
		vm.$rootScope = $rootScope;
		vm.$scope = $scope;
		vm.Event = Event;

		vm.list = [];
		vm.loadMoreData = true;
		vm.sortReversed = false;
		vm.conditions = {
			pageSize: 0,
			offset: 0,
			where: 'deleted is null',
			sortBy: 'created desc'
		};
		vm.sortItems = [
			{title: 'Default', model: 'created'},
			{title: 'Name', model: 'name'},
			{title: 'Location', model: 'location'},
			{title: 'Date', model: 'eventDate'},
			{title: 'Description', model: 'description'}
		];
	}

	TabEventCtrl.prototype.getItemHeight = function(item, index) {
		return 75;
	};

	TabEventCtrl.prototype.handleOnRefresh = function() {
		console.log('handleOnRefresh');
		var vm = this;
		vm.loadMoreData = true;
		vm.conditions.pageSize = 0;
		vm.conditions.offset = 0;
		vm.Event.all(vm.conditions).then((res) => {
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

	TabEventCtrl.prototype.handleOnInfiniteScroll = function() {
		console.log('handleOnInfiniteScroll');
		var vm = this;
		vm.Event.all(vm.conditions).then((res) => {
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

	TabEventCtrl.prototype.handleOptionGetter = function(option) {
		var vm = this;
		return option.model + ' ' + (!vm.sortReversed ? 'asc' : 'desc');
	};

	TabEventCtrl.prototype.handleOnSort = function() {
		var vm = this;
		vm.sortReversed = !vm.sortReversed;
		vm.conditions.pageSize = 0;
		vm.conditions.offset = 0;
		vm.list.splice(0, vm.list.length);
		vm.loadMoreData = true;
	};
})(angular);
