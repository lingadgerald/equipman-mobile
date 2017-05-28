(function (ng) {
	'use strict';

	ng.module('controllers').controller('EventMinistriesCtrl', EventMinistriesCtrl);

	EventMinistriesCtrl.$inject = [
		'$ionicPopup',
		'$rootScope',
		'$stateParams',
		'$scope',
		'Event',
		'Ministry'
	];
	function EventMinistriesCtrl(
		$ionicPopup,
		$rootScope,
		$stateParams,
		$scope,
		Event,
		Ministry
	) {
		var vm = this;
		vm.$ionicPopup = $ionicPopup;
		vm.$rootScope = $rootScope;
		vm.$stateParams = $stateParams;
		vm.$scope = $scope;
		vm.Event = Event;
		vm.Ministry = Ministry;

		vm.event = {};
		vm.list = [];
		vm.loadMoreData = false;
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
			{title: 'Description', model: 'description'}
		];

		vm.init(vm);
	}

	EventMinistriesCtrl.prototype.init = function(vm) {
		vm.$rootScope.$broadcast('loading:show');
		vm.Event.get(vm.$stateParams.eventId).then((res) => {
			vm.event = res;
			vm.loadMoreData = true;
		}).catch((err) => {
			vm.$rootScope.$broadcast('alert-error:show');
		}).finally(() => {
			vm.$rootScope.$broadcast('loading:hide');
		});
	};

	EventMinistriesCtrl.prototype.getItemHeight = function(item, index) {
		return 75;
	};

	EventMinistriesCtrl.prototype.handleOnRefresh = function() {
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

	EventMinistriesCtrl.prototype.handleOnInfiniteScroll = function() {
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

	EventMinistriesCtrl.prototype.handleOptionGetter = function(option) {
		var vm = this;
		return option.model + ' ' + (!vm.sortReversed ? 'asc' : 'desc');
	};

	EventMinistriesCtrl.prototype.handleOnSort = function() {
		var vm = this;
		vm.sortReversed = !vm.sortReversed;
		vm.conditions.pageSize = 0;
		vm.conditions.offset = 0;
		vm.list.splice(0, vm.list.length);
		vm.loadMoreData = true;
	};
})(angular);
