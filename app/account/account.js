(function (angular) {
    "use strict";

    var app = angular.module('myApp.account', []);

    app.controller('LoginCtrl', ['$scope', '$state', 'accountService', function ($scope, $state, accountService) {
        console.log('login');
        $scope.creds = {};
        $scope.login = function () {
            accountService.login($scope.creds.username, $scope.creds.password)
                .then(function (_response) {
                    // transition to next state
                    $state.go('tab.dash');
                }, function (_error) {
                    alert("error logging in " + _error.message);
                })
        };
    }]);

    app.controller('SignupCtrl', ['$scope', 'accountService', function ($scope, accountService) {
        console.log('SignupCtrl');
        $scope.user = {};

        $scope.signup = function () {
            var userAdded = accountService.create();
            userAdded.username = $scope.user.username;
            userAdded.password = $scope.user.password;
            userAdded.email = $scope.user.email;

            accountService.save(userAdded).then(
                    function (result) {
                        // Handle success   
                    },
                    function (e) {
                        console.log(e);
                    }
                );
        };
    }]);

    app.factory('accountService', ['parseRepositories', function ($repos) {
        var User = $repos.CreateRepository('User', {
            'all': {
                'queries': ['query.ascending("name");', 'query.limit(1000);', 'query.include("flag");']
            }
        });

        $repos.GettersAndSetters(User, [
            { angular: 'username', parse: 'username' },
            { angular: 'password', parse: 'password' },
            { angular: 'email', parse: 'email' }
        ]);

        /**
        *
        * @param _parseInitUser
        * @returns {Promise}
        */
        User.currentUser = function (_parseInitUser) {

            // if there is no user passed in, see if there is already an
            // active user that can be utilized
            _parseInitUser = _parseInitUser ? _parseInitUser : Parse.User.current();

            console.log("_parseInitUser " + Parse.User.current());
            if (!_parseInitUser) {
                return $q.reject({ error: "noUser" });
            } else {
                return $q.when(_parseInitUser);
            }
        };

        /**
        *
        * @param _user
        * @param _password
        * @returns {Promise}
        */
        User.login = function (_user, _password) {
            return Parse.User.logIn(_user, _password);
        };

        /**
        *
        * @returns {Promise}
        */
        User.logout = function (_callback) {
            var user = Parse.User.current();
            if (null !== user) {
                console.log("logging out user " + user.get("username"));
                _callback(Parse.User.logOut());
            } else {
                _callback({});
            }
        }

        return User;
    }]);

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('accountlogin', {
                url: "/login",
                templateUrl: 'app/account/login.html',
                controller: 'LoginCtrl'
            })
            .state('accountsignup', {
                url: "/signup",
                templateUrl: 'app/account/signup.html',
                controller: 'SignupCtrl'
            });
    }]);
})(angular);