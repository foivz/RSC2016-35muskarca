angular.module('common')
    .filter('lnbCurrencySymbol', [function () {
      return function (value, suffixSymbol) {
        var symbol = '€';
        return suffixSymbol ? value + symbol : symbol + value;
      };
    }])
    .filter('lnbDGCurrency', ['$injector', '$locale', '$sce', function ($injector, $locale, $sce) {
      var $filter, numberFilter, formats, pattern;
      $filter = $injector.get('$filter');
      numberFilter = $filter('number');
      formats = $locale.NUMBER_FORMATS;
      pattern = formats.PATTERNS[1];
      return function (amount, fractionSize, currencySymbolScale, currencySymbol, suffixSymbol) {
        var isBoolean, defaultCurrencySymbol, defaultSuffixSymbol, defaultCurrencySymbolScale, isNegative, parts, number, result;
        isBoolean = function (obj) {
          return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]';
        };
        defaultCurrencySymbol = '€';
        defaultSuffixSymbol = false;
        defaultCurrencySymbolScale = 75;

        if (!angular.isNumber(amount)) {
          return 0;
        }
        if (angular.isUndefined(currencySymbol)) {
          currencySymbol = defaultCurrencySymbol;
        }
        if (angular.isUndefined(currencySymbolScale)) {
          currencySymbolScale = defaultCurrencySymbolScale;
        }

        isNegative = amount < 0;
        parts = [];

        suffixSymbol = defaultSuffixSymbol;
        suffixSymbol = isBoolean(fractionSize) ? fractionSize : suffixSymbol;
        fractionSize = isBoolean(fractionSize) ? formats.DEFAULT_PRECISION : fractionSize;
        fractionSize = angular.isUndefined(fractionSize) ? formats.DEFAULT_PRECISION : fractionSize;

        amount = Math.abs(amount);
        fractionSize = (/^-?\d+$/.test(String(amount))) ? fractionSize : 2;
        number = numberFilter(amount, fractionSize);
        parts.push(isNegative ? pattern.negPre : pattern.posPre);
        parts.push(!suffixSymbol ? currencySymbol : number);
        parts.push(suffixSymbol ? '<span style="font-size:' + currencySymbolScale + '%">' + currencySymbol + '</span>' : number);
        parts.push(isNegative ? pattern.negSuf : pattern.posSuf);

        result = parts.join('').replace(/\u00A4/g, '').replace(/\./g, '#').replace(/\,/g, '.').replace(/\#/g, ',');
        return $sce.trustAsHtml(result);
      };
    }])
    .filter('lnbCurrency', ['$injector', '$locale', '$sce', function ($injector, $locale, $sce) {
      var $filter, numberFilter, formats, pattern;
      $filter = $injector.get('$filter');
      numberFilter = $filter('number');
      formats = $locale.NUMBER_FORMATS;
      pattern = formats.PATTERNS[1];
      formats.DEFAULT_PRECISION = angular.isUndefined(formats.DEFAULT_PRECISION) ? 2 : formats.DEFAULT_PRECISION;
      return function (amount, fractionSize, currencySymbolScale, currencySymbol, suffixSymbol) {
        var isBoolean, defaultCurrencySymbol, defaultSuffixSymbol, defaultCurrencySymbolScale, isNegative, parts, number, result;
        isBoolean = function (obj) {
          return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]';
        };
        defaultCurrencySymbol = '€';
        defaultSuffixSymbol = true;
        defaultCurrencySymbolScale = 75;

        if (!angular.isNumber(amount)) {
          return 0;
        }
        if (angular.isUndefined(currencySymbol)) {
          currencySymbol = defaultCurrencySymbol;
        }
        if (angular.isUndefined(currencySymbolScale)) {
          currencySymbolScale = defaultCurrencySymbolScale;
        }

        isNegative = amount < 0;
        parts = [];

        suffixSymbol = defaultSuffixSymbol;
        suffixSymbol = isBoolean(fractionSize) ? fractionSize : suffixSymbol;
        fractionSize = isBoolean(fractionSize) ? formats.DEFAULT_PRECISION : fractionSize;
        fractionSize = angular.isUndefined(fractionSize) ? formats.DEFAULT_PRECISION : fractionSize;

        amount = Math.abs(amount);

        number = numberFilter(amount, fractionSize);
        parts.push(isNegative ? pattern.negPre : pattern.posPre);
        parts.push(!suffixSymbol ? currencySymbol + ' ' : number);
        // parts.push(suffixSymbol ? '<span style="font-size:' + currencySymbolScale + '%">' + currencySymbol + '</span>' : number);
        parts.push(suffixSymbol ? ' ' + currencySymbol : number);
        parts.push(isNegative ? pattern.negSuf : pattern.posSuf);

        result = parts.join('').replace(/\u00A4/g, '').replace(/\./g, '#').replace(/\,/g, '.').replace(/\#/g, ',');
        return $sce.trustAsHtml(result);
      };
    }]);
