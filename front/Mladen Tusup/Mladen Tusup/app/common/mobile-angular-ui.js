angular.module('common')
  .run(['$document', function ($document) {
    angular.element($document).on('click tap', function (e) {
      var target = angular.element(e.target), isDisabled = target.hasClass('disabled');
      if (isDisabled) {
        e.preventDefault();
        e.stopPropagation();
      }
      return !isDisabled;
    });
  }])
  .factory('ToggleHelper', ['$rootScope', function ($rootScope) {
    return {
      events: {
        toggle: 'mobile-angular-ui.toggle.toggle',
        toggleByClass: 'mobile-angular-ui.toggle.toggleByClass',
        togglerLinked: 'mobile-angular-ui.toggle.linked',
        toggleableToggled: 'mobile-angular-ui.toggle.toggled'
      },
      commands: {
        alternate: 'toggle',
        activate: 'on',
        deactivate: 'off'
      },
      toggle: function (target, command) {
        $rootScope.$emit(this.events.toggle, target, command || 'toggle');
      },
      toggleByClass: function (targetClass, command) {
        $rootScope.$emit(this.events.toggleByClass, targetClass, command || 'toggle');
      },
      notifyToggleState: function (elem, attrs, toggleState) {
        $rootScope.$emit(this.events.toggleableToggled, attrs.id, toggleState, attrs.exclusionGroup);
      },
      toggleStateChanged: function (elem, attrs, toggleState) {
        this.updateElemClasses(elem, attrs, toggleState);
        this.notifyToggleState(elem, attrs, toggleState);
      },
      applyCommand: function (command, oldState) {
        return command === this.commands.activate || command === this.commands.alternate && !oldState;
      },
      updateElemClasses: function (elem, attrs, active) {
        var parent = elem.parent();
        elem[active ? 'addClass' : 'removeClass'](attrs.activeClass);
        elem[active ? 'removeClass' : 'addClass'](attrs.inactiveClass);
        parent[active ? 'addClass' : 'removeClass'](attrs.parentActiveClass);
        parent[active ? 'removeClass' : 'addClass'](attrs.parentInactiveClass);
      }
    };
  }])
  .run(['$rootScope', 'ToggleHelper', function ($rootScope, ToggleHelper) {
    $rootScope.toggle = function (target, command) {
      ToggleHelper.toggle(target, command || 'toggle');
    };
    $rootScope.toggleByClass = function (targetClass, command) {
      ToggleHelper.toggleByClass(targetClass, command || 'toggle');
    };
  }])
  .directive('toggle', ['$rootScope', 'ToggleHelper', function ($rootScope, ToggleHelper) {
    return {
      link: function (scope, elem, attrs) {
        var command, target, targetClass, bubble;
        command = attrs.toggle || ToggleHelper.commands.alternate;
        target = attrs.target;
        targetClass = attrs.targetClass;
        bubble = attrs.bubble === 'true' || attrs.bubble === '1' || attrs.bubble === 1 || attrs.bubble === '' || attrs.bubble === 'bubble';
        if (!target && attrs.href) {
          target = attrs.href.slice(1);
        }
        if (!(target || targetClass)) {
          throw '"target" or "target-class" attribute required with "toggle"';
        }
        elem.on('click tap', function (e) {
          var angularElem = angular.element(e.target);
          if (!angularElem.hasClass('disabled')) {
            if (target) {
              ToggleHelper.toggle(target, command);
            }
            if (targetClass) {
              ToggleHelper.toggleByClass(targetClass, command);
            }
            if (!bubble) {
              e.preventDefault();
            }
            return bubble;
          }
        });
        scope.$on('$destroy', $rootScope.$on(ToggleHelper.events.toggleableToggled, function (e, id, newState) {
          if (id === target) {
            ToggleHelper.updateElemClasses(elem, attrs, newState);
          }
        }));
        if (target) {
          $rootScope.$emit(ToggleHelper.events.togglerLinked, target);
        }
      }
    };
  }])
  .directive('toggleable', ['$rootScope', 'ToggleHelper', function ($rootScope, ToggleHelper) {
    return {
      link: function (scope, elem, attrs) {
        var toggleState = attrs.default === 'active';
        if (attrs.default) {
          ToggleHelper.toggleStateChanged(elem, attrs, toggleState);
        }
        scope.$on('$destroy', $rootScope.$on(ToggleHelper.events.toggle, function (e, target, command) {
          var oldState;
          if (target === attrs.id) {
            oldState = toggleState;
            toggleState = ToggleHelper.applyCommand(command, oldState);
            if (oldState !== toggleState) {
              ToggleHelper.toggleStateChanged(elem, attrs, toggleState);
            }
          }
        }));
        scope.$on('$destroy', $rootScope.$on(ToggleHelper.events.toggleByClass, function (e, targetClass, command) {
          var oldState;
          if (elem.hasClass(targetClass)) {
            oldState = toggleState;
            toggleState = ToggleHelper.applyCommand(command, oldState);
            if (oldState !== toggleState) {
              ToggleHelper.toggleStateChanged(elem, attrs, toggleState);
            }
          }
        }));
        scope.$on('$destroy', $rootScope.$on(ToggleHelper.events.toggleableToggled, function (e, target, newState, sameGroup) {
          if (newState && attrs.id !== target && attrs.exclusionGroup === sameGroup && attrs.exclusionGroup) {
            ToggleHelper.toggleStateChanged(elem, attrs, toggleState = false);
          }
        }));
        scope.$on('$destroy', $rootScope.$on(ToggleHelper.events.togglerLinked, function (e, target) {
          if (attrs.id === target) {
            ToggleHelper.notifyToggleState(elem, attrs, toggleState);
          }
        }));
      }
    };
  }]);
