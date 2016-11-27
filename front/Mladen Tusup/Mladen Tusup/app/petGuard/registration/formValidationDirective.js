angular.module('mainModule')
  .directive('angularFnFormValidator',
  [
    function () {
      return {
        restrict: 'A',
        link: function (scope, element) {
          // This is the DOM form element
          var DOMForm, scopeForm, setupWatch, getDirtyValue, checkElementValididty, updateValidationMessage, generateErrorMessage, isValidationMessagePresent, updateValidationClass;
          DOMForm = angular.element(element)[0];
          // This is the the scope form model
          // All validation states are contained here
          scopeForm = scope[DOMForm.name];
          // Set the default submitted state to false
          scopeForm.submitted = false;
          // Intercept and handle submit events of the form
          element.on('submit', function (event) {
            event.preventDefault();
            scope.$apply(function () {
              scopeForm.submitted = true;
            });
            // If the form is valid then call the function that is declared in the angular-validator-submit atrribute on the form element
            if (scopeForm.$valid) {
              scope.$apply(function () {
                if (DOMForm.attributes['angular-validator-submit']) {
                  scope.$eval(DOMForm.attributes['angular-validator-submit'].value);
                }
              });
            }
          });
          // Setup $watch on a single formfield
          setupWatch = function (elementToWatch) {
            // If element is set to validate on blur then update the element on blur
            if ('validate-on' in elementToWatch.attributes && elementToWatch.attributes['validate-on'].value === 'blur') {
              angular.element(elementToWatch).on('blur', function () {
                updateValidationMessage(elementToWatch);
                updateValidationClass(elementToWatch);
              });
            }
            scope.$watch(function () {
              return elementToWatch.value + scopeForm.submitted + checkElementValididty(elementToWatch) + getDirtyValue(scopeForm[elementToWatch.name]);
            }, function () {
              // if dirty show
              if ('validate-on' in elementToWatch.attributes && elementToWatch.attributes['validate-on'].value === 'dirty') {
                updateValidationMessage(elementToWatch);
                updateValidationClass(elementToWatch);
              } else if (scopeForm.submitted || (scopeForm[elementToWatch.name] && scopeForm[elementToWatch.name].$valid)) {
                // Update the field immediately if the form is submitted or the element is valid
                updateValidationMessage(elementToWatch);
                updateValidationClass(elementToWatch);
              }
            });
          };
          // Iterate through the form fields and setup watches on each one
          function setupWatches(formElement) {
            var i;
            for (i = 0; i < formElement.length; i++) {
              // This ensures we are only watching form fields
              if (i in formElement) {
                setupWatch(formElement[i]);
              }
            }
          }
          // Setup watches on all form fields
          setupWatches(DOMForm);
          // Returns the $dirty value of the element if it exists
          getDirtyValue = function (element) {
            if (element) {
              if ('$dirty' in element) {
                return element.$dirty;
              }
            }
          };
          checkElementValididty = function (element) {
            var isMultyValid = true, i, validator, error, isElementValid;
            // If element has a custom validation function
            if ('validator' in element.attributes) {
              // Call the custom validator function
              validator = scope.$eval(element.attributes.validator.value);
              error = 'angularValidator';
              isElementValid = validator;
              if (typeof validator === 'object') {
                for (i in validator) {
                  if (validator.hasOwnProperty(i)) {
                    error = validator[i].error;
                    isElementValid = validator[i].value;
                    if (!isElementValid) {
                      isMultyValid = false;
                    }
                    scopeForm[element.name].$setValidity(error, isElementValid);
                  }
                }
                return isMultyValid;
              }
              scopeForm[element.name].$setValidity(error, isElementValid);
              return isElementValid;
            }
          };
          // Adds and removes an error message as a sibling element of the form field
          // depending on the validity of the form field and the submitted state of the form.
          // Will use default message if a custom message is not given
          updateValidationMessage = function (element) {
            var defaultRequiredMessage, defaultInvalidMessage, scopeElementModel, validationMessageElement;
            defaultRequiredMessage = function () {
              return '';
            };
            defaultInvalidMessage = function () {
              return '';
            };
            // Make sure the element is a form field and not a button for example
            // Only form elements should have names.
            if (!(element.name in scopeForm)) {
              return;
            }
            scopeElementModel = scopeForm[element.name];
            // Only add/remove validation messages if the form field is $dirty or the form has been submitted
            if (scopeElementModel.$dirty || scope[element.form.name] && scope[element.form.name].submitted) {

              // Remove all validation messages
              validationMessageElement = isValidationMessagePresent(element);
              if (validationMessageElement) {
                validationMessageElement.remove();
              }
              if (scopeElementModel.$error.required) {
                // If there is a custom required message display it
                if ('required-message' in element.attributes) {
                  angular.element(element).after(generateErrorMessage(element.attributes['required-message'].value));
                } else {
                  // Display the default require message
                  angular.element(element).after(generateErrorMessage(defaultRequiredMessage));
                }
              } else if (!scopeElementModel.$valid) {
                // If there is a custom validation message add it
                if ('invalid-message' in element.attributes) {
                  angular.element(element).after(generateErrorMessage(element.attributes['invalid-message'].value));
                } else {
                  // Display the default error message
                  angular.element(element).after(generateErrorMessage(defaultInvalidMessage));
                }
              }
            }
          };
          generateErrorMessage = function (messageText) {
            messageText = '';
            return '';
          };
          // Returns the validation message element or False
          isValidationMessagePresent = function (element) {
            var i, elementSiblings;
            elementSiblings = angular.element(element).parent().children();
            for (i = 0; i < elementSiblings.length; i++) {
              if (angular.element(elementSiblings[i]).hasClass('validationMessage')) {
                return angular.element(elementSiblings[i]);
              }
            }
            return false;
          };
          // Adds and removes .has-error class to both the form element and the form element's parent
          // depending on the validity of the element and the submitted state of the form
          updateValidationClass = function (element) {
            if (!(element.name in scopeForm)) {
              return;
            }
            angular.element(element).removeClass('has-error');
            return;
          };
        }
      };
    }]);
