angular.module('petGuard')
  .controller('PersonalDetailsCtrl',
  ['$scope', '$timeout', 'personalDetailsService', 'personalDetails', 'postcodes', 'personalDetailsInfoToasterDisplayed', 'formDataValidationService', 'userService', 'bankAccountService', 'bankAccountValidationService', 'lnbModalsService', function ($scope, $timeout, personalDetailsService, personalDetails, postcodes, personalDetailsInfoToasterDisplayed, formDataValidationService, userService, bankAccountService, bankAccountValidationService, lnbModalsService) {
    var updateFormStatus, validateForm, parsePersonalDetails, update,
      clearForm,
      hideKeyboard,
      validationService = bankAccountValidationService,
      inputsToValidate = {
        confirmationPassword: true,
        emailConfirm: true,
        primaryEmail: true,
        postcodes: true,
        locality: true,
        street: true,
        oldAccountNumber: true,
        newAccountNumber: true
      };
    $scope.invalidInputs = {};
    $scope.addFunds = false;
    $scope.accountNumbers = {};
    $scope.confirmationPassword = {};
    $scope.showAccountEditMode = false;
    $scope.submitted = false;
    $scope.showErrorMessage = false;
    $scope.disabled = true;
    $scope.newAccountNumberRequired = false;
    $scope.initialPersonalDetails = {};
    $scope.lnbModalsService = lnbModalsService;

    //bankAccountMethods
    update = function (oldCheck) {
      $scope.error = false;
      bankAccountService.getAccountDetails().then(
        function () {
          $scope.ready = true;

          if (bankAccountService.bankTransfer.AccountNumber) {
            //$scope.currentBankAccount = false;
            $scope.currentBankAccount = oldCheck ? bankAccountService.bankTransfer.AccountNumber : false;
          }

          $scope.bankTransfer = bankAccountService.bankTransfer;
        },
        function (error) {
          //TODO msgService
          $scope.error = error;
        }
      );
    };

    $scope.bankAccountPattern = (function () {
      return {
        test: function (value) {
          return (validationService.patterns.IBAN(value) || validationService.patterns.BBAN(value));
        }
      };
    })();

    clearForm = function () {
      $scope.accountNumbers.oldAccountNumber = '';
      $scope.accountNumbers.newAccountNumber = '';
      $scope.confirmEmail = '';
      $scope.newAccountNumberRequired = false;
      $scope.disabled = true;
    };

    hideKeyboard = function () {
      var i;
      $timeout(function () {
        var inputs;
        document.activeElement.blur();
        inputs = document.querySelectorAll('input');
        for (i = 0; i < inputs.length; i++) {
          inputs[i].blur();
        }
      });
    };

    $scope.checkField = function (formField) {
      if (formField) {
        if (formField.$valid) {
          $scope.invalidInputs[formField.$name] = null;
        }
        if (formField.$name === 'oldAccountNumber') {
          if (formField.$viewValue !== undefined && formField.$viewValue !== '') {
            $scope.disabled = false;
            $scope.newAccountNumberRequired = true;
          } else if (formField.$viewValue === '') {
            $scope.disabled = true;
            $scope.newAccountNumberRequired = false;
            $scope.accountNumbers.newAccountNumber = '';
          }
        }
      }
    };

    update(true);
    //end BankAccountMethods

    updateFormStatus = function (form, isSuccess, reason) {
      $scope.submitted = true;
      form.$setPristine();
      form.$success = isSuccess;
      form.error = isSuccess ? {} : {reason: reason};
      if (reason === 'incorrectPassword') {
        $scope.invalidInputs.confirmationPassword = reason;
        $scope.showErrorMessage = true;
      }
      if (reason === 'unexpectedError') {
        $scope.invalidInputs.unexpectedError = reason;
      }
      $scope.scroll.top = true;
      if (isSuccess) {
        delete $scope.confirmationPassword.password;
        userService.getPersonalDetailsIfLoggedIn.force()
          .then(function (result) {
            personalDetails = result;
            parsePersonalDetails();
          });
      }
    };
    validateForm = function (form) {
      var i, formField,
        hasError = false,
        error = false;
      $scope.invalidInputs = {};
      if (form.$valid) {
        form.$setPristine();
      }
      for (i in inputsToValidate) {
        formField = form[i];
        error = false;
        if (formField) {
          if (!formField.$valid) {
            hasError = true;
            $scope.invalidInputs[formField.$name] = formField.$error;
          }
        }
      }
      if (hasError) {
        form.error = {reason: error.reason || hasError};
        form.$success = false;
        form.$valid = false;
        form.$invalid = true;
        $scope.scroll.top = true;
      } else {
        form.error = {};
        form.$valid = true;
        form.$invalid = false;
      }
      for (i in $scope.invalidInputs) {
        $scope.invalidInputs[i] = Object.keys($scope.invalidInputs[i])[0];
      }
      if ($scope.invalidInputs.primaryEmail === 'email') {
        $scope.invalidInputs.primaryEmail = 'invalid';
      }
      if ($scope.invalidInputs.confirmationPassword === 'required') {
        $scope.invalidInputs.confirmationPassword = 'passwordIsRequired';
      }
      if ($scope.invalidInputs.oldAccountNumber === 'pattern') {
        $scope.invalidInputs.oldAccountNumber = 'pattern';
      }
      if ($scope.invalidInputs.newAccountNumber === 'pattern') {
        $scope.invalidInputs.newAccountNumber = 'pattern';
      }
      if ($scope.invalidInputs.newAccountNumber === 'required') {
        $scope.invalidInputs.newAccountNumber = 'required';
      }
      // if ($scope.invalidInputs.emailConfirm === 'email') {
      //   $scope.invalidInputs.emailConfirm = 'invalid';
      // }
      form.$setPristine();
      $scope.showErrorMessage = hasError;
      return form.$valid;
    };
    $scope.personalDetailsToaster = {};
    $scope.displayInfoToaster = function () {
      var display = !personalDetailsInfoToasterDisplayed;
      return display;
    };
    $scope.personalDetailsCustomInfo = function () {
      return 'mmcore.personalDetails.info-msg';
    };
    $scope.scroll = {};
    parsePersonalDetails = function () {
      $scope.primaryEmailNotChanged = true;
      $scope.personalDetails = personalDetails;
      $scope.initialPersonalDetails = angular.copy($scope.personalDetails);
      $scope.oldEmail = personalDetails && personalDetails.PrimaryEmail;
      $scope.selectedPostcode = personalDetails && parseInt(personalDetails.PostCode);
      $scope.selectedCity = personalDetails && personalDetails.City;
    };
    parsePersonalDetails();
    $scope.changePrimaryEmail = function () {
      $scope.primaryEmailNotChanged = false;
      if ($scope.personalDetails.PrimaryEmail === $scope.oldEmail) {
        $scope.primaryEmailNotChanged = true;
        $scope.confirmEmail = '';
      } else {
        return;
      }
    };
    $scope.changePostalCode = function () {
      $scope.selectedCity = '';
    };
    $scope.onItemSelected = function (selItem) {
      $scope.selectedCity = selItem.customercity;
      $scope.personalDetailsForm.postcodes.$setDirty();
      $scope.selectedPostcode = parseInt(selItem.postcode);
      $timeout(function () {
        $scope.recheckForm('locality');
      }, 250);
    };
    $scope.locations = postcodes;
    $scope.updatePersonalDetails = function (form, confirmationPassword) {
      var newAccountNumber, bankTransfer, oldAccountNumber;
      $scope.submitted = false;
      if (validateForm(form)) {
        personalDetails.City = $scope.selectedCity;
        personalDetails.PostCode = $scope.selectedPostcode;
        $scope.personalDetails.City = $scope.selectedCity;
        $scope.personalDetails.PostCode = $scope.selectedPostcode;
        if ($scope.accountNumbers.newAccountNumber) {
          newAccountNumber = validationService.cleanNR($scope.accountNumbers.newAccountNumber);
          bankTransfer = $scope.bankTransfer;
          if ($scope.currentBankAccount) {
            oldAccountNumber = validationService.cleanNR($scope.accountNumbers.oldAccountNumber);
            oldAccountNumber = validationService.convertToIBAN(oldAccountNumber);
          }
          bankTransfer.AccountNumber = newAccountNumber;
        } else {
          newAccountNumber = '';
          oldAccountNumber = '';
          bankTransfer = null;
        }
        personalDetailsService.updatePersonalDetails($scope.personalDetails, confirmationPassword.password, $scope.oldEmail, oldAccountNumber, bankTransfer).then(
          updateFormStatus.bind(undefined, form, true),
          updateFormStatus.bind(undefined, form, false)
        );
      } else {
        $scope.submitted = true;
      }
    };
    $scope.changeAccountInformation = function () {
      $scope.showAccountEditMode = !$scope.showAccountEditMode;
      $scope.personalDetails = angular.copy($scope.initialPersonalDetails);
      $scope.showErrorMessage = false;
      $scope.showFieldErrorMessage = false;
    };
    $scope.isEmailValid = function (emailAdress) {
      var isValid;
      if (!emailAdress) {
        return [
          {value: true, error: 'invalid'},
          {value: false, error: 'required'}
        ];
      }
      isValid = formDataValidationService.isEmailValid(emailAdress);
      return [
        {value: isValid, error: 'invalid'},
        {value: true, error: 'required'}
      ];
    };
    $scope.confirmEmailAddress = function (confirmEmail) {
      var doesMatch;
      if ($scope.primaryEmailNotChanged || !$scope.personalDetails.PrimaryEmail) {
        return true;
      }
      doesMatch = formDataValidationService.doesMatch(confirmEmail, $scope.personalDetails.PrimaryEmail);
      return doesMatch;
    };
    $scope.recheckForm = function (field) {
      var formField, hasError;
      if (!$scope.showErrorMessage) {
        return;
      }
      formField = $scope.personalDetailsForm[field];
      hasError = false;
      if (formField) {
        if (!$scope.invalidInputs[formField.$name]) {
          return;
        }
        if (!formField.$valid) {
          hasError = true;
          $scope.invalidInputs[formField.$name] = Object.keys(formField.$error)[0];
          if ($scope.invalidInputs.primaryEmail === 'email') {
            $scope.invalidInputs.primaryEmail = 'invalid';
          }
          if ($scope.invalidInputs.confirmationPassword === 'required') {
            $scope.invalidInputs.confirmationPassword = 'passwordIsRequired';
          }
        } else {
          delete $scope.invalidInputs[formField.$name];
        }
      }
      $scope.showFieldErrorMessage = Object.keys($scope.invalidInputs).length;
    };
  }]);
