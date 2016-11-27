angular.module('mainModule')
  .filter('toDate', function () {
    return function (input) {
      var dateParts;
      if (!input || typeof input !== 'string') {
        return '';
      }
      dateParts = input.split(' ').join('-').split('-');
      return new Date(dateParts[2], dateParts[1] - 1, dateParts[0], dateParts[3], dateParts[4], dateParts[5]);
    };
  })
  .filter('i18nDayOfWeek', function () {
    return function (input) {
      if (!input || !input.getDay) {
        return '';
      }
      return 'common.daysOfWeek' + input.getDay();
    };
  })
  .filter('i18nMonth', function () {
    return function (input) {
      if (!input || !input.getMonth) {
        return '';
      }
      return 'common.month' + input.getMonth();
    };
  });
