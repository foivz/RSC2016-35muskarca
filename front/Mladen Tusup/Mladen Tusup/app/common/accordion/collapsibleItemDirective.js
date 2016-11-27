angular.module('common')
  .directive('collapsibleItem', function () {
    return {
      require: '^lnbAccordion',
      restrict: 'EA',
      transclude: true,
      replace: true,
      scope: {
        itemTitle: '@',
        itemDisabled: '=',
        initiallyOpen: '=',
        itemClass: '@',
        rightItemClass: '@',
        hasRightItem: '=',
        rightItemContent: '@'
      },
      link: function (scope, element, attrs, accordionController) {
        scope.rightElement = (scope.hasRightItem) ? true : false;
        scope.isOpenned = (scope.initiallyOpen) ? true : false;
        accordionController.addCollapsibleItem(scope);
        if (scope.isOpenned) {
          scope.icon = scope.openIcon;
        } else {
          scope.icon = scope.closeIcon;
        }
        scope.toggleCollapsibleItem = function () {
          if (scope.itemDisabled) {
            return;
          }
          if (!scope.isOpenned) {
            accordionController.openCollapsibleItem(this);
            scope.icon = scope.openIcon;
          } else {
            scope.isOpenned = false;
            scope.icon = scope.closeIcon;
          }
        };
      },
      template: '<div><dt class="pointer" ng-click="toggleCollapsibleItem()" ng-class="{open: isOpenned}"><i ng-show="iconsType == \'class\'" class="{{icon}}"/><div class="{{itemClass}}"><h3>{{itemTitle}}</h3></div><div ng-show="rightElement" class="{{rightItemClass}}">{{rightItemContent}}</div></dt><dd><div class="content" ng-transclude></div></dd></div>'
    };
  });
