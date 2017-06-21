(function () {

    'use strict';

    angular.module('myApp').factory('sweetAlert', ['$rootScope', function ($rootScope) {

        var swal = window.swal;

        //public methods
        var self = {

            swal: function (arg1, arg2, arg3) {
                $rootScope.$evalAsync(function () {
                    if (typeof (arg2) === 'function') {
                        swal(arg1, function (isConfirm) {
                            $rootScope.$evalAsync(function () {
                                arg2(isConfirm);
                            });
                        }, arg3);
                    } else {
                        swal(arg1, arg2, arg3);
                    }
                });
            },
            success: function (title, message) {
                $rootScope.$evalAsync(function () {
                    swal(title, message, 'success');
                });
            },
            error: function (title, message) {
                $rootScope.$evalAsync(function () {
                    swal(title, message, 'error');
                });
            },
            warning: function (title, message) {
                $rootScope.$evalAsync(function () {
                    swal(title, message, 'warning');
                });
            },
            info: function (title, message) {
                $rootScope.$evalAsync(function () {
                    swal(title, message, 'info');
                });
            },
            showInputError: function (message) {
                $rootScope.$evalAsync(function () {
                    swal.showInputError(message);
                });
            },
            close: function () {
                $rootScope.$evalAsync(function () {
                    swal.close();
                });
            },
            customHtml: function (title, type, html, showCloseButton, showCancelButton, confirmButtonText, cancelButtonText, width, padding) {
                $rootScope.$evalAsync(function () {
                    swal({
                        title: title,
                        type: type,
                        html: html,
                        showCloseButton: showCloseButton || true,
                        showCancelButton: showCancelButton || false,
                        confirmButtonText: confirmButtonText || 'Ok',
                        cancelButtonText: cancelButtonText || 'Cancel',
                        width: width || 1000,
                        padding: padding || 100,
                    });
                });
            }
        };

        return self;
        }])

})();