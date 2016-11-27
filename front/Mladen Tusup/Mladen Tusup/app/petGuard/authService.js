angular.module('petGuard')
  .run(['authService', angular.noop])
  .service('authService', ['$rootScope', '$state', '$stateParams', 'loginService', function ($rootScope, $state, $stateParams, loginService) {
    var delayedRedirect, isVisibleAnonymously = function (state, stateParams) {
      return state.data && (typeof state.data.visibleAnonymously === 'function' ? state.data.visibleAnonymously(stateParams) : state.data.visibleAnonymously);
    };

    // note that isLoggedIn as undefined should be ignored, as that means we haven't determined the state yet
    // $rootScope.$watch('isLoggedIn', function (isLoggedIn, wasLoggedIn) {
    //
    //   if (wasLoggedIn === undefined && isLoggedIn === false && delayedRedirect) {
    //     // loginService.triggerLogin(delayedRedirect.state, delayedRedirect.params, true, true);
    //   } else if (isLoggedIn === false && !isVisibleAnonymously($state.current, $stateParams)) {
    //     $state.go('app.common.home', {location: 'replace'});
    //     // $state.go('pws.login', {redirectState: $stateParams.redirectState || $state.current.name, redirectParams: $stateParams.redirectParams || {}});
    //   }
    //
    // });

    $rootScope.$on('$stateChangeStart', function (event, to, toParams) {
      if ($rootScope.isLoggedIn === undefined) {
        delayedRedirect = isVisibleAnonymously(to, toParams) ? undefined : {state: to.name, params: toParams};
      }
      if ($rootScope.isLoggedIn === false && !isVisibleAnonymously(to, toParams)) {
        event.preventDefault();
        loginService.triggerLogin(to.name, toParams, true);
      }
      if ($rootScope.isLoggedIn && to.data && to.data.goToIfLoggedIn) {
        event.preventDefault();
        $state.go(to.data.goToIfLoggedIn);
      }
    });
  }]);
