var myApp = angular.module('myApp', ['ui.router', 'ngFileUpload']);

myApp.config(function ($stateProvider, $urlRouterProvider) {
    console.log("app config");

    $urlRouterProvider.when('/', ['$state', function ($state) {
        $state.go(users);
    }]);

    $urlRouterProvider.when('/jsonUpload', ['$state', function ($state) {
        $state.go(jsonUpload);
    }]);

    $urlRouterProvider.when('/users', ['$state', function ($state) {
        $state.go(users);
    }]);

    $urlRouterProvider.otherwise('/');

    var users = {
        name: 'users',
        url: '/users',
        templateUrl: 'tiaaApp/users/users.html',
        controller: 'UsersController'
    }

    var jsonUpload = {
        name: 'jsonUpload',
        url: '/jsonUpload',
        templateUrl: 'tiaaApp/jsonUpload/jsonUpload.html',
        controller: 'JsonUploadController'
    }

    $stateProvider.state(users);
    $stateProvider.state(jsonUpload);
});



myApp.factory('aProvider', function () {
    console.log("factory");
});

myApp.directive("testdirective", function () {
    console.log("directive setup");
    return {
        compile: function () {
            console.log("testdirective compile");
        }
    }
});

myApp.directive("testdirective2", function () {
    return {
        link: function () {
            console.log("testdirective2 link");
        }
    }
});

myApp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files;
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}]);

myApp.run(['$q', function ($q) {
    console.log("app run");

    function _setMainAccount(accountAddr, amount) {
        var deferred = $q.defer();

        setTimeout(function () {
            MetaCoin.setMainAccount(Number(accountAddr), amount)
                .then(function (response) {
                    deferred.resolve(response);
                }).catch(function (e) {
                    console.log(e);
                    deferred.reject('Address ' + accountAddr + ' is not allowed.');
                })

        }, 0);

        return deferred.promise;
    }

    web3.eth.getAccounts(function (err, accs) {
        _setMainAccount(accs[0], 1000).then(function (response) {
            console.log(response);
            return response;
        }, function (reason) {
            alert('Failed: ' + reason);
        }, function (update) {
            alert('Got notification: ' + update);
        });
    });
}]);

myApp.controller('myCtrl', function ($scope) {
    console.log("app controller");
});