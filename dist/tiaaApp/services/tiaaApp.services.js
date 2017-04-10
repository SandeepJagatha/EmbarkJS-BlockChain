(function () {
    'use strict';

    angular.module('myApp').factory('tiaaAppService', ['$http', '$timeout', '$q', function ($http, $timeout, $q) {

        var accountData = [];
        var expectMainAcc = [];

        var service = {
            promise: promise,
            promise2: promise2,
            getAccounts: getAccounts,
            getAccountBalance: _getAccountBalance,
            getExpectMainAcc: getExpectMainAcc
        };

        return service;

        /////////


        function getAccounts() {
            return accountData;
        }

        function getExpectMainAcc() {
            return expectMainAcc;
        }

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

            }, 1000);

            return deferred.promise;
        }

        function promise() {

            var deferred = $q.defer();

            $timeout(function () {
                var accountsAndBalances = [];
                web3.eth.getAccounts(function (err, accs) {
                    if (err != null) {
                        alert('There was an error fetching your accounts.')
                        console.error(err);
                        return;
                    }

                    if (accs.length === 0) {
                        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                        return;
                    }

                    console.log(":::::::::Accounts :::::::::::");
                    console.log(accs);


                    var accountsAndBalances = accs.map((account, index) => {
                        var accountName = "User" + index;
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

                    //
                    //                                        $q.all(accountsAndBalances).then((accountsAndBalances) => {
                    //                                            console.log("::::: accountsAndBalances ::::::");
                    //                                            console.log(accountsAndBalances);
                    //                                            accountsAndBalances[0].accountName = "TIAA Account";
                    //                                            accountsclone = accountsAndBalances.slice();
                    //                                            accountsclone.shift();
                    //                                            //
                    //                                            accountData = accountsAndBalances;
                    //                                            expectMainAcc = accountsclone;
                    //                                        });


                });



                deferred.resolve('Hello!');
            }, 1000);

            var accountsclone = [];

            return $q.all(accountsAndBalances).then((accountsAndBalances) => {
                console.log("::::: accountsAndBalances ::::::");
                console.log(accountsAndBalances);
                accountsAndBalances[0].accountName = "TIAA Account";
                accountsclone = accountsAndBalances.slice();
                accountsclone.shift();
                //
                accountData = accountsAndBalances;
                expectMainAcc = accountsclone;
                return accountsAndBalances;
            });
        }

        function promise2() {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve('Hello!');
            }, 1000);
            return deferred.promise;
        }


   }]);
})();