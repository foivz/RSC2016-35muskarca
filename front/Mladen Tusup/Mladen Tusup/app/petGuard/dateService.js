angular.module('mainModule')
  .service('dateService', function () {
    this.toDate = function (dateString) {
      var parts = dateString.split(/[: T-]/).map(parseFloat);
      return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5], 0);
    };
  });
