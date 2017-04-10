(function () {
    'use strict';

    angular.module('myApp').controller('UsersController', ['$scope', '$http', '$timeout', '$q', '$rootScope', 'tiaaAppService', function ($scope, $http, $timeout, $q, $rootScope, tiaaAppService) {
        console.log(tiaaAppService);

        $rootScope.title = "Users";

    }]);
})();