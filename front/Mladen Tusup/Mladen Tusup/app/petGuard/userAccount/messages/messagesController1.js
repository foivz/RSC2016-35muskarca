angular.module('petGuard')
  .controller('messagesCtrl', ['$scope', '$stateParams', 'messagesService', 'previousState', function ($scope, $stateParams, messagesService, previousState) {
    $scope.$on('$stateChangeSuccess', function () {
      if (previousState.indexOf('app.pws.messages') === -1) {
        $scope.showMessagesFilter = false;
        return;
      }
      $scope.showMessagesFilter = $scope.messagesService.showMessagesFilter;
    });
    $scope.messagesType = $stateParams.type;
    $scope.messagesService = messagesService;
    // $scope.showMessagesFilter = $scope.messagesService.showMessagesFilter;
    $scope.showHideFilter = function () {
      $scope.showMessagesFilter = $scope.messagesService.showHideFilter();
    };
    if ($scope.messagesType === 'unread') {
      messagesService.undeliveredMessagesOnly = true;
      $scope.messagesService.applyFilter(messagesService.typeId, messagesService.dateFrom, messagesService.dateTo, messagesService.undeliveredMessagesOnly);
    } else {
      messagesService.undeliveredMessagesOnly = false;
      $scope.messagesService.applyFilter(messagesService.typeId, messagesService.dateFrom, messagesService.dateTo, messagesService.undeliveredMessagesOnly);
    }
  }]);
