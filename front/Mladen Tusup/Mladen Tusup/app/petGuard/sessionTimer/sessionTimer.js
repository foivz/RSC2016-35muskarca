angular.module('mainModule')
    .constant('triggerSessionDurationWarningAfterSeconds', 30 * 60)
    .run(['sessionTimerService', angular.noop])
    .service('sessionTimerService', ['$rootScope', '$interval', 'userService', function ($rootScope, $interval, userService) {
      var self = this;
      $rootScope.$watch('isLoggedIn', function (isLoggedIn) {
        if (isLoggedIn) {
          userService.invoke('GetCustomerSessionDuration', {})
              .then(function (result) {
                self.tsSessionStarted = Date.now() - result.TotalMilliseconds;
              });
        }
      });
      this.tsSessionStarted = 0;
    }])
    .directive('lnbSessionTimer', function () {
      return {
        restrict: 'E',
        replace: true,
        template: '<div class="grid-item" lnb-session-timer ng-class="{ sessionDurationWarning: shouldShowSessionDurationWarning }"><span ng-if="isLoggedIn">{{\'common.app.pws.footer.sessionTimer\' | translate}} <i class="fa fa-lg fa-clock-o" aria-hidden="true"></i> {{ sessionDuration | date:"HH:mm:ss" }} </span></div>',
        controller: ['$scope', 'sessionTimerService', 'triggerSessionDurationWarningAfterSeconds', function ($scope, sessionTimerService, triggerSessionDurationWarningAfterSeconds) {
          setInterval(function () {
            $scope.sessionDuration = Date.now() - sessionTimerService.tsSessionStarted;
            $scope.shouldShowSessionDurationWarning = $scope.sessionDuration > 1000 * triggerSessionDurationWarningAfterSeconds;
            $scope.sessionDuration += new Date($scope.sessionDuration).getTimezoneOffset() * 60 * 1000;
            $scope.$digest();
          }, 100);
        }]
      };
    });
