angular.module('core')
  .constant('sessionAppSignature', navigator.userAgent)
  .service('userService', ['$rootScope', '$q', 'localStorageService', 'rpcService', 'sessionAppSignature', function ($rootScope, $q, localStorageService, rpcService, sessionAppSignature) {
    var self = this;
    this.invoke = rpcService.invoke.bind(rpcService, 'UserService');
    this.invokeLNB = rpcService.invoke.bind(rpcService, 'LNBUserService');
    this.fetchIsSuspended = function () {
      return self.invoke('IsAccountSuspended', { OperationType: 'T' })
        .then(function (isSuspended) {
          return (self.isSuspended = isSuspended);
        });
    }.memoize();
    this.getRememberMeUsername = function () {
      return localStorageService.get('rememberMeUsername');
    };
    this.login = function (username, password, captcha, shouldRememberMe) {
      return self.invokeLNB(
        'LoginWithSessionAppSignatureAndCaptcha',
        {
          username: username,
          password: password,
          sessionAppSignature: sessionAppSignature,
          captcha: captcha || null
        },
        {
          noErrorMatching: true
        }
      ).then(
        function (personalDetails) {
          localStorageService[shouldRememberMe ? 'set' : 'remove']('rememberMeUsername', username);
          localStorageService.set('sessionId', personalDetails.UserName + ':' + Date.now());
          self.personalDetails = personalDetails;
          self.getPersonalDetailsIfLoggedIn.updateInCache($q.when(personalDetails));
          $rootScope.isLoggedIn = true;
          $rootScope.$emit('userLoggedIn');
          return false;
        },
        function (reason) {
          return reason.exceptionType === 'Com.Finsoft.Warp.Connecticut.Services.InvalidCaptchaException' || $q.reject({
              'Com.Finsoft.Warp.Texas.MMCore.Customer.LoginFailedException': 'invalidUsernameOrPassword',
              'Com.Finsoft.Warp.Texas.WCF.DTO.WCFUnknownException': 'invalidUsernameOrPassword',
              'Com.Finsoft.Warp.Connecticut.Services.InvalidCaptchaException': 'invalidCaptcha'
            }[reason.exceptionType] || 'unexpectedError');
        }
      );
    };
    this.logout = function () {
      return self.invoke('Logout', {}).then(function () {
        $rootScope.isLoggedIn = false;
      });
    };
    this.getPersonalDetailsIfLoggedIn = function () {
      return self.invoke('GetPersonalDetailsIfLoggedIn', {})
        .then(function (details) {
          self.personalDetails = details;
          $rootScope.isLoggedIn = !!details;
          return details;
        }, function () {
          delete self.personalDetails;
          $rootScope.isLoggedIn = false;
        });
    }.memoize();
    $rootScope.$watch('isLoggedIn', function (isLoggedIn) {
      if (isLoggedIn) {
        self.sessionId = localStorageService.get('sessionId');
        self.getPersonalDetailsIfLoggedIn();
        self.fetchIsSuspended();
      } else if (isLoggedIn === false) {
        delete self.personalDetails;
        delete self.isSuspended;
        delete self.sessionId;
        localStorageService.remove('sessionId');
        self.getPersonalDetailsIfLoggedIn.clearCache();
        self.fetchIsSuspended.clearCache();
      }
    });
    this.getPersonalDetailsIfLoggedIn();
  }]);
