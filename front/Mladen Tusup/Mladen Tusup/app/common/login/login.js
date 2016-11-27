(function () {
    'use strict';

    angular
        .module('common')
        .controller('LoginController', LoginController);
 
    LoginController.$inject = ['$location', 'AuthenticationService', '$rootScope'];
    function LoginController($location, AuthenticationService, $rootScope) {
        var vm = this;
 
        vm.login = login;
 
        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
 
        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                 AuthenticationService.SetCredentials(response.payload.username, response.payload.fullname, response.payload.token);
                    
                    $location.path('/');
                } else {
                    vm.dataLoading = false;
                }
            });
        };
    }
 
})();