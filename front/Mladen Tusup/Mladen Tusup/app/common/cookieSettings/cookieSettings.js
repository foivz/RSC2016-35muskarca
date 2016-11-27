angular.module('mainModule')
    .run(['cookieSettingsService', angular.noop])
    .service('cookieSettingsService', ['$rootScope', '$cookies', '$state', 'localStorageService', 'cookieSettings', function ($rootScope, $cookies, $state, localStorageService, cookieSettings) {
        var functionalCookieNames = ['SIVISITOR', 'ijCookieCookie', '_ga', '_gat', '__utma', '__utmb', '__utmc', '__utmt', '__utmv', '__utmz'],
            savedCookieSettings = localStorageService.get('cookieSettings');
        cookieSettings.isCookiePolicyAccepted = savedCookieSettings ? savedCookieSettings.isCookiePolicyAccepted : false;
        cookieSettings.areFunctionalCookiesAllowed = savedCookieSettings ? savedCookieSettings.areFunctionalCookiesAllowed : true;
        cookieSettings.areThirdPartyCookiesAllowed = savedCookieSettings ? savedCookieSettings.areThirdPartyCookiesAllowed : true;
        cookieSettings.shouldShowCookiePolicyOverlay = function () {
            return cookieSettings.isCookiePolicyAccepted === false && !$state.includes('cookieSettings') && !$state.includes('termsAndConditionsConfirmation');
        };
        $rootScope.cookieSettings = cookieSettings;
        $rootScope.$watch('cookieSettings', function () {
            localStorageService.set('cookieSettings', cookieSettings);
            if (!cookieSettings.areFunctionalCookiesAllowed) {
                functionalCookieNames.forEach(function (cookieName) {
                    $cookies.remove(cookieName, {path: '/'});
                });
            }
        }, true);
    }])
    .directive('lnbCookiePolicyOverlay', ['cookieSettings', function (cookieSettings) {
        return {
            restrict: 'E',
            controller: ['$scope', function ($scope) {
                $scope.cookiesDisabled = !window.navigator.cookieEnabled;
                $scope.accept = function () {
                    cookieSettings.isCookiePolicyAccepted = true;
                };
            }],
            templateUrl: 'pws/cookieSettings/cookiePolicyOverlay.html'
        };
    }])
    .controller('CookieSettingsCtrl', ['$scope', '$state', 'cookieSettings', function ($scope, $state, cookieSettings) {
        $scope.scroll = {};
        $scope.cookies = {
            areAllCookiesAllowed: cookieSettings.areFunctionalCookiesAllowed && cookieSettings.areThirdPartyCookiesAllowed,
            areFunctionalCookiesAllowed: cookieSettings.areFunctionalCookiesAllowed,
            areThirdPartyCookiesAllowed: cookieSettings.areThirdPartyCookiesAllowed
        };
        $scope.updateCookies = function (cookieSettingsForm) {
            cookieSettings.isCookiePolicyAccepted = true;
            cookieSettings.areFunctionalCookiesAllowed = $scope.cookies.areFunctionalCookiesAllowed;
            cookieSettings.areThirdPartyCookiesAllowed = $scope.cookies.areThirdPartyCookiesAllowed;
            cookieSettingsForm.$updatedSuccessfully = true;
            cookieSettingsForm.$setPristine();
            $scope.scroll.top = true;
        };
        $scope.cancel = function () {
            $state.go('iQuiz.common.home');
        };
    }]);

