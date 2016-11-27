angular.module('core')
    .run(['languageService', angular.noop])
    .constant('preferredLanguageCookieName', 'PreferedLanguage')
    .value('language', {
        IDMDLanguage: undefined,
        availableLanguages: [
            {IDMDLanguage: 'EN', text: 'English'},
            {IDMDLanguage: 'SRB', text: 'Serbian'}
        ]
    })
    .factory('translationsLoader', ['$http', '$q', 'translationPath', function ($http, $q, translationPath) {
        var translations = {};
        return function (options) {
            var deferred = $q.defer();
            if (translations[options.key] === undefined) {
                $http({
                    method: 'GET',
                    url: translationPath[options.key]
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function () {
                    deferred.reject(options.key);
                });
            } else {
                deferred.resolve(translations[options.key]);
            }
            return deferred.promise;
        };
    }])
    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider.useSanitizeValueStrategy('escapeParameters');
        $translateProvider.useLoader('translationsLoader', {});
    }])
    .run(['$rootScope', '$translationCache', '$translate', 'language', 'availableLanguages', function ($rootScope, $translationCache, $translate, language, availableLanguages) {
        language.availableLanguages = language.availableLanguages.filter(function (language) {
            return availableLanguages.indexOf(language.IDMDLanguage) !== -1;
        });
    }])
    .service('languageService', ['$rootScope', '$translate', '$cookies', 'localStorageService', 'availableLanguages', 'language', 'preferredLanguageCookieName', function ($rootScope, $translate, $cookies, localStorageService, availableLanguages, language, preferredLanguageCookieName) {
        var fromCookie, translateUse;
        this.use = function (IDMDLanguage) {

            translateUse = Promise.resolve($translate.use(IDMDLanguage));

            return translateUse.then(function () {
                language.IDMDLanguage = IDMDLanguage;
                localStorageService.set(preferredLanguageCookieName, IDMDLanguage);
                $cookies.put(preferredLanguageCookieName, IDMDLanguage, {path: '/'});
            });

        };
        fromCookie = $cookies.get(preferredLanguageCookieName);
        fromCookie = fromCookie && fromCookie.toUpperCase();
        if (availableLanguages.indexOf(fromCookie) === -1) {
            fromCookie = undefined;
        }
        $rootScope.language = language;
        language.IDMDLanguage = localStorageService.get(preferredLanguageCookieName) || fromCookie;

    }])
    .directive('lnbLanguageSelectorOverlay', function () {
        return {
            templateUrl: 'core/i18n/languageSelectorOverlay.html'
        };
    })
    .directive('lnbLanguageSelector', function () {
        return {
            restrict: 'E',
            templateUrl: 'core/i18n/languageSelector.html'
        };
    })
    .filter('translateError', ['$parse', '$translate', function ($parse, $translate) {
        return function (translationId, interpolateParams, interpolation) {
            if (!angular.isObject(interpolateParams)) {
                interpolateParams = $parse(interpolateParams)(this);
            }
            return $translate.instant(translationId, interpolateParams, interpolation) || $translate.instant('mmcore.playLimits.unhandledError');
        };
    }])
    .filter('translateInclude', ['$parse', '$translate', function ($parse, $translate) {
        var translateFilter = function (translationId, interpolateParams, interpolation) {
            var result;
            if (!angular.isObject(interpolateParams)) {
                interpolateParams = $parse(interpolateParams)(this);
            }
            result = $translate.instant(translationId, interpolateParams, interpolation);
            return result === translationId ? '' : result;
        };
        translateFilter.$stateful = true;
        return translateFilter;
    }]);