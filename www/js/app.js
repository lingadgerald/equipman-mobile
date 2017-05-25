(function (ng) {
  'use strict';

  ng.module('equipman', [
    'ionic',
    'ionic-toast',
    'ionic-modal-select',
    'ngCordova',
    'ngCookies',
    'ngStorage',
    'camelCaseToHuman',

    'backendless',
    'backendless.config',
    'routes',
    'services',
    'directives',
    'controllers'
  ]).run(runBlock).config(configBlock);

  // Run Block
  runBlock.$inject = [
    '$ionicPlatform',
    '$ionicHistory',
    '$ionicPopup',
    '$ionicLoading',
    '$rootScope'
  ];
  function runBlock(
    $ionicPlatform,
    $ionicHistory,
    $ionicPopup,
    $ionicLoading,
    $rootScope
  ) {
    $ionicPlatform.ready(() => {
      // Hide the accessory bar by default (remove this to show
      // for the accessory bar above the keyboard form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
        if (StatusBar.isVisible) { StatusBar.hide(); }
      }
    });

    $ionicPlatform.registerBackButtonAction((ev) => {
      if (false) {
        $ionicPopup.confirm({
          title     : 'Confirm Exit',
          template  : 'Are you sure you want to exit the application?',
          okText    : 'Yes',
          cancelText: 'No',
          cancelType: 'button-light'
        }).then((res) => {
          if (res) { ionic.Platform.exitApp(); }
        });
      } else {
        $ionicHistory.goBack();
      }
      ev.preventDefault();
      return false;
    }, 101);

    console.log('Current Platform:', ionic.Platform.platform());
    console.log('Current Platform Version:', ionic.Platform.version());

    var loadingShowEvent = $rootScope.$on('loading:show', (ev) => {
      ev.preventDefault();
      $ionicLoading.show();
    });

    var loadingHideEvent = $rootScope.$on('loading:hide', (ev) => {
      ev.preventDefault();
      $ionicLoading.hide();
    });

    $rootScope.$on('destroy', () => {
      loadingShowEvent();
      loadingHideEvent();
    });
  }

  // Config Block
  configBlock.$inject = [
    '$ionicConfigProvider',
    '$urlRouterProvider',
    '$httpProvider',
    'BackendlessProvider'
  ];
  function configBlock(
    $ionicConfigProvider,
    $urlRouterProvider,
    $httpProvider,
    BackendlessProvider
  ) {
    var platform = ionic.Platform.platform();
    var httpDefaultHeaders = $httpProvider.defaults.headers;

    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.backButton.previousTitleText(false);
    // $ionicConfigProvider.backButton.text('');

    if (platform !== 'android' && platform !== 'ios') {
      $ionicConfigProvider.views.transition('android');
      $ionicConfigProvider.navBar.alignTitle('left');
      $ionicConfigProvider.spinner.icon('circles');
    }

    BackendlessProvider.applicationIdConfig('CBAFBAC3-F0FF-D1CE-FF3B-7F60818CC000');
    BackendlessProvider.secretKeyConfig('CE197249-ADE5-0C91-FF00-C8D8BA817800');
    
    httpDefaultHeaders.common['application-id'] = BackendlessProvider.applicationIdConfig();
    httpDefaultHeaders.common['secret-key'] = BackendlessProvider.secretKeyConfig();
    httpDefaultHeaders.common['application-type'] = BackendlessProvider.applicationTypeConfig();
    httpDefaultHeaders.common['Content-Type'] = 'application/json';

    // if none of the states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  }
})(angular);
