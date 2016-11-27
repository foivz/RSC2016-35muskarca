angular.module('common', ['LocalStorageModule', 'ngAnimate', 'ngAria', 'ngSanitize', 'ngMaterial', 'pascalprecht.translate', 'ui.router', 'uiGmapgoogle-maps']);

angular.module('common')
.config(function (uiGmapGoogleMapApiProvider) {
 uiGmapGoogleMapApiProvider.configure({
  key: 'AIzaSyBNKKuEwYODFV7Qz0_-HNGCLDNZ2DwjRY0',
  v: '3.17',
  libraries: 'weather,geometry,visualization'
 });
})
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('languageSelection', {
        url: '/languageSelection',
        views: {
          '@': {
            templateUrl: 'common/languageSelection/languageSelection.html',
            controller: 'LanguageSelectionController as languageSelection'
          }
        },
        data: {
          stateName: 'iQuiz.login'
        }
      })
      .state('iQuiz.common', {
        abstract: true,
        redirectTo: 'iQuiz.common.home',
        data: {
          stateName: 'iQuiz.common'
        }
      })
      .state('iQuiz.common.home', {
        url: '/home',
        views: {
          'main@iQuiz': {
            templateUrl: 'common/home/home.html',
            controller: 'homeController'
          }
        },
        data: {
          visibleAnonymously: true,
          stateName: 'iQuiz.common.home'
        }
      })
      .state('iQuiz.common.aboutUs', {
        url: '/aboutUs',
        views: {
          'main@iQuiz': {
            templateUrl: 'common/aboutUs/aboutUs.html'
          }
        },
        data: {
          visibleAnonymously: true,
          stateName: 'iQuiz.common.aboutUs'
        }
      })
      .state('iQuiz.common.contactUs', {
        url: '/contactUs',
        views: {
          'main@iQuiz': {
            templateUrl: 'common/contactUs/contactUs.html',
            controller: 'contactUsController'
          }
        },
        data: {
          visibleAnonymously: true,
          stateName: 'iQuiz.common.contactUs'
        }
      })
    .state('iQuiz.common.addQuestions', {
        url: '/questions',
        resolve: {
            questions:  function($http, RESTAPI){
            //$http returns a promise for the url data
            return $http({method: 'GET', url: RESTAPI+'/quiz/admin'});
                return null;
            }
         },
        views: {
          'main@iQuiz': {
            templateUrl: 'common/questions/questions.html',
            controller: 'userAccountController'
          }
        },
        data: {
          visibleAnonymously: true,
          stateName: 'iQuiz.common.addQuestions'
        }
      })
      .state('iQuiz.common.news', {
        url: '/news',
        views: {
          'main@iQuiz': {
            templateUrl: 'common/news/news.html'
          }
        },
        data: {
          visibleAnonymously: true,
          stateName: 'iQuiz.common.news'
        }
      })
      .state('iQuiz.common.portfolio', {
        url: '/portfolio',
        views: {
          'main@iQuiz': {
            templateUrl: 'common/portfolio/portfolio.html'
          }
        },
        data: {
          visibleAnonymously: true,
          stateName: 'iQuiz.common.portfolio'
        }
      })
    .state('iQuiz.common.userAccount', {
        url: '/userAccount',
        resolve: {
            questions:  function($http, RESTAPI){
            //$http returns a promise for the url data
            return $http({method: 'GET', url: RESTAPI+'/questions'});
            //    return null;
         }
            ,
            quizzes:  function($http, RESTAPI){
                 return $http({method: 'GET', url: RESTAPI+'/quiz/admin'});
            }
        },
        views: {
          'main@iQuiz': {
            templateUrl: 'common/userAccount/userAccount.html',
              controller: 'userAccountController'
          }
        },
        data: {
          visibleAnonymously: false,
          stateName: 'iQuiz.common.userAccount'
        }
      })
    .state('iQuiz.common.activeQuizzes', {
        url: '/quizzes',
        resolve: {
//            questions:  function($http, RESTAPI){
//            //$http returns a promise for the url data
//            return $http({method: 'GET', url: RESTAPI+'/questions'});
//            //    return null;
//         }
//            ,
            activeQuizzes:  function($http, RESTAPI){
                 return $http({method: 'GET', url: RESTAPI+'/quiz/active'});
            }
        },
        views: {
          'main@iQuiz': {
            templateUrl: 'common/quizzes/quizzes.html',
              controller: 'quizzes'
          }
        },
        data: {
          visibleAnonymously: false,
          stateName: 'iQuiz.common.quizzes'
        }
      })
    .state('iQuiz.common.login', {
        url: '/login',
        views: {
          'main@iQuiz': {
            templateUrl: 'common/login/login.html',
              controller: 'LoginController',
              controllerAs: 'vm'
          }
            }
    })
    .state('iQuiz.common.register', {
        url: '/register',
        views: {
          'main@iQuiz': {
            templateUrl: 'common/register/register.html',
              controller: 'RegisterController',
              controllerAs: 'vm'
          }
            }
    })
//    .state('Modal', {
//        abstract: true,
//        views:{
//          'modal': {
//            template: '<div class="Modal-backdrop"></div>'+
//'<div class="Modal-holder" ui-view="modal" autoscroll="false"></div>'
//          }
//        }
//    })
//    .state('Modal.loginModal', {
//        views:{
//          'modal': {
//            templateUrl: 'common/login/login.html',
//            controller: 'LoginController as vm',
//            controllerAs: 'vm'
//          }
//        }
//    })
//    .state('Modal.registerModal', {
//        views:{
//          'modal': {
//            templateUrl: 'common/register/register.html',
//            controller: 'RegisterController',
//            controllerAs: 'vm'
//          }
//        }
//    })
//      .state('iQuiz.common.login', {
//        url: '/login',
//        views: {
//          'main@app': {
//            templateUrl: 'common/login/loginLayout.html',
//            controller: 'LoginCtrl'
//          },
//          'login@app.common.login': {
//            templateUrl: 'common/login/login.html'
//          },
//          'register@app.common.login': {
//            templateUrl: 'common/login/register.html'
//          }
//        },
//        data: {
//          visibleAnonymously: true,
//          stateName: 'iQuiz.common.login'
//        }
//      })
//      .state('iQuiz.common.logout', {
//        url: '/logout',
//        data: {
//          stateName: 'iQuiz.common.logout'
//        }
//      });
  }]);
