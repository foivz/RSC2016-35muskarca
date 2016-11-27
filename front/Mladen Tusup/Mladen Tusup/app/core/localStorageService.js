angular.module('core')
  .config(['$provide', function ($provide) {
    try {
      localStorage.test = 1;
    } catch (e) {
      $provide.decorator('localStorageService', ['$delegate', function ($delegate) {
        var state = {};
        $delegate.get = function (key) {
          return state[key];
        };
        $delegate.set = function (key, value) {
          state[key] = value;
        };
        $delegate.remove = function (key) {
          delete state[key];
        };
        return $delegate;
      }]);
    }
  }]);
