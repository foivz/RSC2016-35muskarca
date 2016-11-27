(function () {
    'use strict';
 
    angular
        .module('common')
        .controller('RegisterController', RegisterController);
 
    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'AuthenticationService', '$state'];
    function RegisterController(UserService, $location, $rootScope,AuthenticationService, $state) {
        var vm = this;
 
        vm.register = register;
 
        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
      AuthenticationService.SetCredentials(response.payload.username, response.payload.fullname, response.payload.token);
                       $state.go('iQuiz.common.userAccount');
                    } else {
                        vm.dataLoading = false;
                    }
                });
        }
    }
 
})();