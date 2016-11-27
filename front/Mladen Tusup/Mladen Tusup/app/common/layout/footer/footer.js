angular.module('mainModule')
  .controller('FooterController', ['$scope', '$rootScope', '$state', 'language', 'navigationService',
    function ($scope, $rootScope, $state, language, navigationService) {
      $scope.watcher = $rootScope.$on('navigationFetched', function () {
        $scope.footerNavigation = navigationService.fetchNavigationSectionByName('TEST-FOOTER-NAV').fwnavigationgroups || [];
      });
      $scope.$on('$destroy', function () {
        $scope.watcher();
      });
    }
  ]);
