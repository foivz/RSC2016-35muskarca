angular.module('core')
  .constant('rpcTimeoutInSeconds', 30)
  .service('rpcService', ['$rootScope', '$q', '$http', '$timeout', 'language', 'rpcTimeoutInSeconds', function ($rootScope, $q, $http, $timeout, language, rpcTimeoutInSeconds) {
    var requestsQueue = [];
    this.invoke = function (serviceName, methodName, parameters, options) {
      var possibleExceptions = options && options.possibleExceptions || {},
        pload = JSON.stringify({serviceName: serviceName, methodName: methodName, arguments: parameters}),
        matchingRequest = requestsQueue.filter(function (request) {
          return request.payload === pload;
        })[0],
        deferred;
      parameters.IDMDLanguage = (language.IDMDLanguage === 'EN' ? 'UK' : language.IDMDLanguage) || 'UK';
      if (!requestsQueue.length) {
        $timeout(function () {
          var requests = requestsQueue,
            payload = requests.map(function (request) {
              return {serviceName: request.serviceName, methodName: request.methodName, arguments: request.arguments};
            });
          requestsQueue = [];
          $http.post('/CallBroker.ashx', payload, {
            transformResponse: function (data) {
              return data && JSON.parse(data.replace(/\\>/g, '>').replace(/\\'/g, '\''));
            },
            timeout: 1000 * rpcTimeoutInSeconds
          })
            .then(
            function (rpcResult) {
              rpcResult.data.forEach(function (response, index) {
                var request = requests[index];
                if (response) {
                  if (response.exceptionType) {
                    if (response.exceptionType === 'Com.Finsoft.Warp.Connecticut.SessionTimeoutException') {
                      $rootScope.isLoggedIn = false;
                      return request.deferred.reject('sessionTimeout');
                    }
                    if (options && options.noErrorMatching) {
                      return request.deferred.reject(response);
                    }
                    if (possibleExceptions[response.exceptionType]) {
                      return request.deferred.reject(possibleExceptions[response.exceptionType]);
                    }
                    if (response.exceptionType !== 'Com.Finsoft.Warp.Connecticut.SessionTimeoutException') {
                      $rootScope.$emit('trackException', new Error('RpcService exception'), {
                        request: request,
                        response: response
                      });
                    }
                    return request.deferred.reject('unexpectedError');
                  }
                  return request.deferred.resolve(response.result);
                }
                return request.deferred.reject('unexpectedError');
              });
            },
            function (reason) {
              requests.forEach(function (request) {
                $rootScope.$emit('trackException', new Error('RpcService communication problem'), {
                  request: request,
                  reason: reason
                });
                return request.deferred.reject('communicationProblem', reason);
              });
            }
          );
        }, 0);
      }
      if (matchingRequest) {
        deferred = matchingRequest.deferred;
      } else {
        deferred = $q.defer();
        requestsQueue.push({
          serviceName: serviceName,
          methodName: methodName,
          arguments: parameters,
          options: options,
          payload: pload,
          deferred: deferred
        });
      }
      return deferred.promise;
    };
  }]);
