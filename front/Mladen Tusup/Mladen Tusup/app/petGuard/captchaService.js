/*global grecaptcha*/
angular.module('petGuard')
    .service('captchaService', [function () {
      this.generateReCaptcha = function (elementId) {
        var recaptchaId;
        // $timeout(function () {
        recaptchaId = grecaptcha.render(elementId, {
          'sitekey' : '6LcCxwcUAAAAALMZ3jk9CVn2JDsQL1tPxlxr1OeH'
        });
        // });
        return recaptchaId;
      };
    }])
    .directive('showRecaptcha', ['captchaService', function (captchaService) {
      return {
        template: '<div ng-show="showCaptcha" class="g-recaptcha" data-sitekey="6LcCxwcUAAAAALMZ3jk9CVn2JDsQL1tPxlxr1OeH"></div>',
        replace: true,
        link: function (scope, elem, attr) {
          scope.recaptchaId = captchaService.generateReCaptcha(attr.id);
          scope.x = 9;
        }
      };
    }]);
