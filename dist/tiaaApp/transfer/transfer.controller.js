(function () {
    'use strict';

    angular.module('myApp').controller('TransferController', ['$scope', '$http', '$timeout', '$q', '$rootScope', function ($scope, $http, $timeout, $q, $rootScope) {

        $rootScope.title = "Transfer Funds";
        $scope.response = null;
        $scope.transferForm = {
            'recipient': '',
            'amount': ''
        };

        ////

        function _sendCoin(baseAddr, accountAddr, type) {
            var deferred = $q.defer();

            setTimeout(function () {
                MetaCoin.sendCoin2(Number(baseAddr), Number(accountAddr), type)
                    .then(function (response) {
                        deferred.resolve(response);
                    }).catch(function (e) {
                        console.log(e);
                        deferred.reject('Address ' + accountAddr + ' is not allowed.');
                    })

            }, 0);

            return deferred.promise;
        }


        /////////
        $scope.doTransferFormSubmit = function () {
            _sendCoin(Number($scope.coinbase.account), Number($scope.transferForm.recipient), $scope.transferForm.amount).then(function (response) {
                    console.log(response);
                    $scope.response = response;
                    $scope.transferForm = null;
                    return response;
                },
                function (reason) {
                    alert('Failed: ' + reason);
                },
                function (update) {
                    alert('Got notification: ' + update);
                });
        }

        $scope.amountChange = function (value) {
            if (value) {
                var subtractedValue = Number($rootScope.globals.curentUserObj.balance) - Number(value);
                $rootScope.globals.curentUserObj.balance = subtractedValue.toString();
            }
        }

    }]);
})();