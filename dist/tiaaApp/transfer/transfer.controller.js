(function () {
    'use strict';

    angular.module('myApp').controller('TransferController', ['$scope', '$http', '$timeout', '$q', '$rootScope', function ($scope, $http, $timeout, $q, $rootScope) {

        $scope.accounts = [];
        $scope.coinbase = {};
        $scope.expectMainAcc = [];
        $rootScope.title = "Transfer Funds";
        $scope.response = null;
        $scope.transferForm = {
            'recipient': '',
            'amount': ''
        };

        function _getAccountBalance(accountAddr) {
            var deferred = $q.defer();

            setTimeout(function () {
                MetaCoin.getBalance(Number(accountAddr))
                    .then(function (value) {
                        deferred.resolve(value.valueOf());
                    }).catch(function (e) {
                        console.log(e);
                        deferred.reject('Address ' + accountAddr + ' is not allowed.');
                    })

            }, 0);

            return deferred.promise;
        }

        function _getAccountBalances() {
            web3.eth.getAccounts(function (err, accs) {
                if (err != null) {
                    alert('There was an error fetching your accounts.')
                    console.error(err);
                    return
                }

                if (accs.length === 0) {
                    alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                    return;
                }

                console.log(":::::::::Accounts :::::::::::");
                console.log(accs);

                for (var i = 0; i < accs.length; i++) {
                    var accountsAndBalances = accs.map((account) => {
                        var accountName = "User" + i++;
                        return _getAccountBalance(account).then(function (balance) {
                            return {
                                account, balance, accountName
                            }
                        }, function (reason) {
                            alert('Failed: ' + reason);
                        }, function (update) {
                            alert('Got notification: ' + update);
                        });
                    });
                }

                var accountsclone = [];
                $q.all(accountsAndBalances).then((accountsAndBalances) => {
                    console.log("::::: accountsAndBalances ::::::");
                    console.log(accountsAndBalances);
                    accountsAndBalances[0].accountName = "TIAA Account";
                    accountsclone = accountsAndBalances.slice();
                    accountsclone.shift();
                    //
                    $scope.accounts = accountsAndBalances;
                    $scope.coinbase = accountsAndBalances[0];
                    $scope.expectMainAcc = accountsclone;
                });
            });
        }

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

        const refreshBalances = () => {
            _getAccountBalances()
        }

        refreshBalances()

        setInterval(() => {
            refreshBalances();
            return refreshBalances
        }, 10000);

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

    }]);
})();