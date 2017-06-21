(function () {
    'use strict';

    angular.module('myApp').controller('FileStorageController', ['$scope', 'Upload', '$http', '$timeout', '$q', '$rootScope', 'sweetAlert', function ($scope, Upload, $http, $timeout, $q, $rootScope, sweetAlert) {


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


        web3.eth.getAccounts(function (err, accs) {
            $scope.baseAcc = accs[0];
        });

        $scope.uploadFile = function () {



            //            var salaryInfoSource = 'pragma solidity ^0.4.6; contract SalaryInfo { struct User { uint salaryId; string name; string userAddress; uint salary; } User[] public users; function addUser(uint _salaryId, string _name, string _userAddress, uint _salary) public returns(uint) { users.length++; users[users.length-1].salaryId = _salaryId; users[users.length-1].name = _name; users[users.length-1].userAddress = _userAddress; users[users.length-1].salary = _salary; return users.length; } function getUsersCount() public constant returns(uint) { return users.length; } function getUser(uint index) public constant returns(uint, string, string, uint) { return (users[index].salaryId, users[index].name, users[index].userAddress, users[index].salary); }}';
            //
            //            var salaryInfoCompiled = web3.eth.compile.solidity(salaryInfoSource);
            //            var salaryInfoContract = web3.eth.contract(salaryInfoCompiled.info.abiDefinition);
            //
            //            var contract = web3.eth.contract(salaryInfoCompiled.info.abiDefinition).at(salaryInfoCompiled.code);
            //
            //            var salaryInfo = salaryInfoContract.new({
            //                    from: web3.eth.accounts[0],
            //                    data: salaryInfoCompiled.code,
            //                    gas: 1000000
            //                },
            //                function (e, contract) {
            //                    if (!e) {
            //                        if (!contract.address) {
            //                            console.log("Contract transaction send: TransactionHash: " +
            //                                contract.transactionHash + " waiting to be mined...");
            //                        } else {
            //                            console.log("Contract mined! Address: " + contract.address);
            //                            console.log(contract);
            //                        }
            //                    }
            //                }
            //            )
            //
            //            contract.addUser(123, "User 123", "123 drive way, the uncentralised kingdom", 100, {
            //                from: $scope.baseAcc,
            //                data: salaryInfoCompiled.code,
            //                gas: 500000
            //            });
            //            contract.addUser(234, "User 234", "234 drive way, the uncentralised kingdom", 200, {
            //                from: $scope.baseAcc,
            //                data: salaryInfoCompiled.code,
            //                gas: 500000
            //            });
            //
            //            var numberOfUsers = contract.getUsersCount();
            //            alert(numberOfUsers);
            //
            //            console.log(contract.getUser(0));
            //            var user2 = contract.getUser(1);
            //            console.log(user2);




            console.log($scope.jsonText);

            var jsondata = [
                {
                    type: "KBA",
                    name: "Michael Jackson",
                    pin: "1234567",
                    questionaire: [
                        {
                            question1: "Question1",
                            answer1: "Option A"
            },
                        {
                            question1: "Question2",
                            answer1: "Option D"
            },
                        {
                            question1: "Question3",
                            answer1: "Option C"
            },
                        {
                            question1: "Question4",
                            answer1: "Option B"
            },
                        {
                            question1: "Question5",
                            answer1: "Option C"
            }
        ]
    },
                {
                    type: "KBA",
                    name: "Demi lavato",
                    pin: "1111111",
                    questionaire: [
                        {
                            question1: "Question1",
                            answer1: "Option A"
            },
                        {
                            question1: "Question2",
                            answer1: "Option D"
            },
                        {
                            question1: "Question3",
                            answer1: "Option C"
            },
                        {
                            question1: "Question4",
                            answer1: "Option B"
            },
                        {
                            question1: "Question5",
                            answer1: "Option C"
            }
        ]
    },
                {
                    type: "KBA",
                    name: "Adele",
                    pin: "7654321",
                    questionaire: [
                        {
                            question1: "Question1",
                            answer1: "Option A"
            },
                        {
                            question1: "Question2",
                            answer1: "Option D"
            },
                        {
                            question1: "Question3",
                            answer1: "Option C"
            },
                        {
                            question1: "Question4",
                            answer1: "Option B"
            },
                        {
                            question1: "Question5",
                            answer1: "Option C"
            }
        ]
    }
];


            var jsondataString = JSON.stringify($scope.jsonText);

            console.log(jsondataString);


            addFile(new Date().getTime(), jsondataString).then(function (response) {
                    console.log(response);

                    var strVar = "<div class='row'>";
                    strVar += "<div class=\"col-lg-12 col-sm-12\" ng-if=\"response\">";
                    strVar += "        <div class=\"card card-circle-chart\" data-background-color=\"blue\">";
                    strVar += "            <div class=\"card-header text-center\">";
                    strVar += "                <h5 class=\"card-title\">Thank you!<\/h5>";
                    strVar += "                <p class=\"description\">Transcation Details<\/p>";
                    strVar += "            <\/div>";
                    strVar += "            <div class=\"card-content\" style=\"text-align: left;\">";
                    strVar += "                <dl class=\"dl-horizontal\">";
                    strVar += "                    <dt>BlockHash<\/dt>";
                    strVar += "                    <dd>" + response.blockHash + "<\/dd>";
                    strVar += "                    <dt>BlockNumber<\/dt>";
                    strVar += "                    <dd>" + response.blockNumber + "<\/dd>";
                    strVar += "                    <dt>Contract Address<\/dt>";
                    strVar += "                    <dd>" + response.contractAddress + "<\/dd>";
                    strVar += "                    <dt>Cumulative Gas Used<\/dt>";
                    strVar += "                    <dd>" + response.cumulativeGasUsed + "<\/dd>";
                    strVar += "                    <dt>Gas Used<\/dt>";
                    strVar += "                    <dd>" + response.gasUsed + "<\/dd>";
                    strVar += "                    <dt>Transcation Hash<\/dt>";
                    strVar += "                    <dd>" + response.transactionHash + "<\/dd>";
                    strVar += "                <\/dl>";
                    strVar += "            <\/div>";
                    strVar += "        <\/div>";
                    strVar += "    <\/div> </div>";

                    sweetAlert.customHtml("RTQ Transaction Successful!", "success", strVar, true, false);





                    var dbObject = {};
                    var integerDate = new Date().getTime();
                    dbObject.key = new Date().getTime();
                    dbObject.value = "KBA";
                    dbObject.transactionHash = response.transactionHash;
                    dbObject.pin = $rootScope.globals.curentUserObj.account;
                    dbObject.name = $rootScope.globals.curentUserObj.accountName;
                    dbObject.type = "KBA";

                    //4. Post the Transaction Hash , FileHash and Customer Details
                    $http.post('http://tiaaweb-chudeswaran.rhcloud.com/TiaaWeb/accountfundingrsv1/insert-file-details', JSON.stringify(dbObject), {
                            headers: {
                                'Access-Control-Request-Headers': 'content-type'
                            }
                        })
                        .then(function onSuccess(response) {
                            console.log("Persisting in DB done " + response.toString());

                            //5 . Retrieve The details using the date for UI query
                            var object = {};
                            object.key = integerDate;
                            $http.post('http://tiaaweb-chudeswaran.rhcloud.com/TiaaWeb/accountfundingrsv1/file-details', JSON.stringify(object))
                                .then(function onSuccess(response) {
                                    console.log("Retrieve from DB done " + response);
                                    console.log(response);
                                });
                        });









                    getEntityCount().then(function (response) {
                            var length = response.valueOf();
                            console.log(length);
                            $scope.fildataArr = [];
                            for (var i = 0; i < length; i++) {
                                getEntity(i).then(function (response) {
                                        response[0] = new Date(Number(response[0].valueOf())).toUTCString();
                                        $scope.fildataArr.push(response);
                                        console.log(response);
                                    },
                                    function (reason) {
                                        console.log('Failed: ' + reason);
                                    },
                                    function (update) {
                                        console.log('Got notification: ' + update);
                                    });
                            }

                            console.log($scope.fildataArr);

                        },
                        function (reason) {
                            console.log('Failed: ' + reason);
                        },
                        function (update) {
                            console.log('Got notification: ' + update);
                        });

                    return response;
                },
                function (reason) {
                    console.log('Failed: ' + reason);
                },
                function (update) {
                    console.log('Got notification: ' + update);
                });

        };

        $scope.go = function () {
            console.log($scope.prettyjsonData);
            console.log(JSON.parse($scope.prettyjsonData));

            for (let obj of JSON.parse($scope.prettyjsonData)) {
                _sendCoins(Number($scope.baseAcc), Number(obj.to), obj.type).then(function (response) {
                        console.log(response);
                        return response;
                    },
                    function (reason) {
                        console.log('Failed: ' + reason);
                    },
                    function (update) {
                        console.log('Got notification: ' + update);
                    });

            }
        }

}]);

})();