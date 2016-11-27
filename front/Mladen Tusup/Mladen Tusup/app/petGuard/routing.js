angular.module('mainModule')
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('app.pws', {
        url: '/playerAccount',
        redirectTo: 'app.pws.walletSummary',
        views: {
          'main@app': {
            templateUrl: 'pws/playerAccount/playerAccount.html'
          },
          'menu@app.pws': {
            templateUrl: 'pws/playerAccount/accountMenuTemplate.html'
          }
        },
        data: {
          visibleAnonymously: false
        }
      })
    /******** Player Account child states ********/
      .state('app.pws.walletSummary', {
        url: '/walletSummary',
        views: {
          'detail': {
            templateUrl: 'pws/playerAccount/walletSummary/walletSummary.html',
            controller: 'WalletSummaryCtrl'
          }
        }
      })
      .state('app.pws.transactionHistory', {
        url: '/transactionHistory',
        views: {
          'detail': {
            templateUrl: 'pws/playerAccount/transactionHistory/transactionHistory.html',
            controller: 'TransactionHistoryController'
          }
        }
      })
      .state('app.pws.playHistory', {
        url: '/playHistory',
        views: {
          'detail': {
            templateUrl: 'pws/playerAccount/myGames/playHistory/playHistory.html'
          }
        },
        redirectTo: 'app.pws.playHistory.openGames'
      })
      .state('app.pws.subscriptions', {
        url: '/subscriptions',
        views: {
          'detail': {
            templateUrl: 'pws/playerAccount/subscriptions/subscriptions.html',
            controller: 'SubscriptionsCtrl'
          }
        }
      })
      .state('app.pws.favourites', {
        url: '/favourites',
        views: {
          'detail': {
            templateUrl: 'pws/playerAccount/myGames/favourites/favourites.html',
            controller: 'FavouritesCtrl'
          }
        }
      })
      .state('app.pws.playLimits', {
        url: '/playLimits',
        views: {
          'detail': {
            templateUrl: 'pws/playerAccount/playLimits/myPlayLimits.html',
            controller: 'PlayLimitsCtrl'
          }
        }
      })
      .state('app.pws.messages', {
        url: '/messages/:type',
        views: {
          'detail': {
            templateUrl: 'pws/playerAccount/messages/messages.html',
            controller: 'messagesCtrl'
          }
        },
        params: {
          type: 'unread'
        },
        resolve: {
          previousState: [
            '$state', function ($state) {
              var currentState = $state.current.name;
              return currentState;
            }
          ]
        }
      })
      .state('app.pws.myProfile', {
        url: '/myProfile',
        redirectTo: 'app.pws.myProfile.personalDetails',
        views: {
          'main@app': {
            templateUrl: 'pws/playerAccount/playerAccount.html'
          },
          'menu@app.pws.myProfile': {
            templateUrl: 'pws/playerAccount/accountMenuTemplate.html'
          }
        }
      })
      .state('app.pws.myProfile.closeAccount', {
        url: '/closeAccount',
        views: {
          'detail': {
            templateUrl: 'pws/playerAccount/closeAccount/closeAccount.html',
            controller: 'CloseAccountCtrl'
          }
        },
        resolve: {
          isAccountClosable: ['closeAccountService', function (closeAccountService) {
            return closeAccountService.IsAccountClosable();
          }]
        }
      })
    /******** END Play History tabs states END ********/
    /******** Personal details states ********/
      .state('app.pws.myProfile.personalDetails', {
        url: '/personalDetails',
        views: {
          'detail': {
            templateUrl: 'pws/playerAccount/personalDetails/personalDetails.html',
            controller: 'PersonalDetailsCtrl'
          }
        },
        resolve: {
          personalDetails: [
            'userService',
            function (userService) {
              return userService.getPersonalDetailsIfLoggedIn.force();
            }
          ],
          postcodes: [
            'personalDetailsService',
            function (personalDetailsService) {
              return personalDetailsService.fetchLocations();
            }
          ],
          personalDetailsInfoToasterDisplayed: [
            'localStorageService',
            function (localStorageService) {
              return localStorageService.get('personalDetailsInfoToasterDisplayed') === 'true';
            }
          ]
        }
      })
    /******** END Personal details states END ********/
    /******** withdraw states ********/
      .state('app.pws.withdraw', {
        url: '/withdraw',
        views: {
          'detail': {
            templateUrl: 'pws/playerAccount/withdraw/withdraw.html',
            controller: 'WithDrawController'
          }
        },
        resolve: {
          accountDetails: ['withdrawService', function (withdrawService) {
            return withdrawService.getAccountsDetails();
          }
          ],
          bankAccountDetails: ['withdrawService', function (withdrawService) {
            return withdrawService.getBankAccountDetails();
          }
          ]
        }
      })
  }
  ]);
