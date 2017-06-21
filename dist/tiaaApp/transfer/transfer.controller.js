(function () {
    'use strict';

    angular.module('myApp').controller('TransferController', ['$scope', '$http', '$timeout', '$q', '$rootScope', 'tiaaAppService', 'sweetAlert', function ($scope, $http, $timeout, $q, $rootScope, tiaaAppService, sweetAlert) {

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
            tiaaAppService.getAccountBalance($rootScope.globals.curentUserObj.account).then(function (response) {
                if (Number(response) > Number($scope.transferForm.amount)) {
                    _sendCoin(Number($rootScope.globals.curentUserObj.account), Number($scope.transferForm.recipient), $scope.transferForm.amount).then(function (response) {
                            console.log(response);
                            $scope.response = response;


                            tiaaAppService.getAccountBalance(Number($rootScope.globals.curentUserObj.account)).then(function (balance) {
                                $rootScope.globals.curentUserObj.balance = balance;
                            }, function (reason) {
                                console.log('Failed: ' + reason);
                            }, function (update) {
                                console.log('Got notification: ' + update);
                            });


                            $scope.transferForm = null;

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

                            sweetAlert.customHtml("Transaction Successful!", "success", strVar, true, false);

                            return response;
                        },
                        function (reason) {
                            console.log('Failed: ' + reason);
                        },
                        function (update) {
                            console.log('Got notification: ' + update);
                        });
                } else {
                    sweetAlert.error("Transaction Failed!", "We were unable to process due to insufficient funds");
                }
            });
        }

        $scope.amountChange = function (value) {
            if (value && $rootScope.globals.curentUserObj.balance > value) {
                var subtractedValue = Number($rootScope.globals.curentUserObj.balance) - Number(value);
                $rootScope.globals.curentUserObj.balance = subtractedValue.toString();
            }
        }

    }]);
})();