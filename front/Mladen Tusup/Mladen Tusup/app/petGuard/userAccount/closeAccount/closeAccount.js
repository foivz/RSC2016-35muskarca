angular.module('petGuard')
  .service('closeAccountService', ['$rootScope', 'userService', function ($rootScope, userService) {
    var self = this;
    this.IsAccountClosable = function () {
      return userService.invoke('IsAccountClosable', {})
        .then(function (result) {
          self.isClosable = result.IsClosable;
          return result.IsClosable;
        }, function () {
          return false;
        });
    };
    this.closeAccountByCustomer = function (reason, password) {
      return userService.invoke(
        'CloseAccountByCustomer',
        {
          CloseReason: reason || '',
          Password: password
        },
        {
          possibleExceptions: {
            'Com.Finsoft.Warp.Texas.WCF.DTO.WCFUnknownException': 'incorrectPassword',
            'Com.Finsoft.Warp.Texas.WCF.DTO.IncorrectPasswordException': 'incorrectPassword' // TODO: to be implemented
          }
        }
      )
        .then(function () {
          userService.logout();
          $rootScope.$emit('closedAccount');
        });
    };
  }])
  .controller('CloseAccountCtrl', ['$scope', 'closeAccountService', 'lnbModalsService', 'isAccountClosable', function ($scope, closeAccountService, lnbModalsService, isAccountClosable) {
    var updateFormStatus, validateForm;

    updateFormStatus = function (form, isSuccess, reason) {
      form.$setPristine();
      form.$success = isSuccess;
      form.error = isSuccess ? {} : {reason: reason};

      if (reason === 'incorrectPassword') {
        form.closeAccountPassword.$modelValue = '';
      }
    };

    validateForm = function (form) {
      form.$setPristine();
      if (!form.$valid) {
        form.error = {reason: 'invalidValues'};
        form.$success = false;
      } else {
        form.error = {};
      }
      return form.$valid;
    };

    $scope.isAccountClosable = isAccountClosable;

    $scope.closeAccount = function (form, closeAccountReason, closeAccountPassword) {
      if (validateForm(form)) {
        closeAccountService.closeAccountByCustomer(closeAccountReason, closeAccountPassword).then(
          updateFormStatus.bind(undefined, form, true),
          updateFormStatus.bind(undefined, form, false)
        );
      }
    };

    $scope.lnbModalsService = lnbModalsService;

  }]);
