angular.module('petGuard')
  .run(['$rootScope', 'accountService', function ($rootScope, accountService) {
    $rootScope.accountService = accountService;
  }])
  .factory('accountNavigation', ['createI18Resource', function (createI18Resource) {
    return createI18Resource('/cache/fwNavigation/1/:IDMDLanguage/TEST-ACC-NAV.json', false);
  }])
  // .factory('accountDetailInformation', ['createI18Resource', function (createI18Resource) {
  //   return createI18Resource('/cache/fwNavigation/1/:IDMDLanguage/TEST-ACC-NAV.json', false);
  // }])
  .service('accountService', ['$rootScope', 'rpcService', 'playLimitsService', 'accountNavigation', function ($rootScope, rpcService, playLimitsService, accountNavigation) {
    var self = this, referenceNumberModulo = Math.pow(10, 10);
    this.getAccountNavigation = function () {
      return accountNavigation()
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
          }
          self.accountNavigation = result;
          return result;
        });
    }.memoize();
    self.invoke = rpcService.invoke.bind(rpcService, 'AccountService');
    this.getAccountsDetails = function () {
      playLimitsService.getAccountLimits.force()
        .then(function () {
          self.maxTradeAmount = playLimitsService.accountLimitsByidmmlmtype.TRADING.remainingAmount;
        });
      return self.invoke('GetAccountsDetails', {})
        .then(function (result) {
          self.accounts = result.reduce(function (result, account) {
            result[account.IDMMAccountClass] = account;
            account.ReferenceNumber = (referenceNumberModulo + account.AccountNumber % referenceNumberModulo).toString().substr(1) + (100 + account.AccountNumber % 97 || 97).toString().substr(1);
            return result;
          }, {});
          return result;
        });
    }.memoize();
    $rootScope.$watch('isLoggedIn', function (isLoggedIn) {
      if (isLoggedIn) {
        self.getAccountsDetails();
        self.getAccountNavigation();
      } else {
        delete self.accounts;
        delete self.maxTradeAmount;
        delete self.accountNavigation;
        self.getAccountsDetails.clearCache();
        self.getAccountNavigation.clearCache();
      }
    });
    $rootScope.$watch('language.IDMDLanguage', function (isLoggedIn) {
      if (isLoggedIn) {
        self.getAccountNavigation.clearCache();
        self.getAccountNavigation();
      }
    });
    $rootScope.$on('paymentTransactionCompleted', function (e, event) {
      if (event.adjustAccountLimits) {
        self.getAccountsDetails.force();
      }
    });
  }])
  .component('accountNavigationComponent', {
    bindings: {
      theme: '@'
    },
    templateUrl: 'pws/playerAccount/accountMenu.html',
    controller: ['accountService', '$state', function (accountService, $state) {
      this.stateName = $state.current.name;
      this.checkState = function () {
        if (this.stateName.indexOf('app.pws.myProfile') !== -1) {
          this.showSubMenu = true;
        } else {
          this.showSubMenu = false;
        }
      };
      this.checkState();
      this.accountService = accountService;
      this.showHideSubMenu = function () {
        this.showSubMenu = !this.showSubMenu;
      };
    }]
  });
  // .service('accountInformationService', ['$rootScope', 'rpcService', 'playLimitsService', function ($rootScope, rpcService, playLimitsService) {
  //   var self = this, referenceNumberModulo = Math.pow(10, 10);
  //   self.invoke = rpcService.invoke.bind(rpcService, 'AccountService');
  //   this.getAccountsDetails = function () {
  //     playLimitsService.getAccountLimits.force()
  //       .then(function () {
  //         self.maxTradeAmount = playLimitsService.accountLimitsByidmmlmtype.TRADING.remainingAmount;
  //       });
  //     return self.invoke('GetAccountsDetails', {})
  //       .then(function (result) {
  //         self.accounts = result.reduce(function (result, account) {
  //           result[account.IDMMAccountClass] = account;
  //           account.ReferenceNumber = (referenceNumberModulo + account.AccountNumber % referenceNumberModulo).toString().substr(1) + (100 + account.AccountNumber % 97 || 97).toString().substr(1);
  //           return result;
  //         }, {});
  //         return result;
  //       });
  //   }.memoize();
  //   $rootScope.$watch('isLoggedIn', function (isLoggedIn) {
  //     if (isLoggedIn) {
  //       self.getAccountsDetails();
  //     } else {
  //       delete self.accounts;
  //       delete self.maxTradeAmount;
  //       self.getAccountsDetails.clearCache();
  //     }
  //   });
  //   $rootScope.$on('paymentTransactionCompleted', function (e, event) {
  //     if (event.adjustAccountLimits) {
  //       self.getAccountsDetails.force();
  //     }
  //   });
  // }])
  // .controller('accountCtrl', ['$scope', 'accountService', function ($scope, accountService) {
  //   $scope.accountService = accountService;
  // }]);
