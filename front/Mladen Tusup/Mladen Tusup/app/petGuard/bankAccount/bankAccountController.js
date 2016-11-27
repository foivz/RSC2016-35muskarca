angular.module('petGuard')
  .controller('BankAccountCtrl', ['$scope', '$timeout', '$state', 'userService', 'bankAccountService', 'bankAccountValidationService', function ($scope, $timeout, $state, userService, bankAccountService, bankAccountValidationService) {
    var validateForm,
      update,
      clearForm,
      hideKeyboard,
      validationService = bankAccountValidationService,
      inputsToValidate = {
        oldAccountNumber: true,
        newAccountNumber: true
      };
    $scope.invalidInputs = {};
    $scope.addFunds = false;

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

    $scope.partOfBankAccount = true;
    $scope.bankAccountPattern = (function () {
      return {
        test: function (value) {
          if (value) {
            $scope.partOfBankAccount = false;
          }
          return (validationService.patterns.IBAN(value) || validationService.patterns.BBAN(value));
        }
      };
    })();

    $scope.updateBankAccount = function (form) {
      var newAccountNumber, bankTransfer, oldAccountNumber;
      form.error = {};
      $scope.addFunds = false;
      hideKeyboard();
      if (validateForm(form)) {
        newAccountNumber = validationService.cleanNR($scope.newAccountNumber);
        bankTransfer = $scope.bankTransfer;
        oldAccountNumber = false;
        if ($scope.currentBankAccount) {
          oldAccountNumber = validationService.cleanNR($scope.oldAccountNumber);
          oldAccountNumber = validationService.convertToIBAN(oldAccountNumber);
        }
        bankAccountService.updateBankAccount(bankTransfer, newAccountNumber, oldAccountNumber).then(function () {
          update(oldAccountNumber);
          $scope.addFunds = oldAccountNumber ? false : true;
          $scope.scroll.top = true;
          form.success = true;
          clearForm();
        }, function (error) {
          $scope.scroll.top = true;
          form.error = { reason: error };
          if (error === 'incorrectCurrentBankAccountNumber') {
            $scope.invalidInputs.oldAccountNumber = error;
            $scope.showErrorMessage = true;
          }
        });
      }
    };

    clearForm = function () {
      $scope.oldAccountNumber = '';
      $scope.newAccountNumber = '';
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

    validateForm = function (form) {
      var i, formField,
        hasError = false,
        error = false;
      form.$setPristine();
      form.success = false;
      $scope.invalidInputs = {};

      if (!form.$valid) {

        $scope.scroll.top = true;

        for (i in inputsToValidate) {
          formField = form[i];
          error = false;
          if (formField) {
            if (!formField.$valid) {
              hasError = true;
              $scope.invalidInputs[formField.$name] = Object.keys(formField.$error)[0];
            }
          }
        }

        form.error = { reason: 'incorrectBankAccountNumber' };
        form.success = false;
      } else {
        form.error = {};
      }
      $scope.showErrorMessage = hasError;
      return form.$valid;
    };

    $scope.checkField = function (formField) {
      if (formField !== null) {
        if (formField.$valid) {
          $scope.invalidInputs[formField.$name] = null;
        }
      }
    };

    update(true);

    $scope.bankAccountIsNotValid = false;
    $scope.registerBankAccount = function (bankAccountForm, bankAccountNumber) {
      var bankTransfer = {
        IDMMSIType: 'BENAT',
        AccountOwner: userService.personalDetails.FullName,
        Address: userService.personalDetails.StreetAddress,
        City: userService.personalDetails.City,
        Postcode: userService.personalDetails.PostCode,
        State: '',
        IDMMCountry: userService.personalDetails.IDMMCountry,
        IsSameAsMainAddress: true,
        IsDefaultForReceipt: false,
        IsDefaultForPayment: true
      };

      hideKeyboard();

      if (!bankAccountNumber) {
        $scope.bankAccountIsNotValid = true;
        return;
      }
      bankAccountService.updateBankAccount(bankTransfer, bankAccountNumber, null).then(function () {
        $state.go('app.pws.addFunds');
      }, function (reason) {
        $scope.bankAccountIsNotValid = false;
        bankAccountForm.$setPristine();
        bankAccountForm.error = { reason: reason };
      });
    };
    $scope.testValue = function () {
      if ($scope.bankAccountNumber === '') {
        $scope.partOfBankAccount = true;
      }
    };
  }]);
