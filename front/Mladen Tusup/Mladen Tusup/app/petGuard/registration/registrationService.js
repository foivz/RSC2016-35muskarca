angular.module('petGuard')
  .value('defaultNewsletterPreferences', {pMarketingChannelList: 'EMA', pMarketingTopicList: '1,2,3,7'})
  .service('registrationService',
  ['rpcService', 'language', 'defaultNewsletterPreferences', 'contactsService', 'isPhone',
    function (rpcService, language, defaultNewsletterPreferences, contactsService, isPhone) {
      var self = this, formatDate;
      this.userService = {};
      this.invokeLNB = rpcService.invoke.bind(rpcService, 'LNBUserService');
      formatDate = function (date) {
        if (typeof date === 'undefined' || date === null || isNaN(date.getTime())) {
          return null;
        }
        return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' 0-0-0';
      };
      this.registerWebContact = function (firstName, lastName, email, dateOfBirth, gender, returnUrl) {
        var webContactDetails = {
          IDDCLanguage: language.IDMDLanguage,
          IDMMCountry: 'BE',
          PrimaryEmail: email,
          FirstName: firstName,
          LastName: lastName,
          DateOfBirth: formatDate(dateOfBirth),
          IDMMGender: gender || null, // TODO: this currently causes DBExceptions when omitted
          SocioDemo: '',
          PostCode: '1000', // Requires a value
          City: 'Unspecified', // Requires a value
          StreetAddress: 'Unspecified', // Requires a value
          MarketingTopicList: '',
          MarketingChannelList: '',
          ReturnURL: returnUrl
        };
        return self.invokeLNB('RegisterWebContact', {
          customerWebContactDetails: webContactDetails,
          IsPending: false
        })
          .then(
          function (result) {
            return result;
          });
      };
      this.userService.GetWebContactPersonalDetails = function (id, key) {
        return contactsService.userService.GetWebContactPersonalDetails(id, key);
      };
      this.userService.HandleContact = function (action, id, key) {
        return contactsService.userService.HandleContact(action, id, key);
      };
      this.checkUserData = function (userData) {
        var details = {
          PersonalNumber: userData.nationalNumber && userData.nationalNumber.toString().replace(/[^0-9]/g, '') || null,
          LastName: userData.lastName,
          FirstName: userData.firstName,
          PrimaryEmail: userData.email,
          IDMDLanguage: language.IDMDLanguage
        };
        return self.invokeLNB('CheckCustomerData', details, {noErrorMatching: true})
          .then(
          function (result) {
            return result;
          }, function (error) {
            return error;
          });
      }.operationProgress('registerCustomer');
      this.registerCustomer = function (userData, createContact) {
        var re = new RegExp('[ ]+', 'g'),
          details = {oRegistrationDetails: {
            IDMMGender: userData.gender,
            FirstName: userData.firstName,
            LastName: userData.lastName,
            StreetAddress: userData.streetName,
            PostCode: userData.postalCode.toString(),
            City: userData.community,
            DateOfBirth: formatDate(userData.dateOfBirth),
            HomePhone: userData.homePhone || null,
            MobilePhone: userData.gsmNumber && userData.gsmNumber.toString().replace(re, ' ') || null,
            PrimaryEmail: userData.email,
            UserName: userData.email,
            IsNoCorrespondence: false,
            IDDCLanguage: language.IDMDLanguage,
            IDMMCurrency: 'EUR',
            IDMMCountry: 'BE',
            IDMMIDType: 'FI',
            Password: userData.password,
            IDDCSecurityQuestion: null,
            SecurityAnswer: null,
            Salutation: userData.salutation,
            IsTermsAndConditionsAgreed: userData.registrationAcceptTnC,
            AffiliateCode: null,
            PromotionCode: null,
            SocioDemo: '',
            IBAN: userData.bankAccount.replace(/[-. ]/g, ''),
            InstructionType: 'BENAT',
            Section: isPhone ? 'MOBILESITE' : 'TABLETSITE'
          },
            IDMMCustomer: 0,
            isContact: false,
            createContact: createContact,
            pMarketingChannelList: userData.registrationNewsletter ? defaultNewsletterPreferences.pMarketingChannelList : '',
            pMarketingTopicList: userData.registrationNewsletter ? userData.marketingtopiclist || defaultNewsletterPreferences.pMarketingTopicList : '',
            emailkey: '',
            isRegisterToBelgianGamingComission: userData.registrationBGC ? true : false,
            pNumber: userData.nationalNumber.toString().replace(/[^0-9]/g, ''),
            placeOfBirth: userData.placeOfBirth || '',
            profession: userData.profession || '',
            IDMDLanguage: language.IDMDLanguage
          };
        return self.invokeLNB('RegisterCustomer', details, {
          noErrorMatching: true
        })
          .then(
          function (result) {
            return result;
          }, function (error) {
            return error;
          });
      }.operationProgress('registerCustomer');
    }
  ])
  .value('prefilledUserData', false)
  .service('registrationDataBank', ['prefilledUserData',
    function (prefilledUserData) {
      var step, registrationDetails,
        stepSubmitted = [true, false, false, false, false];
      this.clearDetails = function () {
        var i;
        step = 0;
        registrationDetails = { $error: {} };
        if (prefilledUserData) {
          for (i in prefilledUserData) {
            registrationDetails[i] = prefilledUserData[i];
          }
        }
      };
      this.clearDetails();
      this.getStep = function () {
        return step;
      };
      this.setStep = function (s) {
        step = s;
      };
      this.getDetails = function () {
        return registrationDetails;
      };
      this.setDetails = function (details) {
        registrationDetails = details;
      };
      this.setContactDetails = function (details) {
        var d;
        for (d in details) {
          registrationDetails[d] = registrationDetails[d] || details[d];
        }
      };
      this.getStepSubmited = function () {
        return stepSubmitted;
      };
      this.setStepSubmited = function (s) {
        var i;
        stepSubmitted[s] = true;
        for (i = s + 1 || 1; i < stepSubmitted.length; i++) {
          stepSubmitted[i] = false;
        }
        return stepSubmitted;
      };
    }
  ])
  .service('registrationError',
  [
    function () {
      var data = {};
      this.getError = function () {
        return data;
      };
      this.setError = function (err) {
        data = err;
      };
    }])
  .service('contactsService',
  ['rpcService', 'language', 'userService',
    function (rpcService, language, userService) {
      var self = this, formatDate;
      this.userService = {};
      this.invokeLNB = rpcService.invoke.bind(rpcService, 'LNBUserService');
      formatDate = function (date) {
        return date;
      };
      this.userService.GetWebContactPersonalDetails = function (id, key) {
        return userService.invoke(
          'GetWebContactPersonalDetails',
          {
            emailkey: key,
            idmmcustomer: id
          },
          {noErrorMatching: true}
        )
          .then(
          function (result) {
            return result;
          }, function (error) {
            return error;
          });
      };
      this.userService.UpdateContactDetails = function (id, key, email, gender, firstName, lastName, streetAddress, postCode, city, dob) {
        var webContactDetails = {
          IDDCLanguage: language.IDMDLanguage,
          PrimaryEmail: email,
          IDMMGender: gender,
          FirstName: firstName,
          LastName: lastName,
          StreetAddress: streetAddress,
          PostCode: postCode,
          City: city,
          IDMMCountry: 'BE',
          DateOfBirth: dob,
          SocioDemo: '',
          MarketingTopicList: ''
        };
        return self.invokeLNB(
          'UpdateContactDetails',
          {
            IDMMCustomer: id,
            emailkey: key,
            webContactDetails: webContactDetails
          },
          {noErrorMatching: true}
        )
          .then(
          function (result) {
            return result;
          },
          function (errorResult) {
            return errorResult;
          });
      };
      this.userService.HandleContact = function (action, id, key) {
        return self.invokeLNB(
          action,
          {
            IDMMCustomer: id,
            emailkey: key
          },
          {noErrorMatching: true}
        )
          .then(
          function (result) {
            return result;
          },
          function (errorResult) {
            return errorResult;
          });
      };
    }]
);
