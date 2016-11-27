angular.module('petGuard')
  .service('bankAccountService', ['accountService', 'userService', 'depositService', function (accountService, userService, depositService) {
    var self = this;
    this.getAccountDetails = function () {
      return accountService.invoke('GetDefaultBankTransferPaymentInstrument', { IDMMSITransactionType: 'C', IDMMSIType: 'BENAT' }).then(
        function (activePaymentInstrument) {
          if (activePaymentInstrument && activePaymentInstrument.IDMMSIType === 'BENAT' && activePaymentInstrument.IsDefaultForPayments) {
            activePaymentInstrument.UpdatedAccountNumber = activePaymentInstrument.OldAccountNumber = activePaymentInstrument.AccountNumber;
            self.bankTransfer = activePaymentInstrument;
          } else {
            self.bankTransfer = {
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
          }
          return self.bankTransfer;
        }
      );
    };
    this.updateBankAccount = function (bankTransfer, accountNumber, oldAccountNumber) {
      bankTransfer.OldAccountNumber = oldAccountNumber;
      bankTransfer.UpdatedAccountNumber = bankTransfer.AccountNumber = accountNumber;
      return accountService.invoke(oldAccountNumber ? 'ReplaceBankTransferWithoutPassword' : 'RegisterBankTransfer', { OldAccountNumber: oldAccountNumber || '', bankTransfer: bankTransfer },
        {
          possibleExceptions: {
            'Com.Finsoft.Warp.Connecticut.Services.IncorrectCurrentBankAccountNumberException': 'incorrectCurrentBankAccountNumber',
            'Com.Finsoft.Warp.Texas.WCF.DTO.WCFUnknownException': 'incorrectBankAccountNumber'
          }
        }
      )
      .then(depositService.fetchActivePaymentInstruments);
    };
  }]);
