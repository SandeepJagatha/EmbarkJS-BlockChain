var myApp = angular.module('myApp', ['ui.router', 'ngFileUpload', 'chart.js']);

myApp.config(function ($stateProvider, $urlRouterProvider) {
    console.log("app config");

    (function (ChartJsProvider) {
        ChartJsProvider.setOptions({
            colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
        });
    });

    $urlRouterProvider.when('/', ['$state', function ($state) {
        $state.go(users);
    }]);

    $urlRouterProvider.when('/jsonUpload', ['$state', function ($state) {
        $state.go(jsonUpload);
    }]);

    $urlRouterProvider.when('/users', ['$state', function ($state) {
        $state.go(users);
    }]);

    $urlRouterProvider.when('/dashboard', ['$state', function ($state) {
        $state.go(dashboard);
    }]);

    $urlRouterProvider.otherwise('/');

    var users = {
        name: 'users',
        url: '/users',
        templateUrl: 'tiaaApp/users/users.html',
        controller: 'UsersController'
    };

    var jsonUpload = {
        name: 'jsonUpload',
        url: '/jsonUpload',
        templateUrl: 'tiaaApp/jsonUpload/jsonUpload.html',
        controller: 'JsonUploadController'
    };

    var dashboard = {
        name: 'dashboard',
        url: '/dashboard',
        templateUrl: 'tiaaApp/dashboard/dashboard.html',
        controller: 'DashboardController'
    };

    var transfer = {
        name: 'transfer',
        url: '/transfer',
        templateUrl: 'tiaaApp/transfer/transfer.html',
        controller: 'TransferController'
    };

    $stateProvider.state(users);
    $stateProvider.state(jsonUpload);
    $stateProvider.state(dashboard);
    $stateProvider.state(transfer);
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