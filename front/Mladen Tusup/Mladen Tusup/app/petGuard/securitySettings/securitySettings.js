angular.module('petGuard')
  .controller('SecuritySettingsCtrl', ['$scope', 'securitySettingsService', 'personalDetails', function ($scope, securitySettingsService, personalDetails) {
    var updateFormStatus = function (form, scrollTo, isSuccess, reason) {
      form.$setPristine();
      form.$success = isSuccess;
      form.error = isSuccess ? {} : { reason: reason };
      if (scrollTo) {
        $scope.scroll[scrollTo] = true;
      }
    }, reset = function () {
      $scope.changePassword = {};
      $scope.changeSalutation = {
        salutation: personalDetails.Salutation
      };
    };
    $scope.triggerScrollAndResetForm = function () {
      ['password', 'salutation'].forEach(function (section) {
        $scope.scroll[section] = angular.element(document.getElementById(section + 'Anchor')).hasClass('open');
      });
      reset();
    };
    $scope.setPassword = function (form) {
      var passwordStrength;
      if ($scope.changePassword.password !== $scope.changePassword.confirmPassword) {
        updateFormStatus(form, 'passwordStatus', false, 'mismatchedPassword');
        return;
      }
      passwordStrength = securitySettingsService.checkPasswordStrength($scope.changePassword.password);
      if (!passwordStrength.isValid) {
        updateFormStatus(form, 'passwordStatus', false, 'invalidNewPassword');
        return;
      }
      updateFormStatus(form, undefined, false);
      securitySettingsService.setPassword($scope.changePassword.oldPassword, $scope.changePassword.password).then(
        updateFormStatus.bind(undefined, form, 'passwordStatus', true),
        updateFormStatus.bind(undefined, form, 'passwordStatus', false)
      ).finally(function () {
        $scope.changePassword = {};
      });
    };
    $scope.setSalutation = function (form) {
      updateFormStatus(form, 'salutationStatus', false);
      securitySettingsService.setSalutation($scope.changeSalutation.salutation, $scope.changeSalutation.salutationPassword).then(
        updateFormStatus.bind(undefined, form, 'salutationStatus', true),
        updateFormStatus.bind(undefined, form, 'salutationStatus', false)
      ).finally(function () {
        delete $scope.changeSalutation.salutationPassword;
      });
    };
    $scope.securitySettingsService = securitySettingsService;
    $scope.scroll = {};
    reset();
  }])
  .config(['$stateProvider', 'isPhone', function ($stateProvider, isPhone) {
    $stateProvider
      .state('securitySettings', {
        url: '/securitySettings',
        templateUrl: isPhone ? 'pws/securitySettings/securitySettingsPhone.html' : 'pws/securitySettings/securitySettingsTablet.html',
        controller: 'SecuritySettingsCtrl',
        data: {
          headerName: 'pws'
        },
        resolve: {
          personalDetails: ['userService', function (userService) {
            return userService.getPersonalDetailsIfLoggedIn();
          }]
        }
      })
      .state('changePassword', {
        url: '/securitySettings/changePassword',
        templateUrl: 'pws/securitySettings/changePassword.html',
        controller: 'SecuritySettingsCtrl',
        data: {
          headerName: 'pws'
        },
        resolve: {
          personalDetails: ['userService', function (userService) {
            return userService.getPersonalDetailsIfLoggedIn();
          }]
        }
      })
      .state('salutation', {
        url: '/securitySettings/salutation',
        templateUrl: 'pws/securitySettings/salutation.html',
        controller: 'SecuritySettingsCtrl',
        data: {
          headerName: 'pws'
        },
        resolve: {
          personalDetails: ['userService', function (userService) {
            return userService.getPersonalDetailsIfLoggedIn();
          }]
        }
      });
  }]);
