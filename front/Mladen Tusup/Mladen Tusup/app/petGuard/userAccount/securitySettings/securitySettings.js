angular.module('petGuard')
  .constant('passwordLengthMin', 6)
  .constant('passwordLengthMax', 30)
  .service('securitySettingsService', ['userService', 'passwordLengthMin', 'passwordLengthMax', function (userService, passwordLengthMin, passwordLengthMax) {
    var bonusExcess = 3, bonusUpper = 4, bonusNumbers = 5, bonusSymbols = 5,
      regexUpperCaseLetters = /[A-Z]$/,
      regexNumbers = /[0-9]$/,
      regexSymbols = /(.*[!,@,#,$,%,^,&,*,?,_,~])$/,
      regexAllLowerCaseLetters = /^[\sa-z]+$/,
      regexAllNumbers = /^[\s0-9]+$/;

    this.checkPasswordStrength = function (password) {
      var result, numUpper = 0, numNumbers = 0, numSymbols = 0, i, charsInPassword;
      if (!password || password.length < passwordLengthMin || password.length > passwordLengthMax) {
        return {
          isValid: false,
          score: 0,
          strength: 'NotChecked'
        };
      }
      result = { score: 50 };
      charsInPassword = password.split('');
      for (i = 0; i < charsInPassword.length; i++) {
        if (regexUpperCaseLetters.test(charsInPassword[i])) {
          numUpper++;
          result.score += bonusUpper;
        }
        if (regexNumbers.test(charsInPassword[i])) {
          numNumbers++;
          result.score += bonusNumbers;
        }
        if (regexSymbols.test(charsInPassword[i])) {
          numSymbols++;
          result.score += bonusSymbols;
        }
      }
      result.score += bonusExcess * (charsInPassword.length - passwordLengthMin);
      if (numUpper > 0 && numNumbers > 0 && numSymbols > 0) {
        result.score += 25;
      } else if (numUpper > 0 && numNumbers > 0 || numUpper > 0 && numSymbols > 0 || numNumbers > 0 && numSymbols > 0) {
        result.score += 15;
      }
      if (regexAllLowerCaseLetters.test(password)) {
        result.score -= 15;
      }
      if (regexAllNumbers.test(password)) {
        result.score -= 35;
      }
      [{ score: 1, strength: 'Insufficient' }, { score: 50, strength: 'Weak' }, { score: 75, strength: 'Average' }, { score: 100, strength: 'Strong' }, { score: Infinity, strength: 'Secure' }].some(function (threashold) {
        result.strength = threashold.strength;
        return result.score <= threashold.score;
      });
      result.isValid = result.score > 50;
      return result;
    };

    this.setPassword = function (oldPassword, password) {
      return userService.invoke('SetPassword', {
        oldPassword: oldPassword,
        password: password
      }, {
        possibleExceptions: {
          'Com.Finsoft.Warp.Connecticut.Rpc.InvalidRpcRequestException': 'missingValues',
          'Com.Finsoft.Warp.Connecticut.Services.IncorrectPasswordException': 'incorrectPassword'
        }
      });
    };
  }])
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
    };

    $scope.personalDetails = personalDetails;

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

    $scope.securitySettingsService = securitySettingsService;
    $scope.scroll = {};
    reset();
  }])
;
