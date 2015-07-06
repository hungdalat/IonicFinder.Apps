// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'parse',
    'app.service',
    'app.jobs',
    'starter.controllers',
    'starter.services',
    'myApp.account'
])

.run(function ($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

        // this code handles any error when trying to change state.
        $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                console.log('$stateChangeError ' + error && error.debug);

                // if the error is "noUser" the go to login state
                if (error && error.error === "noUser") {
                    //$state.go('login', {});
                }
            });
    });
})

.config(function ($stateProvider, $urlRouterProvider, parseRepositoriesProvider) {

    parseRepositoriesProvider.init(Parse, 'KNAmiTU4CXfm2olVtAusvCxTziRmuazrXs87ZDu1', '7aA3au1qm6zFZ9lYtKC5qjhKI0BAaxpV8Rxf5PRZ');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
          url: "/tab",
          abstract: true,
          templateUrl: "templates/tabs.html"
      })

    // Each tab has its own nav history stack:

    .state('tab.job', {
        url: '/job',
        views: {
            'tab-job': {
                templateUrl: 'templates/tab-job.html',
                controller: 'JobListCtrl'
            }
        }
    })
    .state('tab.job-detail', {
        url: '/job/:id',
        views: {
            'tab-job': {
                templateUrl: 'templates/jobdetail.html',
                controller: 'JobDetailCtrl'
            }
        }
    })
    .state('tab.chats', {
        url: '/chats',
        views: {
            'tab-chats': {
                templateUrl: 'templates/tab-chats.html',
                controller: 'ChatsCtrl'
            }
        }
    })
      .state('tab.chat-detail', {
          url: '/chats/:chatId',
          views: {
              'tab-chats': {
                  templateUrl: 'templates/chat-detail.html',
                  controller: 'ChatDetailCtrl'
              }
          }
      })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/job');

})
.value('AppConstant', {
    JobTypes: [
        { code: 'freelancer', name: 'Freelancer' },
        { code: 'fulltime', name: 'Full time' },
        { code: 'parttime', name: 'Part time' }
    ]
});
