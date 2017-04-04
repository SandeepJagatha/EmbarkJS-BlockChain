(function () {
    'use strict';

    angular.module('myApp').controller('JsonUploadController', ['$scope', 'Upload', '$http', '$timeout', '$q', function ($scope, Upload, $http, $timeout, $q) {

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
                        $scope.prettyjsonData = prettyjsonobj;
                    });
                });
                console.log(EmbarkJS.Storage.getUrl(hash));
                $scope.fileLink = EmbarkJS.Storage.getUrl(hash);
            });
        }

        $scope.go = function () {
            console.log($scope.prettyjsonData);
            console.log(JSON.parse($scope.prettyjsonData));
            for (let obj of JSON.parse($scope.prettyjsonData)) {
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

    }]);

})();