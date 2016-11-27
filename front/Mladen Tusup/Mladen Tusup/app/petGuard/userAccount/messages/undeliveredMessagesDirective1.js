angular.module('petGuard')
  .directive('lnbUndeliveredMessagesIndicator', ['messagesService', function (messagesService) {
    return {
      restrict: 'AE',
      scope: {},
      template: '<span class="badge background-color-dark-blue color-white" ng-if="messagesService.undeliveredMessages">{{numberOfMessages}}</span>',
      link: function (scope) {
        scope.messagesService = messagesService;
        scope.$watch('messagesService.undeliveredMessages', function () {
          scope.numberOfMessages = (messagesService.undeliveredMessages < 100 ? messagesService.undeliveredMessages : '>99');
        });
      }
    };
  }]);
