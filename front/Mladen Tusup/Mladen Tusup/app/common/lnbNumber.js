angular.module('common')
    .filter('lnbNumber', ['$locale', 'numberFilter', function ($locale, numberFilter) {
      var format = function (number, minimumFraction) {
        var result, originalValue = $locale.NUMBER_FORMATS.PATTERNS[0].minFrac,
            decimalSep = $locale.NUMBER_FORMATS.DECIMAL_SEP,
            groupSep = $locale.NUMBER_FORMATS.GROUP_SEP;
        $locale.NUMBER_FORMATS.PATTERNS[0].minFrac = minimumFraction;
        $locale.NUMBER_FORMATS.DECIMAL_SEP = ',';
        $locale.NUMBER_FORMATS.GROUP_SEP = '.';
        result = numberFilter(number, minimumFraction);
        $locale.NUMBER_FORMATS.PATTERNS[0].minFrac = originalValue;
        $locale.NUMBER_FORMATS.DECIMAL_SEP = decimalSep;
        $locale.NUMBER_FORMATS.GROUP_SEP = groupSep;
        return result;
      };
      return function (value, minFractionDigits) {
        return format(value, minFractionDigits === undefined ? 2 : minFractionDigits);
      };
    }]);
