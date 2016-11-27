angular.module('common')
  .constant('userAgent', (function (userAgent, location) {
    var ua = userAgent.toLowerCase(),
      href = location.href.toLowerCase(),
      result = {};

    function isDefined(value) {
      return typeof (value) !== 'undefined';
    }

    function strContains(s, other) {
      return s.indexOf(other) >= 0;
    }

    function uaContains(sub) {
      return strContains(ua, sub);
    }

    function strEquals(s, other) {
      return s === other;
    }

    function strStartsWith(s, other) {
      return s.indexOf(other) === 0;
    }
    result.userAgent = userAgent;
    result.isDOM = isDefined(document) && isDefined(document.getElementById);
    result.isStrict = strEquals(document.compatMode, 'CSS1Compat');
    result.isSecure = strStartsWith(href, 'https:');
    result.isWindows = uaContains('windows') || uaContains('win32') || uaContains('win64') || uaContains('wow64');
    result.isWindowsPhone7 = uaContains('windows phone os 7') || uaContains('windows phone 7');
    result.isWindowsPhone8 = uaContains('windows phone os 8') || uaContains('windows phone 8');
    result.isWindowsPhone = uaContains('windows phone os') || uaContains('windows phone');
    result.isLinux = uaContains('linux');
    result.isMAC = uaContains('max os x');
    result.isAIR = uaContains('adobeair');
    result.isKonqueror = uaContains('konqueror');
    result.isLikeGecko = uaContains('like gecko');
    result.isGecko = uaContains('gecko') && !result.isLikeGecko;
    result.isSafari = uaContains('safari') && !uaContains('chrome/');
    result.isOpera = uaContains('opera');
    result.isMobileOpera = uaContains('opera tablet/') || uaContains('opera mobi/');
    result.isFirefox = uaContains('firefox/') && (parseFloat(navigator.appVersion) >= 5);
    result.isMobileFirefox = result.isFirefox && uaContains('fennec/');
    result.isTrident = uaContains('trident/');
    result.isIE = (uaContains('msie') || result.isTrident) && !result.isOpera;
    result.isIE8 = result.isIE && uaContains('msie 8');
    result.isIE9 = result.isIE && uaContains('msie 9');
    result.isIE10 = result.isIE && uaContains('msie 10');
    result.isIE11 = result.isIE && uaContains('rv:11');
    result.isChrome = uaContains('chrome/') && !uaContains('like chrome');
    result.isWebKit = uaContains('webkit');
    result.isMobileWebKit = result.isWebKit && uaContains('mobile');
    result.isIPhone = result.isMobileWebKit && uaContains('iphone') && !result.userAgent.match(/(like iPhone)/g);
    result.isIPad = result.isMobileWebKit && uaContains('ipad') && !result.userAgent.match(/(like iPad)/g);
    result.isIPod = result.isMobileWebKit && uaContains('ipod') && !result.userAgent.match(/(like iPod)/g);
    result.isIOS = !!result.userAgent.match(/(iPad|iPhone|iPod)/g) && !result.userAgent.match(/(like iPad|like iPhone|like iPod)/g);
    result.isAndroid = uaContains('android') && !result.isTrident && !result.isIE;
    result.isWebOS = uaContains('webos');
    result.isSymbian = uaContains('symbian');
    result.isBlackBerry = uaContains('blackberry');

    result.isMobile = result.isWindowsPhone || result.isAndroid || result.isIPhone || result.isIPad || result.isMobileWebKit || result.isMobileFirefox || result.isMobileOpera;

    if (result.isIE) {
      try {
        result.ieVersion = parseFloat(ua.match(/rv\:(\d+\.\d+)/)[1]); // IE11+
      }
      catch (err) {
        result.ieVersion = parseFloat(ua.match(/msie (\d+\.\d+)/)[1]); // IE<=10
      }
    }

    if (result.isTrident) {
      result.tridentVersion = parseFloat(ua.match(/ trident\/(\d+\.\d+)/)[1]);
    }

    if (result.isFirefox) {
      result.ffVersion = parseFloat(ua.match(/ firefox\/(\d+\.\d+)/)[1]);
    }

    if (result.isGecko) {
      result.geckoVersion = parseFloat(ua.match(/ gecko\/(\d+)/)[1]);
    }

    if (result.isWebKit) {
      result.webKitVersion = parseFloat(ua.match(/ applewebkit\/(\d+(\.\d+)?)/)[1]);
    }

    if (result.isChrome) {
      result.chromeVersion = parseFloat(ua.match(/ chrome\/(\d+(\.\d+)?)/)[1]);
    }

    if (result.isSafari) {
      result.safariVersion = parseFloat(ua.match(/ safari\/(\d+(\.\d+)?)/)[1]);
    }

    result.toString = function () {
      return result.userAgent;
    };
    return result;
  })(navigator.userAgent, location))
  .directive('lnbUiMask',
  ['$timeout', 'userAgent', 'inputCursorTools',
    function ($timeout, userAgent, inputCursorTools) {
      return {
        require: '?ngModel',
        scope: {
          lnbUiMask: '@'
        },
        link: function (scope, elem, attrs, ctrl) {
          var mask, trim, setCursorPos, getCursorPos, charPos;
          if (!ctrl) {
            return;
          }
          if (userAgent.isIOS) {
            scope.iOSver = userAgent.userAgent.split('Version/')[1] && parseFloat(userAgent.userAgent.split('Version/')[1].split(' ')[0]);
          }
          scope.isIOS6 = userAgent.isIOS && scope.iOSver < 7;
          ctrl.$formatters = [];
          ctrl.$parsers = [];
          scope.firstEvent = false;
          trim = function (str) {
            var c;
            str = str.split('');
            c = str.pop();
            while (c === '-') {
              c = str.pop();
            }
            str.push(c);
            return str.join('');
          };
          mask = function (viewValue) {
            var n, p, f, i, j, k, formatted;
            n = viewValue;
            p = scope.pattern.split(scope.separator);
            f = n.split(scope.separator);
            for (i = 0; i < p.length; i++) {
              p[i] = p[i].split('');
              f[i] = f[i] && f[i].split('') || [];
            }
            for (i = 0; i < p.length; i++) {
              for (j = 0; j < p[i].length; j++) {
                p[i][j] = f[i].shift();
              }
              p[i] = p[i].join('');
              k = i + 1;
              f[k] = f[i].concat(f[k]);
            }
            formatted = p.join(scope.separator);
            formatted = trim(formatted);
            return formatted;
          };
          setCursorPos = function (input, selectionStart, selectionEnd) {
            if (scope.supportsCursorPosition) {
              inputCursorTools.setCursorPos(input, selectionStart, selectionEnd);
            }
          };
          getCursorPos = function (input) {
            var res;
            input = input || scope.input;
            res = inputCursorTools.getCursorPos(input, scope.supportsCursorPosition);
            return res;
          };
          ctrl.$formatters.unshift(function () {
            var res = ctrl.$modelValue && ctrl.$modelValue.toString();
            if (res) {
              res = res.replace(scope.filter, '');
              res = mask(res);
              elem.val(res);
              scope.lastVal = res;
              return res;
            }
            return '';
          });
          scope.char = false;
          elem.on('keydown', function (e) {
            scope.onKeyDown = true;
            if (e.which === 8) {
              scope.char = false;
              scope.del = true;
            } else {
              scope.char = String.fromCharCode(e.keyCode).toLowerCase();
              scope.firstEvent = scope.firstEvent || 'keyDown';
              scope.del = false;
            }
          });
          ctrl.$parsers.unshift(
            function (viewValue) {
              var val, res, cursorPos, inputChar, usePrev;
              scope.firstEvent = scope.firstEvent || 'parser';
              usePrev = 1;
              val = viewValue.toString();
              if (scope.del) {
                scope.del = false;
                scope.lastVal = val;
                return val;
              }
              res = val.replace(scope.filter, '');
              res = mask(res);
              if (res === val) {
                return val;
              }
              cursorPos = getCursorPos(scope.input).start;
              if (scope.firstEvent === 'keyDown' && scope.char) {
                inputChar = val.slice(cursorPos, cursorPos + 1);
                if (scope.char !== inputChar.toLowerCase()) {
                  inputChar = false;
                }
              } else {
                inputChar = false;
              }
              if (!inputChar) {
                cursorPos -= 1;
                usePrev = 0;
                if (cursorPos < 0) {
                  cursorPos = 0;
                }
              }
              inputChar = val.slice(cursorPos, cursorPos + 1);
              elem.val(res);
              if (res.length >= scope.pattern.length) {
                ctrl.$setViewValue(res);
                ctrl.$render();
              }
              if (!scope.altMethod) {
                cursorPos = charPos(res, cursorPos - usePrev, inputChar);
                setCursorPos(scope.input, cursorPos, cursorPos);
                $timeout(function () {
                  setCursorPos(scope.input, cursorPos, cursorPos);
                }, 10);
              }
              scope.lastVal = res;
              return res;
            }
          );
          charPos = function (newst, cursorPos, inputChar) {
            var i, p = cursorPos;
            inputChar = inputChar.replace(scope.filter, '');
            if (!inputChar) {
              return p;
            }
            newst = newst && newst.split('') || [];
            for (i = p; i < newst.length; i++) {
              if (newst[i] === inputChar) {
                break;
              }
            }
            i += 1;
            return i;
          };
          RegExp.quote = function (str) {
            return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
          };
          scope.forceType = 'url';
          scope.t = new Date().getTime();
          scope.input = elem[0];
          scope.lastVal = '';
          scope.c = scope.lnbUiMask.slice(0, 1);
          scope.re = new RegExp(RegExp.quote(scope.c), 'g');
          scope.pattern = scope.lnbUiMask.replace(scope.re, '*');
          scope.separator = scope.pattern.replace(/\*/g, '').split('')[0] || '';
          if (scope.c === '*') {
            scope.filter = new RegExp('[^0-9a-zA-Z' + RegExp.quote(scope.separator) + ']', 'g');
          } else if (isNaN(scope.c)) {
            scope.filter = new RegExp('[^a-zA-Z' + RegExp.quote(scope.separator) + ']', 'g');
          } else {
            scope.forceType = 'tel';
            scope.filter = new RegExp('[^0-9' + RegExp.quote(scope.separator) + ']', 'g');
          }
          scope.inputMaxLen = scope.lnbUiMask.split(scope.separator).join('').length;
          scope.altMethod = userAgent.isAndroid && scope.forceType !== 'tel';
          attrs.$set('type', scope.forceType);
          attrs.$set('autocomplete', 'off');
          attrs.$set('autocorrect', 'off');
          attrs.$set('autocapitalize', 'off');
          attrs.$set('placeholder', scope.pattern.replace(/\*/g, 'X'));
          scope.supportsCursorPosition = inputCursorTools.supportsCursorPosition(scope.input);
          if (!scope.supportsCursorPosition) {
            attrs.$set('type', 'text');
            scope.supportsCursorPosition = inputCursorTools.supportsCursorPosition(scope.input);
          }
        }
      };
    }])
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
  }]);
