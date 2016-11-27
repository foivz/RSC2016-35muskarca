angular.module('common')
  .directive('lnbNumbersOnly', [function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attr, ngModelCtrl) {
        function fromUser(text) {
          var transformedInput;
          if (text) {
            text = text.toString();
            transformedInput = text.replace(/[^0-9]/g, '');
            if (transformedInput !== text) {
              ngModelCtrl.$setViewValue(transformedInput);
              ngModelCtrl.$render();
            }
            return transformedInput;
          }
          return undefined;
        }
        ngModelCtrl.$parsers.push(fromUser);
      }
    };
  }])
  .directive('lnbPhoneNumber', [function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attr, ngModelCtrl) {
        function fromUser(text) {
          var text0, transformedInput;
          if (text) {
            text = text.toString();
            text0 = text[0];
            text0 = text0.replace(/[^0-9+]/g, '');
            transformedInput = text0 + text.slice(1).replace(/[^0-9 ./-]/g, '')
              .replace(/\s\s+/g, ' ')
              .replace(/--+/g, '-')
              .replace(/\/\/+/g, '\/').trim();
            if (transformedInput !== text) {
              ngModelCtrl.$setViewValue(transformedInput);
              ngModelCtrl.$render();
            }
            return transformedInput;
          }
          return '';
        }
        ngModelCtrl.$parsers.push(fromUser);
      }
    };
  }])
  .directive('lnbNoWhiteSpace', [function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attr, ngModelCtrl) {
        function fromUser(text) {
          var transformedInput;
          if (text) {
            text = text.toString();
            transformedInput = text.replace(/\s/g, '');
            if (transformedInput !== text) {
              ngModelCtrl.$setViewValue(transformedInput);
              ngModelCtrl.$render();
            }
            return transformedInput;
          }
          return undefined;
        }
        ngModelCtrl.$parsers.push(fromUser);
      }
    };
  }])
  .directive('lnbNoNumbers', [function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attr, ngModelCtrl) {
        function fromUser(text) {
          var transformedInput;
          if (text) {
            text = text.toString();
            transformedInput = text.replace(/[0-9]/g, '');
            if (transformedInput !== text) {
              ngModelCtrl.$setViewValue(transformedInput);
              ngModelCtrl.$render();
            }
            return transformedInput;
          }
          return undefined;
        }
        ngModelCtrl.$parsers.push(fromUser);
      }
    };
  }])
  .directive('lnbNumTwoDecPlaces', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        if (!ngModelCtrl) {
          return;
        }
        ngModelCtrl.$parsers.push(function () {
          var v = ngModelCtrl.$viewValue,
            decimalCheck = v.split('.');
          if (!angular.isUndefined(decimalCheck[1])) {
            decimalCheck[1] = decimalCheck[1].slice(0, 2);
            v = decimalCheck[0] + '.' + decimalCheck[1];
          }
          ngModelCtrl.$setViewValue(v);
          ngModelCtrl.$render();
          return v;
        });
        element.bind('keypress', function (event) {
          if (event.keyCode === 32) {
            event.preventDefault();
          }
        });
      }
    };
  });
