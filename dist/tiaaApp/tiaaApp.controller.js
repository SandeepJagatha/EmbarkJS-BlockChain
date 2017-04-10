(function () {
    'use strict';

    angular.module('myApp').controller('TIAAappController', ['$scope', '$state', '$rootScope', '$q', function ($scope, $state, $rootScope, $q) {
        $scope.$state = $state;
        $rootScope.title = "TIAA COIN Dashboard";
        $scope.tab = 1;

        $rootScope.accounts = [];
        $rootScope.coinbase = {};
        $rootScope.expectMainAcc = [];
        var userNames = ['Shizuko Olson', 'Marina Balser', 'Kenneth Ishmael', 'Kip Sum', 'Nadia Travis', 'Reatha Willimas', 'Gisele Peller', 'Rebeca Delreal', 'Mirella Denning', 'Rosita Abell'];

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


                var accountsAndBalances = accs.map((account, index) => {
                    var accountName = userNames[index];
                    var userId = "User" + index;
                    var pwd = "User" + index;
                    var adminFlag = false;
                    return _getAccountBalance(account).then(function (balance) {
                        return {
                            account, balance, accountName, userId, pwd, adminFlag
                        }
                    }, function (reason) {
                        alert('Failed: ' + reason);
                    }, function (update) {
                        alert('Got notification: ' + update);
                    });
                });

                var accountsclone = [];
                $q.all(accountsAndBalances).then((accountsAndBalances) => {
                    console.log("::::: accountsAndBalances ::::::");
                    console.log(accountsAndBalances);
                    accountsAndBalances[0].accountName = "TIAA Account";
                    accountsAndBalances[0].userId = "admin";
                    accountsAndBalances[0].pwd = "admin";
                    accountsAndBalances[0].adminFlag = true;
                    accountsclone = accountsAndBalances.slice();
                    accountsclone.shift();
                    //
                    $rootScope.accounts = accountsAndBalances;
                    $rootScope.coinbase = accountsAndBalances[0];
                    $rootScope.expectMainAcc = accountsclone;
                });
            });
        }

        const refreshBalances = () => {
            _getAccountBalances();
        };

        refreshBalances();

        setInterval(() => {
            refreshBalances();
            return refreshBalances
        }, 10000);
    }]);
})();