angular.module('petGuard')
  .service('bankAccountValidationService', [
    function () {
      var isValidIBAN, isValidBBAN,
        countryCode = 'BE',
        self = this;
      //var accountNumber = 'BE 613-1012-698551-7';
      isValidIBAN = function (v) {
        var sum, ei, i;
        //This function check if the checksum if correct
        v = v.replace(/^(.{4})(.*)$/, '$2$1'); //Move the first 4 chars from left to the right
        v = v.replace(/[A-Z]/g, function (e) { //Convert A-Z to 10-25
          return e.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
        });
        sum = 0;
        ei = 1; //First exponent
        for (i = v.length - 1; i >= 0; i--) {
          sum += ei * parseInt(v.charAt(i), 10); //multiply the digit by it's exponent
          ei = (ei * 10) % 97; //compute next base 10 exponent in modulus 97
        }
        return sum % 97 === 1;
      };
      isValidBBAN = function (v) {
        var str, v10, v2;
        str = '' + v;
        if (v.length !== 12) {
          return false;
        }
        v10 = parseInt(str.substr(0, 10));
        v2 = parseInt(str.substr(10, str.length));
        return v10 % 97 === v2;
      };

      this.cleanNR = function (v) {
        v = v.toUpperCase();
        return v.replace(/[-. ]/g, '');
      };

      this.mod97 = function (digitString) {
        var m = 0, i;
        for (i = 0; i < digitString.length; ++i) {
          m = (m * 10 + parseInt(digitString.charAt(i).toString())) % 97;
        }
        return m;
      };

      this.calculateCheckDigits = function (bban, countryCode) {
        var lsMod, country, lsModIban, temp;
        lsMod = bban.substr(10, 2);
        country = countryCode.replace(/[A-Z]/g, function (e) { //Convert A-Z to 10-25
          return e.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
        });

        lsModIban = this.mod97(lsMod + lsMod + country + '00');
        temp = 98 - lsModIban;
        if (temp < 10) {
          return '0' + temp.toString();
        }
        return temp.toString();
      };

      this.convertToIBAN = function (bban) {
        if (bban.length !== 12) {
          return bban;
        }
        return countryCode + this.calculateCheckDigits(bban, countryCode) + bban;
      };

      this.patterns = {
        IBAN: function (v) {
          if (!v) {
            return;
          }
          v = self.cleanNR(v);
          return /^(?=[0-9A-Z]{16}$)BE\d{14}$/.test(v) && isValidIBAN(v);
        },
        BBAN: function (v) {
          if (!v) {
            return;
          }
          v = self.cleanNR(v);
          return /^(?=\d{12}$)\d{12}$/.test(v) && isValidBBAN(v);
        }
      };
    }
  ]);
