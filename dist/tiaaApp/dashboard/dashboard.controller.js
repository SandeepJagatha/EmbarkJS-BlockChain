(function () {
    'use strict';

    angular.module('myApp').controller('DashboardController', ['$scope', '$http', '$timeout', '$q', '$rootScope', function ($scope, $http, $timeout, $q, $rootScope) {


        var titles = [];
        var balances = [];

        $scope.$watch(function () {
            return $rootScope.accounts;
        }, function () {
            loadChartData();
        }, true);

        //////

        function loadChartData() {
            titles = [];
            balances = [];
            $rootScope.accounts.forEach(function (arrayItem) {
                titles.push(arrayItem.accountName);
                balances.push(arrayItem.balance);
            });


            $rootScope.labels = titles;
            $rootScope.data = [balances, [-220, -100, -40, -19, -86, -27, -90, -9, -23, -77]];
        }

        $rootScope.title = "TIAA BlockChain";
        $rootScope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
        $rootScope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        $rootScope.data = [
          [65, -59, 80, 81, -56, 55, -40],
          [28, 48, -40, 19, 86, 27, 90]
        ];
        $rootScope.datasetOverride = [
            {
                label: "Balance",
                borderWidth: 1,
                type: 'bar'
            },
            {
                label: "Deduction",
                borderWidth: 1,
                type: 'bar'
            }
        ];

        loadChartData();

        //            MetaCoin.Transfer({
        //                fromBlock: "latest"
        //            }).watch(function (error, result) {
        //                // This will catch all Transfer events, regardless of how they originated.
        //                console.log(result);
        //                if (error == null) {
        //                    console.log(result.args);
        //                }
        //            });

        console.log(MetaCoin.Transfer({
            fromBlock: "latest"
        }));


    }]);
})();