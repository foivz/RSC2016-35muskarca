angular.module('petGuard')
.factory('mobilePostcodes', ['createI18Resource', function (createI18Resource) {
      return createI18Resource('/cache/mobilePostcodes/:IDMDLanguage/BE/locations.json', false);
    }
  ])
.service('personalDetailsService', ['rpcService', 'mobilePostcodes', function (rpcService, mobilePostcodes) {
      var self = this,
      serviceName = 'LNBUserService';
      serviceName = 'UserService';
      this.invokeLNB = rpcService.invoke.bind(rpcService, serviceName);
      this.fetchLocations = function () {
        return mobilePostcodes().then(
          function (result) {
          self.locations = result.Locations;
          return self.locations;
        });
      };
      this.updatePersonalDetails = function (personalDetails, password, oldEmail, oldAccountNumber, bankTransfer) {
        var i,
        personalDetailsToUpdate = {},
        methodName = 'UpdatePersonalDetailsAndRegisterBankTransfer';
        for (i in personalDetails) {
          personalDetailsToUpdate[i] = personalDetails[i];
        }
        personalDetailsToUpdate.MobilePhone = personalDetailsToUpdate.MobilePhone && personalDetailsToUpdate.MobilePhone.toString().replace(/[^0-9]/g, '') || null;
        personalDetailsToUpdate.HomePhone = personalDetailsToUpdate.HomePhone && personalDetailsToUpdate.HomePhone.toString().replace(/[^0-9]/g, '') || null;
        methodName = 'UpdatePersonalDetailsAndRegisterBankTransfer';
        return self.invokeLNB(
          methodName, {
          personalDetails : personalDetailsToUpdate,
          password : password,
          oldEmail : oldEmail,
          OldAccountNumber : oldAccountNumber || '',
          bankTransfer : bankTransfer
        }, {
          possibleExceptions : {
            'Com.Finsoft.Warp.Connecticut.Services.IncorrectPasswordException' : 'incorrectPassword',
            'Com.Finsoft.Warp.Connecticut.Services.IncorrectCurrentBankAccountNumberException' : 'incorrectCurrentBankAccountNumber',
            'Com.Finsoft.Warp.Texas.WCF.DTO.WCFUnknownException' : 'incorrectBankAccountNumber',
            'Com.Finsoft.Warp.Texas.Local.DBException' : 'technicalError'
          }
        }).then(function (result) {
          return result;
        });
      }
      .operationProgress('UpdatePersonalDetailsAndRegisterBankTransfer');
    }
  ]);
