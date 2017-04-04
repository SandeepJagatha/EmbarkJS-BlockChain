(function () {
    'use strict';

    angular.module('myApp').controller('TIAAappController', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
        $scope.$state = $state;
        $rootScope.title = "TIAA COIN Dashboard";
    }]);
})();