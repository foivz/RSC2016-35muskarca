(function () {
    'use strict';

    angular
        .module('common')
        .controller('LogoutController', LogoutController);
 
    LogoutController.$inject = ['$location', 'AuthenticationService', '$rootScope', '$cookies'];
    function LogoutController($location, AuthenticationService, $rootScope, $cookies) {
        var vm = this;
 
        vm.logout = logout;
 
        function logout() {
            vm.dataLoading = true;
            AuthenticationService.Logout(function (response) {
                if (response.success) {
                 AuthenticationService.ClearCredentials();
                    
                    $location.path('/');
                } else {
                    vm.dataLoading = false;
                }
            });
        };
    }
 
})();