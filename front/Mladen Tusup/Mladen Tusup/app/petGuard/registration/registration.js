angular.module('petGuard')
  .config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.
      state('registration', {
        url: '/registration?id&emailkey',
        templateUrl: 'pws/registration/registrationForm.html',
        controller: 'RegistrationCtrl',
        data: {
          headerName: 'pws',
          visibleAnonymously: true,
          goToIfLoggedIn: 'home'
        },
        resolve: {
          postcodes: [
            function () {
              return {};
            }],
          registrationInfoToasterDisplayed: ['localStorageService',
            function (localStorageService) {
              var displayed = localStorageService.get('registrationInfoToasterDisplayed') === 'true' ? true : false;
              return displayed;
            }],
          userAgent: ['userAgent',
            function (userAgent) {
              return userAgent;
            }],
          hash: ['$stateParams', function ($stateParams) {
            return $stateParams;
          }]
        }
      })
      .state('registrationForm', {
        url: '/registration/form/step:step?id&emailkey',
        templateUrl: 'pws/registration/registrationForm.html',
        controller: 'RegistrationCtrl',
        data: {
          headerName: 'pws',
          visibleAnonymously: true,
          goToIfLoggedIn: 'home'
        },
        resolve: {
          postcodes: ['postCodesService', '$stateParams',
            function (postCodesService, $stateParams) {
              return $stateParams.step === '1' ? postCodesService.get('BE') : {};
            }],
          registrationInfoToasterDisplayed: ['localStorageService',
            function (localStorageService) {
              var displayed = localStorageService.get('registrationInfoToasterDisplayed') === 'true' ? true : false;
              return displayed;
            }],
          userAgent: ['userAgent',
            function (userAgent) {
              return userAgent;
            }],
          hash: ['$stateParams', function ($stateParams) {
            return $stateParams;
          }]
        }
      })
      .state('registrationComplete1', {
        url: '/registrationComplete1',
        templateUrl: 'pws/registration/registrationComplete.html',
        data: {
          headerName: 'pws',
          visibleAnonymously: true
        }
      })
      .state('registrationSuccess', {
        url: '/registration/success',
        templateUrl: 'pws/registration/registrationSuccess.html',
        controller: 'RegistrationSuccessCtrl',
        data: {
          headerName: 'pws',
          visibleAnonymously: true
        }
      })
      .state('registrationFailed', {
        url: '/registration/failed',
        templateUrl: 'pws/registration/registrationFailed.html',
        controller: 'RegistrationFailedCtrl',
        data: {
          headerName: 'pws',
          visibleAnonymously: true
        },
        resolve: {
          errorData: ['registrationError', function (registrationError) {
            return registrationError.getError();
          }]
        }
      })
      .state('registrationFailed:reason', {
        url: '/registration/failed/:reason',
        templateUrl: 'pws/registration/registrationFailed.html',
        controller: 'RegistrationFailedCtrl',
        data: {
          headerName: 'pws',
          visibleAnonymously: true
        },
        resolve: {
          errorData: ['$stateParams', function ($stateParams) {
            return $stateParams;
          }]
        }
      });
  }])
  .directive('regBackButton',
  ['$window', '$state', function ($window, $state) {
    return {
      restrict: 'A',
      scope: {
        step: '=',
        action: '&'
      },
      link: function (scope, elem) {
        elem.bind('click', function () {
          if (scope.step === 0) {
            $state.go('home');
          } else {
            scope.action();
          }
        });
      }
    };
  }])
  // .directive('lnbUiMask',
  // ['$timeout', 'userAgent', 'inputCursorTools',
  //   function ($timeout, userAgent, inputCursorTools) {
  //     return {
  //       require: '?ngModel',
  //       scope: {
  //         lnbUiMask: '@'
  //       },
  //       link: function (scope, elem, attrs, ctrl) {
  //         var mask, trim, setCursorPos, getCursorPos, charPos;
  //         if (!ctrl) {
  //           return;
  //         }
  //         if (userAgent.isIOS) {
  //           scope.iOSver = userAgent.userAgent.split('Version/')[1] && parseFloat(userAgent.userAgent.split('Version/')[1].split(' ')[0]);
  //         }
  //         scope.isIOS6 = userAgent.isIOS && scope.iOSver < 7;
  //         ctrl.$formatters = [];
  //         ctrl.$parsers = [];
  //         scope.firstEvent = false;
  //         trim = function (str) {
  //           var c;
  //           str = str.split('');
  //           c = str.pop();
  //           while (c === '-') {
  //             c = str.pop();
  //           }
  //           str.push(c);
  //           return str.join('');
  //         };
  //         mask = function (viewValue) {
  //           var n, p, f, i, j, k, formatted;
  //           n = viewValue;
  //           p = scope.pattern.split(scope.separator);
  //           f = n.split(scope.separator);
  //           for (i = 0; i < p.length; i++) {
  //             p[i] = p[i].split('');
  //             f[i] = f[i] && f[i].split('') || [];
  //           }
  //           for (i = 0; i < p.length; i++) {
  //             for (j = 0; j < p[i].length; j++) {
  //               p[i][j] = f[i].shift();
  //             }
  //             p[i] = p[i].join('');
  //             k = i + 1;
  //             f[k] = f[i].concat(f[k]);
  //           }
  //           formatted = p.join(scope.separator);
  //           formatted = trim(formatted);
  //           return formatted;
  //         };
  //         setCursorPos = function (input, selectionStart, selectionEnd) {
  //           if (scope.supportsCursorPosition) {
  //             inputCursorTools.setCursorPos(input, selectionStart, selectionEnd);
  //           }
  //         };
  //         getCursorPos = function (input) {
  //           var res;
  //           input = input || scope.input;
  //           res = inputCursorTools.getCursorPos(input, scope.supportsCursorPosition);
  //           return res;
  //         };
  //         ctrl.$formatters.unshift(function () {
  //           var res = ctrl.$modelValue && ctrl.$modelValue.toString();
  //           if (res) {
  //             res = res.replace(scope.filter, '');
  //             res = mask(res);
  //             elem.val(res);
  //             scope.lastVal = res;
  //             return res;
  //           }
  //           return '';
  //         });
  //         scope.char = false;
  //         elem.on('keydown', function (e) {
  //           scope.onKeyDown = true;
  //           if (e.which === 8) {
  //             scope.char = false;
  //             scope.del = true;
  //           } else {
  //             scope.char = String.fromCharCode(e.keyCode).toLowerCase();
  //             scope.firstEvent = scope.firstEvent || 'keyDown';
  //             scope.del = false;
  //           }
  //         });
  //         ctrl.$parsers.unshift(
  //           function (viewValue) {
  //             var val, res, cursorPos, inputChar, usePrev;
  //             scope.firstEvent = scope.firstEvent || 'parser';
  //             usePrev = 1;
  //             val = viewValue.toString();
  //             if (scope.del) {
  //               scope.del = false;
  //               scope.lastVal = val;
  //               return val;
  //             }
  //             res = val.replace(scope.filter, '');
  //             res = mask(res);
  //             if (res === val) {
  //               return val;
  //             }
  //             cursorPos = getCursorPos(scope.input).start;
  //             if (scope.firstEvent === 'keyDown' && scope.char) {
  //               inputChar = val.slice(cursorPos, cursorPos + 1);
  //               if (scope.char !== inputChar.toLowerCase()) {
  //                 inputChar = false;
  //               }
  //             } else {
  //               inputChar = false;
  //             }
  //             if (!inputChar) {
  //               cursorPos -= 1;
  //               usePrev = 0;
  //               if (cursorPos < 0) {
  //                 cursorPos = 0;
  //               }
  //             }
  //             inputChar = val.slice(cursorPos, cursorPos + 1);
  //             elem.val(res);
  //             if (res.length >= scope.pattern.length) {
  //               ctrl.$setViewValue(res);
  //               ctrl.$render();
  //             }
  //             if (!scope.altMethod) {
  //               cursorPos = charPos(res, cursorPos - usePrev, inputChar);
  //               setCursorPos(scope.input, cursorPos, cursorPos);
  //               $timeout(function () {
  //                 setCursorPos(scope.input, cursorPos, cursorPos);
  //               }, 10);
  //             }
  //             scope.lastVal = res;
  //             return res;
  //           }
  //         );
  //         charPos = function (newst, cursorPos, inputChar) {
  //           var i, p = cursorPos;
  //           inputChar = inputChar.replace(scope.filter, '');
  //           if (!inputChar) {
  //             return p;
  //           }
  //           newst = newst && newst.split('') || [];
  //           for (i = p; i < newst.length; i++) {
  //             if (newst[i] === inputChar) {
  //               break;
  //             }
  //           }
  //           i += 1;
  //           return i;
  //         };
  //         RegExp.quote = function (str) {
  //           return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  //         };
  //         scope.forceType = 'url';
  //         scope.t = new Date().getTime();
  //         scope.input = elem[0];
  //         scope.lastVal = '';
  //         scope.c = scope.lnbUiMask.slice(0, 1);
  //         scope.re = new RegExp(RegExp.quote(scope.c), 'g');
  //         scope.pattern = scope.lnbUiMask.replace(scope.re, '*');
  //         scope.separator = scope.pattern.replace(/\*/g, '').split('')[0] || '';
  //         if (scope.c === '*') {
  //           scope.filter = new RegExp('[^0-9a-zA-Z' + RegExp.quote(scope.separator) + ']', 'g');
  //         } else if (isNaN(scope.c)) {
  //           scope.filter = new RegExp('[^a-zA-Z' + RegExp.quote(scope.separator) + ']', 'g');
  //         } else {
  //           scope.forceType = 'tel';
  //           scope.filter = new RegExp('[^0-9' + RegExp.quote(scope.separator) + ']', 'g');
  //         }
  //         scope.inputMaxLen = scope.lnbUiMask.split(scope.separator).join('').length;
  //         scope.altMethod = userAgent.isAndroid && scope.forceType !== 'tel';
  //         attrs.$set('type', scope.forceType);
  //         attrs.$set('autocomplete', 'off');
  //         attrs.$set('autocorrect', 'off');
  //         attrs.$set('autocapitalize', 'off');
  //         attrs.$set('placeholder', scope.pattern.replace(/\*/g, 'X'));
  //         scope.supportsCursorPosition = inputCursorTools.supportsCursorPosition(scope.input);
  //         if (!scope.supportsCursorPosition) {
  //           attrs.$set('type', 'text');
  //           scope.supportsCursorPosition = inputCursorTools.supportsCursorPosition(scope.input);
  //         }
  //       }
  //     };
  //   }])
  .service('inputCursorTools',
  [function () {
    this.supportsCursorPosition = function (input) {
      var test, supports = true;
      try {
        test = input.selectionStart;
      }
      catch (err) {
        supports = false;
      }
      return supports;
    };
    this.getCursorPos = function (input, supportsCursorPosition) {
      var sel, rng, len, pos;
      if (supportsCursorPosition) {
        input.focus();
        if ('selectionStart' in input && document.activeElement === input) {
          return {
            start: input.selectionStart,
            end: input.selectionEnd
          };
        }
        if (input.createTextRange) {
          sel = document.selection.createRange();
          if (sel.parentElement() === input) {
            rng = input.createTextRange();
            rng.moveToBookmark(sel.getBookmark());
            for (len = 0;
                 rng.compareEndPoints('EndToStart', rng) > 0;
                 rng.moveEnd('character', -1)) {
              len++;
            }
            rng.setEndPoint('StartToStart', input.createTextRange());
            for (pos = { start: 0, end: len };
                 rng.compareEndPoints('EndToStart', rng) > 0;
                 rng.moveEnd('character', -1)) {
              pos.start++;
              pos.end++;
            }
            return pos;
          }
        }
      }
      return {
        start: -1,
        end: -1
      };
    };
    this.setCursorPos = function (input, selectionStart, selectionEnd) {
      var range;
      if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
      } else if (input.createTextRange) {
        range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
      }
    };
  }])
  .directive('postCodes', ['$timeout', '$translate',
  function ($timeout, $translate) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        items: '=',
        onSelect: '=',
        changeInput: '='
      },
      link: function (scope, element) {
        var j, k, e;
        scope.max = 30;
        scope.lastVal = '';
        scope.inputElm = angular.element(element[0].querySelector('input'));
        scope.input = scope.inputElm[0];
        scope.selectiMenuElm = angular.element(element[0].querySelector('select'));
        scope.selectiMenu = scope.selectiMenuElm[0];
        scope.zipCodesLen = '';
        scope.map = [];
        for (j = 0; j < scope.items.length; j++) {
          e = scope.items[j];
          e.postcode = e.postcode.toString();
          k = parseInt(e.postcode.slice(0, 1));
          scope.map[k] = j;
        }
        scope.handleSelection = function (selectedItem) {
          if (!selectedItem.postcode || isNaN(selectedItem.postcode)) {
            return;
          }
          scope.selectiMenuElm.css('display', 'none');
          scope.input.value = selectedItem.postcode;
          scope.lastVal = selectedItem.postcode.toString();
          scope.zipCodes = [selectedItem];
          $timeout(function () {
            scope.onSelect(selectedItem);
            scope.input.blur();
          }, 200);
        };
        scope.myFilter = function (e) {
          var filter = scope.input.value,
            res = e.postcode.search(filter);
          return res === 0;
        };
        scope.zipCodes = [];
        scope.filterZips = function (doNotOpen, postCode) {
          var i, e, c = 0, arr = [], filter = scope.input.value, start, end, k, max = scope.max, del, over = 0;
          filter = postCode || filter;
          del = filter.length < scope.lastVal.length ? 2000 : 0;
          if (del) {
            scope.changeInput();
          }
          scope.lastVal = filter;
          k = parseInt(filter.slice(0, 1));
          start = scope.map[k - 1] || 0;
          end = scope.map[k] || scope.items.length - 1;
          for (i = start; i <= end; i++) {
            e = scope.items[i];
            if (e.postcode.search(filter) === 0) {
              c++;
              arr.push(scope.items[i]);
            }
            if (c >= max + 1) {
              over++;
              arr.pop();
              arr.push({postcode: '', customercity: $translate.instant('mmcore.postal-code.type-for-more')});
              break;
            }
          }
          if (del) {
            scope.zip = {};
          }
          scope.zipCodes = arr;
          scope.zipCodesLen = arr.length - over;
          if (over) {
            scope.zipCodesLen += '+';
          }
          if (!doNotOpen) {
            scope.selectiMenuElm.css('display', 'block');
            $timeout.cancel(scope.timer);
            if (scope.zipCodes.length && scope.zipCodes.length - over < scope.max) {
              scope.timer = $timeout(function () {
                scope.openMenu();
              }, scope.zipCodes.length * 10 + del + 1000);
            }
          }
          scope.$apply();
        };
        scope.openMenu = function () {
          var event, el;
          scope.input.blur();
          el = scope.selectiMenu;
          event = document.createEvent('MouseEvents');
          event.initEvent('mousedown', true, true, window);
          el.dispatchEvent(event);
        };
        scope.inputElm.on('focus', function () {
          scope.filterZips();
          scope.selectiMenuElm.css('display', 'block');
          $timeout.cancel(scope.timer);
          if (scope.zipCodes.length && scope.zipCodes.length < scope.max) {
            scope.timer = $timeout(function () {
              scope.openMenu();
            }, 5000);
          }
        });
        scope.inputElm.on('input', function () {
          scope.filterZips();
        });
        scope.selectiMenuElm.on('mousedown', function () {
          $timeout.cancel(scope.timer);
        });
        scope.selectiMenuElm.on('blur', function () {
          scope.selectiMenuElm.css('display', 'none');
        });
        scope.formatLabel = function (item) {
          return item.postcode + ' ' + item.customercity;
        };
        $timeout(function () {
          scope.filterZips(true);
        }, 0);
      },
      template: '<div class="postCodesDir" style="position:relative;z-index:10;">' +
        '<select style="display:none;"  data-ng-model="zip"  ng-options="item as formatLabel(item) for item in zipCodes" ng-change="handleSelection(zip)" >' +
        '<option value="" disabled  style="display:none;" >{{"mmcore.postal-code.choose" | translate}} ({{zipCodesLen}})</option>' +
        '</select>' +
        '<ng-transclude></ng-transclude>' +
        '</div>'
    };
  }]);
