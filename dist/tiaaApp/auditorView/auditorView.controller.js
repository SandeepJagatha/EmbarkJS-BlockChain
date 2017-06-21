(function () {
    'use strict';

    angular.module('myApp').controller('AuditorViewController', ['$scope', 'Upload', '$http', '$timeout', '$q', '$rootScope', 'sweetAlert', function ($scope, Upload, $http, $timeout, $q, $rootScope, sweetAlert) {

        $scope.endDateBeforeRender = endDateBeforeRender;
        $scope.endDateOnSetTime = endDateOnSetTime;
        $scope.startDateBeforeRender = startDateBeforeRender;
        $scope.startDateOnSetTime = startDateOnSetTime;

        function startDateOnSetTime() {
            $scope.$broadcast('start-date-changed');
        }

        function endDateOnSetTime() {
            $scope.$broadcast('end-date-changed');
        }

        function startDateBeforeRender($dates) {
            if ($scope.dateRangeEnd) {
                var activeDate = moment($scope.dateRangeEnd);

                $dates.filter(function (date) {
                    return date.localDateValue() >= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                });
            }
        }

        function endDateBeforeRender($view, $dates) {
            if ($scope.dateRangeStart) {
                var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');

                $dates.filter(function (date) {
                    return date.localDateValue() <= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                });
            }
        }


        EmbarkJS.Storage.setProvider('ipfs', {
            server: 'localhost',
            port: '5001'
        });

        $scope.fildataArr = [];

        function addFile(date, json) {
            var deferred = $q.defer();

            setTimeout(function () {
                FileData.newEntity(date, json)
                    .then(function (response) {
                        deferred.resolve(response);
                    }).catch(function (e) {
                        console.log(e);
                        deferred.reject('Address is not allowed.');
                    })

            }, 0);

            return deferred.promise;
        }


        function getEntityCount() {
            var deferred = $q.defer();

            setTimeout(function () {
                FileData.getEntityCount()
                    .then(function (response) {
                        deferred.resolve(response);
                    }).catch(function (e) {
                        console.log(e);
                        deferred.reject('Address is not allowed.');
                    })

            }, 0);

            return deferred.promise;
        }


        function getEntity(index) {
            var deferred = $q.defer();

            setTimeout(function () {
                FileData.getEntities(index)
                    .then(function (response) {
                        deferred.resolve(response);
                    }).catch(function (e) {
                        console.log(e);
                        deferred.reject('Address is not allowed.');
                    })

            }, 0);

            return deferred.promise;
        }


        $scope.getRecordsByDateRange = function () {

            $scope.selectedRequestType = $scope.rtq;

            var activeDate1 = moment($scope.dateRangeStart);
            var activeDate2 = moment($scope.dateRangeEnd);

            console.log(activeDate1);
            console.log(activeDate2);

            getEntityCount().then(function (response) {
                    var length = response.valueOf();
                    console.log(length);
                    $scope.fildataArr = [];
                    for (var i = 0; i < length; i++) {
                        getEntity(i).then(function (response) {
                                response[0] = new Date(Number(response[0].valueOf()));

                                if (response[0] >= $scope.dateRangeStart && response[0] <= $scope.dateRangeEnd) {
                                    $scope.fildataArr.push(response);
                                }

//                                var ipfs = window.IpfsApi('localhost', '5001');
 //                                var files = [
 //                                    {
 //                                        path: 'http://www.pdf995.com/samples/pdf.pdf'
 //                                          }
 //                                        ];
 //
 //                                ipfs.files.add(files, function (err, files) {
 //                                    console.log(files);
 //                                });
 //                                ipfs.add(files, function (err, hash) {
 //                                    if (err) throw err; // If connection is closed
 //                                    alert(hash)
 //                                    console.log(hash); // "Qmc7CrwGJvRyCYZZU64aPawPj7CJ56vyBxdhxa38Dh1aKt"
 //                                });
 //                                var multihashStr = 'Qmb2ifKXSiR2DtPWtRUPtjF6MTsR4QjcdcV7pkUBzSfNZw';
 //                                ipfs.files.get(multihashStr, function (err, stream) {
 //                                    stream.on('data', (file) => {
 //                                        // write the file's path and contents to standard out
 //                                        console.log(file.path);
 //                                        file.content.pipe(process.stdout);
 //                                    })
 //                                });

                                console.log(response);
                            },
                            function (reason) {
                                console.log('Failed: ' + reason);
                            },
                            function (update) {
                                console.log('Got notification: ' + update);
                            });
                    }

                    $scope.selectedRequestType = $scope.rtq;

                },
                function (reason) {
                    console.log('Failed: ' + reason);
                },
                function (update) {
                    console.log('Got notification: ' + update);
                });

        };
}]);

})();