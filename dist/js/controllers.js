var artistControllers = angular.module('artistControllers', ['ngAnimate']);


artistControllers.controller('HeaderController', ['$scope', '$http', '$timeout', '$q', '$location', function ($scope, $http, $timeout, $q, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}]);

artistControllers.controller('ListController', ['$scope', '$http', '$timeout', '$q', '$location', function ($scope, $http, $timeout, $q, $location) {
    $scope.accounts = [];
    $scope.coinbase = {};
    $scope.expectMainAcc = [];

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
                console.log('There was an error fetching your accounts.')
                console.error(err);
                return
            }

            if (accs.length === 0) {
                console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
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
                        console.log('Failed: ' + reason);
                    }, function (update) {
                        console.log('Got notification: ' + update);
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


    $http.get('js/data.json').success(function (data) {
        $scope.artists = data;
        $scope.artistOrder = 'name';
    });
}]);



artistControllers.controller('DetailsController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $http.get('js/data.json').success(function (data) {
        $scope.artists = data;
        $scope.whichItem = $routeParams.itemId;


        if ($routeParams.itemId > 0) {
            $scope.prevItem = Number($routeParams.itemId) - 1;
        } else {
            $scope.prevItem = $scope.artists.length - 1;
        }

        if ($routeParams.itemId < $scope.artists.length - 1) {
            $scope.nextItem = Number($routeParams.itemId) + 1;
        } else {
            $scope.nextItem = 0;
        }
    });
}]);

artistControllers.controller('UsersController', ['$scope', 'Upload', '$http', '$timeout', '$q', function ($scope, Upload, $http, $timeout, $q) {
    EmbarkJS.Storage.setProvider('ipfs', {
        server: 'localhost',
        port: '5001'
    });
    $scope.jsonData = "";
    $scope.prettyjsonData = "";
    $scope.baseAcc = "";
    $scope.fileLink = "";
    $scope.fileHash = "";


    function _sendCoins(baseAddr, accountAddr, type) {
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


    web3.eth.getAccounts(function (err, accs) {
        $scope.baseAcc = accs[0];
    });

    $scope.uploadFile = function () {
        var arr = [{
            files: $scope.uploadme
        }];

        EmbarkJS.Storage.uploadFile(arr).then(function (hash) {
            console.log(hash);
            EmbarkJS.Storage.get(hash).then(function (content) {
                $scope.fileHash = hash;
                $http.get(EmbarkJS.Storage.getUrl(hash)).success(function (data) {
                    $scope.jsonData = data;
                    var prettyjsonobj = JSON.stringify(data, undefined, 4);
                    console.log(prettyjsonobj);
                    $scope.prettyjsonData = prettyjsonobj
                });
            });
            console.log(EmbarkJS.Storage.getUrl(hash));
            $scope.fileLink = EmbarkJS.Storage.getUrl(hash);
        });
    }

    $scope.go = function () {
        for (let obj of $scope.jsonData) {
            _sendCoins(Number($scope.baseAcc), Number(obj.to), obj.type).then(function (response) {
                    console.log(response);
                    return response;
                },
                function (reason) {
                    alert('Failed: ' + reason);
                },
                function (update) {
                    alert('Got notification: ' + update);
                });

        }
    }

    $scope.register = function () {
        $scope.message = 'Welcome ' + $scope.user.firstname;
    };

}]);