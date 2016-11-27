angular.module('common')
.directive('lnbAccordion', function () {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      scope: {
        oneAtATime: '@',
        closeIconClass: '@',
        openIconClass: '@'
        //iconPosition: '@'
      },
      controller: 'accordionController',
      template: '<div class="accordion" ng-transclude></div>'
    };
  });
