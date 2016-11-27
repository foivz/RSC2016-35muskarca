angular.module('mainModule')
  .service('formDataValidationService',
  ['checkPasswordStrengthService', 'bankAccountValidationService',
    function (checkPasswordStrengthService, BankAccountValidationService) {
      this.isEmailValid = function (emailAdress) {
        var re, isValid;
        if (!emailAdress) {
          return;
        }
        re = /^[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z_+])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9}$/;
        isValid = re.test(emailAdress);
        return isValid;
      };
      this.doesMatch = function (input1, input2) {
        if (!input1) {
          return false;
        }
        return input1 && input1 === input2;
      };
      this.checkPasswordStrength = function (password, minPasswordLength) {
        return checkPasswordStrengthService.checkPasswordStrength(password, minPasswordLength);
      };
      this.isValidBAN = function (v) {
        var isValidIBAN, isValidBBAN;
        if (!v) {
          return;
        }
        isValidIBAN = BankAccountValidationService.patterns.IBAN(v);
        isValidBBAN = BankAccountValidationService.patterns.BBAN(v);
        return isValidIBAN || isValidBBAN;
      };
    }])
  .service('checkPasswordStrengthService',
  [
    function () {
      this.checkPasswordStrength = function (password, minPasswordLength) {
        var passwordStrength, charsInPassword, baseScore, score, numExcess, numUpper, numNumbers, numSymbols, bonusExcess,
          bonusUpper, bonusNumbers, bonusSymbols, bonusCombo, bonusFlatLower, bonusFlatNumber, i, ps, regexUpperCaseLetters,
          regexNumbers, regexSymbols, regexAllLowerCaseLetters, regexAllNumbers;
        if (!password) {
          return 0;
        }
        passwordStrength = {
          NotChecked: 0,
          Insufficient: 1,
          Weak: 50,
          Average: 75,
          Strong: 100,
          Secure: 1000
        };
        minPasswordLength = minPasswordLength || 6;
        charsInPassword = password.split('');
        baseScore = 0;
        score = 0;
        //  number of characters above min limit
        numExcess = 0;
        //  number of upper-case letters
        numUpper = 0;
        //  number of numbers
        numNumbers = 0;
        //  number of special symbols
        numSymbols = 0;
        //  bonus score for extra characters
        bonusExcess = 3;
        //  bonus score for upper-case letters
        bonusUpper = 4;
        //  bonus score for numbers
        bonusNumbers = 5;
        //  bonus score for symbols
        bonusSymbols = 5;
        //  bonus for combinations
        bonusCombo = 0;
        //  penalty for only lower case letters
        bonusFlatLower = 0;
        //  penalty for only numbers
        bonusFlatNumber = 0;
        //  password strength
        ps = passwordStrength.NotChecked;
        if (password.length > 0 && charsInPassword.length < minPasswordLength) {
          baseScore = 0;
          ps = passwordStrength.Insufficient;
        } else if (charsInPassword.length >= minPasswordLength) {
          baseScore = 50;
          //  analyze password string
          regexUpperCaseLetters = /[A-Z]$/;
          regexNumbers = /[0-9]$/;
          regexSymbols = /(.*[!,@,#,$,%,^,&,*,?,_,~])$/;
          for (i = 0; i < charsInPassword.length; i++) {
            if (regexUpperCaseLetters.test(charsInPassword[i])) {
              numUpper++;
            }
            if (regexNumbers.test(charsInPassword[i])) {
              numNumbers++;
            }
            if (regexSymbols.test(charsInPassword[i])) {
              numSymbols++;
            }
          }
          numExcess = charsInPassword.length - minPasswordLength;
          if (numUpper > 0 && numNumbers > 0 && numSymbols > 0) {
            bonusCombo = 25;
          } else if ((numUpper > 0 && numNumbers > 0) || (numUpper > 0 && numSymbols > 0) || (numNumbers > 0 && numSymbols > 0)) {
            bonusCombo = 15;
          }
          regexAllLowerCaseLetters = /^[\sa-z]+$/;
          if (regexAllLowerCaseLetters.test(password)) {
            bonusFlatLower = -15;
          }
          regexAllNumbers = /^[\s0-9]+$/;
          if (regexAllNumbers.test(password)) {
            bonusFlatNumber = -35;
          }
          //  calculate complexity
          score = baseScore + (numExcess * bonusExcess) + (numUpper * bonusUpper) + (numNumbers * bonusNumbers) + (numSymbols * bonusSymbols) + bonusCombo + bonusFlatLower + bonusFlatNumber;
          //  figure out the strength
          if (score <= passwordStrength.Weak) {
            ps = passwordStrength.Weak;
          } else if (score <= passwordStrength.Average) {
            ps = passwordStrength.Average;
          } else if (score <= passwordStrength.Strong) {
            ps = passwordStrength.Strong;
          } else if (score > passwordStrength.Strong) {
            ps = passwordStrength.Secure;
          }
        }
        return {
          ps: ps,
          valid: ps >= passwordStrength.Average ? true : false
        };
      };
    }]);
