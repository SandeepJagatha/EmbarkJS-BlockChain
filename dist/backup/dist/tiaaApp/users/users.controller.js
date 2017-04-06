(function () {
    'use strict';

    angular.module('myApp').controller('UsersController', ['$scope', '$http', '$timeout', '$q', '$rootScope', function ($scope, $http, $timeout, $q, $rootScope) {

        $scope.accounts = [];
        $scope.coinbase = {};
        $scope.expectMainAcc = [];

        $rootScope.title = "Users";

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

        const refreshBalances = () => {
            _getAccountBalances()
        }

        refreshBalances()

        setInterval(() => {
            refreshBalances();
            return refreshBalances
        }, 10000);

    }]);
})();