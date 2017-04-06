(function () {
    'use strict';

    angular.module('myApp').controller('JsonUploadController', ['$scope', 'Upload', '$http', '$timeout', '$q', '$rootScope', function ($scope, Upload, $http, $timeout, $q, $rootScope) {

        EmbarkJS.Storage.setProvider('ipfs', {
            server: 'localhost',
            port: '5001'
        });

        $scope.jsonData = "";
        $scope.prettyjsonData = "";
        $scope.baseAcc = "";
        $scope.fileLink = "";
        $scope.fileHash = "";
        $rootScope.title = "JSON Uploader";


        function _sendCoins(baseAddr, accountAddr, type) {
            var deferred = $q.defer();

            setTimeout(function () {
                MetaCoin.sendCoinByType(Number(baseAddr), Number(accountAddr), type)
                    .then(function (response) {
                        deferred.resolve(response);
                    }).catch(function (e) {
                        console.log(e);
                        deferred.reject('Address ' + accountAddr + ' is not allowed.');
                    })

            }, 0);

            return deferred.promise;
        }


        function CSVToArray(strData, strDelimiter) {
            // Check to see if the delimiter is defined. If not,
            // then default to comma.
            strDelimiter = (strDelimiter || ",");

            // Create a regular expression to parse the CSV values.
            var objPattern = new RegExp(
                (
                    // Delimiters.
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                    // Quoted fields.
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                    // Standard fields.
                    "([^\"\\" + strDelimiter + "\\r\\n]*))"
                ),
                "gi"
            );


            // Create an array to hold our data. Give the array
            // a default empty first row.
            var arrData = [[]];

            // Create an array to hold our individual pattern
            // matching groups.
            var arrMatches = null;


            // Keep looping over the regular expression matches
            // until we can no longer find a match.
            while (arrMatches = objPattern.exec(strData)) {

                // Get the delimiter that was found.
                var strMatchedDelimiter = arrMatches[1];

                // Check to see if the given delimiter has a length
                // (is not the start of string) and if it matches
                // field delimiter. If id does not, then we know
                // that this delimiter is a row delimiter.
                if (
                    strMatchedDelimiter.length &&
                    strMatchedDelimiter !== strDelimiter
                ) {

                    // Since we have reached a new row of data,
                    // add an empty row to our data array.
                    arrData.push([]);

                }

                var strMatchedValue;

                // Now that we have our delimiter out of the way,
                // let's check to see which kind of value we
                // captured (quoted or unquoted).
                if (arrMatches[2]) {

                    // We found a quoted value. When we capture
                    // this value, unescape any double quotes.
                    strMatchedValue = arrMatches[2].replace(
                        new RegExp("\"\"", "g"),
                        "\""
                    );

                } else {

                    // We found a non-quoted value.
                    strMatchedValue = arrMatches[3];

                }


                // Now that we have our value string, let's add
                // it to the data array.
                arrData[arrData.length - 1].push(strMatchedValue);
            }

            // Return the parsed data.
            return (arrData);
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

                        var csvToArray = CSVToArray(data);
                        var result = [];
                        var headers = csvToArray[0];

                        for (var i = 1; i < csvToArray.length; i++) {
                            var obj = {};
                            var currentline = csvToArray[i];

                            for (var j = 0; j < headers.length; j++) {
                                obj[headers[j]] = currentline[j];
                            }
                            result.push(obj);
                        }
                        var prettyjsonobj = JSON.stringify(result, undefined, 4);
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