(function (ng) {
	'use strict';

  String.prototype.capitalize = function (lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
  };
  String.prototype.underscoreless = function () {
    return this.replace(/_/g, ' ');
  };
  String.prototype.underscore = function () {
    return this.replace(/ /g, '_');
  };
  String.prototype.pluralize = function (count, plural) {
    if (!plural) {plural = this + 's';}
    return (count === 1) ? this : plural;
  };
  String.prototype.format = function () {
    var str = this.toString();
    if (!arguments.length) {return str;}
    var args = typeof arguments[0];
    args = (('string' === args || 'number' === args) ? arguments : arguments[0]);
    for (var arg in args) {
      str = str.replace(new RegExp('\\{' + arg + '\\}', 'gi'), args[arg]);
    }
    return str;
  };
  String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
  };
  String.prototype.camelize = function() {
    var self = this;
    self = self.replace(/[\-_\s]+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
    // Ensure 1st char is always lowercase
    return self.replace(/^([A-Z])/, function(match, chr) {
      return chr ? chr.toLowerCase() : '';
    });
  };

	ng.module('equipmanMobile')
		.run(RunBlock)
		.config(Config)
	;

	RunBlock.$inject = ['$ionicPlatform', '$ionicHistory', '$rootScope', '$timeout', '$state', '$cookies', '$localStorage', '$ionicPopup', 'ionicToast'];
	function RunBlock($ionicPlatform, $ionicHistory, $rootScope, $timeout, $state, $cookies, $localStorage, $ionicPopup, ionicToast) {
    var currentPlatform = ionic.Platform.platform();
	  var currentPlatformVersion = ionic.Platform.version();
	  console.log('Current Platform:', currentPlatform);
	  console.log('Current Platform Version:', currentPlatformVersion);
		console.log('Local Storage:', $localStorage);
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
        StatusBar.styleDefault();
        if (StatusBar.isVisibile) {
          StatusBar.hide();
        }
			}
		});

    $ionicPlatform.registerBackButtonAction(function (event) {
      if($state.current.name === 'auth.login' || $state.current.name === 'app.tabs.events' || $state.current.name === 'app.tabs.ministries') {
        // navigator.app.exitApp();
        $ionicPopup.confirm({
          title   : 'Confirm Exit',
          template: 'Are you sure you want to exit the application?',
          cancelText: 'No',
          cancelType: 'button-light',
          okText: 'Yes'
        }).then(function (res) {
          if (res) { ionic.Platform.exitApp(); }
        });
      } else {
        $ionicHistory.goBack();
      }

      // if ($rootScope.backButtonPressedOnceToExit) {
      //   ionic.Platform.exitApp();
      // } else if ($ionicHistory.backView()) {
      //   $ionicHistory.goBack();
      // } else {
      //   $rootScope.backButtonPressedOnceToExit = true;
      //   ionicToast.show('Press back button again to exit', 'bottom', false, 2300);
      //   // window.plugins.toast.showShortCenter("Press back button again to exit", function (a) {}, function (b) {});
      //   setTimeout(function(){
      //     $rootScope.backButtonPressedOnceToExit = false;
      //   }, 2000);
      // }
      event.preventDefault();
      return false;
    }, 101);

		var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState) {
      var userToken = $localStorage['user-token'];
      // $ionicPopup.alert({
      //   title   : 'User Token!',
      //   template: 'c: ' + $cookies.get('user-token') + ' | l: ' + $localStorage['user-token']
      // })
      var code = null;
      if (!!toState) {code = toState.name.split('.')[0];}
      if (code === 'auth' && !!userToken) {
        event.preventDefault();
        $state.go('app.tabs.events');
      }
      if (code === 'app' && !userToken) {
        event.preventDefault();
        $state.go('auth.login');
      }
      $rootScope.loadingProgress = true;
    });

    var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {
      $timeout(function () {
        $rootScope.loadingProgress = false;
      });
    });

    $rootScope.state = $state;
    $rootScope.$on('destroy', function () {
      stateChangeStartEvent();
      stateChangeSuccessEvent();
    });
	}

	Config.$inject = ['BackendlessProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', '$ionicConfigProvider'];
	function Config(BackendlessProvider, $locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
		var platform = ionic.Platform.platform();

		// $ionicConfigProvider.scrolling.jsScrolling(true); //false
		$ionicConfigProvider.views.forwardCache(true);
		$ionicConfigProvider.tabs.style('standard');
		$ionicConfigProvider.tabs.position('bottom');
		$ionicConfigProvider.backButton.text('');
		$ionicConfigProvider.backButton.previousTitleText(false);

		if (platform !== 'android' && platform !== 'ios') {
			$ionicConfigProvider.views.transition('android');
			$ionicConfigProvider.navBar.alignTitle('left');
			$ionicConfigProvider.spinner.icon('circles');
		}

    // Dev
    // BackendlessProvider.applicationIdConfig('F9558935-8FED-0193-FF78-3EA9AA72CC00');
    // BackendlessProvider.secretKeyConfig('2141DDC5-DCE6-4947-FFE8-54681FCF9600');
    // Prod
    BackendlessProvider.applicationIdConfig('CBAFBAC3-F0FF-D1CE-FF3B-7F60818CC000');
    BackendlessProvider.secretKeyConfig('CE197249-ADE5-0C91-FF00-C8D8BA817800');

    // $httpProvider.interceptors.push('HttpInterceptor');
    $httpProvider.defaults.headers.common['application-id'] = BackendlessProvider.keys.applicationId;
    $httpProvider.defaults.headers.common['secret-key'] = BackendlessProvider.keys.secretKey;
    $httpProvider.defaults.headers.common['application-type'] = BackendlessProvider.keys.applicationType;
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';

		$urlRouterProvider.otherwise('login');
		$urlRouterProvider.when('/', ['$state', function ($state) { $state.go('auth.login', {}); }]);
		$stateProvider
			.state('auth', {
				abstract: true,
				views		: {
					'main@': {
						templateUrl: 'templates/core/content-only.html'
					}
				}
			})
			.state('app', {
				abstract: true,
				views		: {
					'main@': {
						templateUrl: 'templates/core/content-only.html'
					}
				}
			})
			.state('app.tabs', {
				abstract: true,
				views		: {
					'content@app': {
						templateUrl: 'templates/core/content-tabs.html',
						controller : 'TabCtrl as ctrl'
					}
				},
				resolve	: {
					TabData: function (MainService) {
						return MainService.getData({name: 'default', group: 'tabs'});
					}
				}
			})

			// // Default ionic
			// .state('tab', {
		 //    url: '/tab',
		 //    abstract: true,
		 //    templateUrl: 'templates/tabs.html'
		 //  })

		 //  // Each tab has its own nav history stack:

		 //  .state('tab.dash', {
		 //    url: '/dash',
		 //    views: {
		 //      'tab-dash': {
		 //        templateUrl: 'templates/tab-dash.html',
		 //        controller: 'DashCtrl'
		 //      }
		 //    }
		 //  })

		 //  .state('tab.chats', {
		 //      url: '/chats',
		 //      views: {
		 //        'tab-chats': {
		 //          templateUrl: 'templates/tab-chats.html',
		 //          controller: 'ChatsCtrl'
		 //        }
		 //      }
		 //    })
		 //    .state('tab.chat-detail', {
		 //      url: '/chats/:chatId',
		 //      views: {
		 //        'tab-chats': {
		 //          templateUrl: 'templates/chat-detail.html',
		 //          controller: 'ChatDetailCtrl'
		 //        }
		 //      }
		 //    })

		 //  .state('tab.account', {
		 //    url: '/account',
		 //    views: {
		 //      'tab-account': {
		 //        templateUrl: 'templates/tab-account.html',
		 //        controller: 'AccountCtrl'
		 //      }
		 //    }
		 //  })
		;
	}
})(angular);