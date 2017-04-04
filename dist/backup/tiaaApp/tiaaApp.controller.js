(function () {
    'use strict';

    angular.module('myApp').controller('TIAAappController', ['$scope', '$state', function ($scope, $state) {
        $scope.$state = $state;
    }]);
})();