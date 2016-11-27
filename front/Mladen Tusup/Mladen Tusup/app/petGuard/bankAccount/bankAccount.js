angular.module('petGuard')
// .config(['$stateProvider', 'isPhone', function ($stateProvider, isPhone) {
//   $stateProvider
//     .state('bankAccount', {
//       url: '/bankAccount',
//       templateUrl: isPhone ? 'pws/bankAccount/bankAccountPhone.html' : 'pws/bankAccount/bankAccountTablet.html',
//       controller: 'BankAccountCtrl',
//       data: {
//         headerName: 'pws'
//       }
//     });
// }])
  .config(['uiMask.ConfigProvider', function (uiMaskConfigProvider) {
    uiMaskConfigProvider.maskDefinitions({'A': /[a-z]/, '*': /[a-zA-Z0-9]/});
    uiMaskConfigProvider.clearOnBlur(true);
    uiMaskConfigProvider.addDefaultPlaceholder (false);
    uiMaskConfigProvider.eventsToHandle(['input', 'keyup', 'click']);
  }])
  .filter('hideBankNumber', function () {
    return function (s) {
      if (s) {
        return s.replace(/^.*(.{4})$/mg, '********$1');
      }
    };
  })
  .directive('lnbIban', ['bankAccountValidationService', function (bankAccountValidationService) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        if (!ngModelCtrl) {
          return;
        }
        ngModelCtrl.$parsers.push(function () {
          var v = ngModelCtrl.$viewValue,
            isValid,
            bankAccount = v.toUpperCase().replace(/[^A-Z0-9]/g, ''),
            isEdit = false;
          isEdit = v.length < scope.lastVal.length && scope.lastVal.indexOf(v) === -1;
          scope.lastVal = v;
          if (isEdit) {
            return v;
          }
          if (bankAccount.length === 14 && bankAccount.indexOf('BE') === -1) {
            bankAccount = 'BE' + bankAccount;
          }
          isValid = bankAccountValidationService.patterns.IBAN(bankAccount) || bankAccountValidationService.patterns.BBAN(bankAccount);
          if (isValid || bankAccount.length === 16) {
            v = bankAccount.split(/(....)/).filter(String).join(' ');
            ngModelCtrl.$setViewValue(v);
            ngModelCtrl.$render();
          }
          return v;
        });
        //
        element.bind('blur', function () {
          var v = ngModelCtrl.$viewValue || '',
            bankAccount = v.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (bankAccount.length >= 12 && bankAccount.length <= 16) {
            v = bankAccount.split(/(....)/).filter(String).join(' ');
            ngModelCtrl.$setViewValue(v);
            ngModelCtrl.$render();
            return v;
          }
        });
        element.bind('focus', function () {
          scope.lastVal = ngModelCtrl.$viewValue || '';
        });
        //
        scope.lastVal = ngModelCtrl.$viewValue || '';
      }
    };
  }]);
