angular.module('mainModule')
  .service('headerService', ['$rootScope', 'rpcService', 'mainNavigation', 'drawGamesDetailsService', 'navigationService', function ($rootScope, rpcService, mainNavigation, drawGamesDetailsService, navigationService) {
    var self = this, navigationSections;
    this.getMainNavigation = function () {
      return mainNavigation()
        .then(function (result) {
          // start - support for old generator (should be removed)
          if (result.fwnavigationsection) {
            result = result.fwnavigationsection.fwnavigationgroups.fwnavigationgroup.fwnavigationitems.fwnavigationitem || [];
            angular.forEach(result, function (value) {
              var a = [];
              if (!angular.isArray(value.fwnavigationgroup.fwnavigationitems.fwnavigationitem)) {
                a.push(value.fwnavigationgroup.fwnavigationitems.fwnavigationitem);
                value.fwnavigationgroup.fwnavigationitems.fwnavigationitem = a;
              }
              value.fwnavigationgroup.fwnavigationitems = value.fwnavigationgroup.fwnavigationitems.fwnavigationitem;
            });
          } else { // end - support for old generator (should be removed)
            result = result.fwnavigationgroups && result.fwnavigationgroups[0] && result.fwnavigationgroups[0].fwnavigationitems || [];
            // start draw games details
            result.map(function (res) {
              var groups, items;
              //if (res.text && res.text.replace(' ', '').toLowerCase().indexOf('drawgames') > -1) {
              groups = res.fwnavigationgroups;
              if (groups) {
                groups.map(function (group) {
                  items = group.fwnavigationitems;
                  items.map(function (item) {
                    if (group.text && group.text.replace(' ', '').toLowerCase().indexOf('main') > -1) {
                      item.nextDrawDetails = drawGamesDetailsService.getNextDrawDetails(item.target);
                      item.tileGroup = 'main';
                    }
                  });
                });
              }
              //}
            });
            // end draw games details
          }
          // use navigationService
          navigationSections = navigationService.navigationSections;
          self.mainNavigation = result;
          return result;
        });
    }
      .memoize();
    self.getMainNavigation();
  }
  ])
  .controller('HeaderController', ['$scope', '$rootScope', '$state', 'language', 'navigationService', function ($scope, $rootScope, $state, language, navigationService) {
    $scope.changeLanguage = function (newLanguage) {
      if ($state.$current.params.IDMDLanguage) {
        $state.go('.', {
          IDMDLanguage: newLanguage
        });
      } else {
        language.IDMDLanguage = newLanguage;
      }
      $scope.displayLanguageSelector = false;
      $rootScope.$broadcast('languageChanged', newLanguage);

    };

    $scope.watcher = $rootScope.$on('navigationFetched', function () {
      $scope.mainNavigation = navigationService.fetchNavigationSectionByName('TEST-MAIN-NAV');
    });

    $scope.$on('$destroy', function () {
      $scope.watcher();
    });

  }]);
