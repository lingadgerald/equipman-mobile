(function (ng) {
	'use strict';

	ng.module('directives').run(runBlock).config(configBlock);

	runBlock.$inject = [];
	function runBlock() {
		
	}

	configBlock.$inject = ['formlyConfigProvider'];
	function configBlock(formlyConfigProvider) {
		formlyConfigProvider.setWrapper({
			name: 'list-item',
			template: [
				'<div class="item"><formly-transclude></formly-transclude></div>'
			].join(' ')
		});

		formlyConfigProvider.setType({
			name: 'image-input',
			template: [
				'<div class="item" ng-if="formState.action !== \'add\'">',
					'<div class="text-center">',
						'<img ng-src="{{model[options.key] || \'img/no_image.png\'}}" width="50%" height="50%">',
					'</div>',
				'</div>',
				'<label class="item item-input" ng-if="formState.action === \'add\'">',
					'<span class="input-label">{{to.label}}</span>',
					'<input type="file" ng-model="model[options.key]" placeholder="{{to.placeholder}}" accept="image/*" base-sixty-four-input="base-sixty-four-input">',
				'</label>'
			].join(' '),
			wrapper: []
		});

		formlyConfigProvider.setType({
			name: 'select-popup',
			template: [
				'<div class="item item-input item-button-right" ng-if="formState.action === \'add\' && (formState.role === \'admin\' || formState.role === \'head\')">',
					'<span class="input-label">{{to.label}}</span>',
					'<button class="button button-light" ng-click="fn.openPopup()" ng-disabled="(formState.readOnly || to.disabled)">',
						'<span style="margin-right: 10px;">',
							'<span ng-if="!!model[options.key]">{{fn.getLabel()}}</span>',
						'</span>',
						// '<span style="margin-right: 16px;">{{model[options.key]}}</span>',
						'<i class="icon icon-sm ion-android-arrow-dropdown"></i>',
					'</button>',
				'</div>',
				'<label class="item item-input item-stacked-label" ng-if="formState.action === \'add\' && !(formState.role === \'admin\' || formState.role === \'head\')">',
					'<span class="input-label">{{to.label}}</span>',
					'<input type="text" ng-model="model[options.key].name" placeholder="{{to.placeholder}}" ng-disabled="true">',
				'</label>',
				'<label class="item item-input item-stacked-label" ng-if="formState.action !== \'add\'">',
					'<span class="input-label">{{to.label}}</span>',
					'<input type="text" ng-model="model[options.key].name" placeholder="{{to.placeholder}}" ng-disabled="(formState.readOnly || to.disabled)">',
				'</label>'
			].join(' '),
      controller: 'FormlySelectCtrl as fn'
		});

		formlyConfigProvider.setType({
			name: 'select-modal',
			templateUrl: 'templates/others/modal-select.html',
			controller: 'ModalSelectCtrl as vm'
		});
	}
})(angular);