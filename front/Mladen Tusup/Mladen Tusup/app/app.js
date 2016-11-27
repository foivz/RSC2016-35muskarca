(function () {
  var 
    assetsTranslationPath = {
      EN: 'assets/translations/EN/translation.json',
      SRB: 'assets/translations/SRB/translation.json'
    }
  angular.module('iQuiz', ['mainModule'])
    .constant('translationPath', assetsTranslationPath)
    .constant('RESTAPI', 'http://192.168.88.220:8084/iquiz/rest')
    .constant('availableLanguages', ('EN,SRB').split(','))
    .constant('defaultLanguage', 'SRB')
    .factory('_', ['$window', function ($window) {
      // Get a local handle on the global lodash reference.
      var _ = $window._;
      // OPTIONAL: Sometimes I like to delete the global reference to make sure
      // that no one on the team gets lazy and tried to reference the library
      // without injecting it. It's an easy mistake to make, and one that won't
      // throw an error (since the core library is globally accessible).
      delete($window._);
      return (_);
    }])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $urlRouterProvider.when('/', ['$state', '$cookies', 'preferredLanguageCookieName', 'availableLanguages', function ($state, $cookies, preferredLanguageCookieName, availableLanguages) {
        var fromCookie;
        fromCookie = $cookies.get(preferredLanguageCookieName);
        fromCookie = fromCookie && fromCookie.toUpperCase();

        if (availableLanguages.indexOf(fromCookie) === -1) {
          fromCookie = undefined;
        }
        if (fromCookie) {
          $state.go('iQuiz.common.home', {IDMDLanguage: 'SRB'});
        } else {
          $state.go('languageSelection');
        }
      }]);
      $stateProvider
        .state('iQuiz', {
          url: '/:IDMDLanguage',
          resolve: {
            translations: ['languageService', '$stateParams', function (languageService, $stateParams) {
              return languageService.use($stateParams.IDMDLanguage);
            }]
          },
          redirectTo: 'iQuiz.common.home',
          views: {
            '@': {
              templateUrl: 'common/layout/layout.html'
            },
            'header@iQuiz': {
              templateUrl: 'common/layout/header/header.html'
            },
            'footer@iQuiz': {
              templateUrl: 'common/layout/footer/footer.html'
            }
          },
          data: {
            stateName: 'iQuiz'
          }
        });
    }])
    .run(['$rootScope', '$state', '$cookies', '$location', 'preferredLanguageCookieName', 'availableLanguages', 'language', function ($rootScope, $state, $cookies, $location, preferredLanguageCookieName, availableLanguages, language) {
        
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var paramLanguage;
        if (toState.name === 'languageSelection') {
          return;
        }
        
        if (toState.name === 'iQuiz.common.login' || toState.name === 'iQuiz.common.register') {
            if ($cookies.get('globals')) {
                event.preventDefault();
            } 
        }
          if ($cookies.get('globals')) {
              $rootScope.isLoggedIn = true;
          }
        if (toState.name === 'iQuiz.common.home' && $state.current.name === 'iQuiz.common.login') {
            if ($cookies.get('globals')) {
                $rootScope.isLoggedIn = true;
                event.preventDefault();
                $state.go('iQuiz.common.userAccount', toParams);
            } 
        }
        
        paramLanguage = toParams.IDMDLanguage;
        if (language.IDMDLanguage !== paramLanguage) {
          $cookies.put(preferredLanguageCookieName, paramLanguage);
          language.IDMDLanguage = paramLanguage;
        }
      });
        
    

      $rootScope.$on('$stateChangeSuccess', function () {
        $rootScope.bodyClass = $location
          .path()
          .split('/')
          . filter(function (item) {
            return Boolean(item);
          })
          .map(function (item) {
            return 'url-' + item;
          })
          .join(' ');
      });
    }]);
}());
