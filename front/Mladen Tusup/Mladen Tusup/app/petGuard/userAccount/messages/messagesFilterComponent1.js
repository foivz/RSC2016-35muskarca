angular.module('petGuard')
  .component('lnbMessagesFilter', {
      templateUrl: 'pws/playerAccount/messages/messagesFilter.html',
      controller: ['messagesService', '$state', function (messagesService, $state) {
        var self = this,
            categoryId,
            typesSelect = [],
            defaultType = {OfferId: -1, OfferName: 'Message'},
            allTypes = {OfferId: null, OfferName: 'mmcore.messages.filter.showAll'},
            init = function () {
              typesSelect.push(defaultType);
              self.types = typesSelect;
              categoryId = -1;
              self.typeId = -1;
              self.dateFrom = messagesService.dateFrom;
              self.dateTo = messagesService.dateTo;
              self.selectedCategory = -1;
            };

        self.categoryId = function (value) {
          var currentCategory;
          if (arguments.length) {
            categoryId = value;
            self.selectedCategory = value;
            if (value === -1) {
              self.typeId = -1;
            } else {
              self.typeId = null;
            }
            currentCategory = messagesService.categoriesWithOffer.find(function (category) {
              return category.CategoryId === categoryId;
            });
            typesSelect = [];
            self.types = [];
            if (value === -1) {
              typesSelect.push(defaultType);
              self.types = typesSelect;
              //typesSelect.splice(typesSelect.indexOf('All');
            } else {
              typesSelect.push(allTypes);
              self.types = typesSelect.concat(currentCategory && currentCategory.Offers || []);
            }
          }
          return categoryId;
        };

        self.filter = function (form, typeId, dateFrom, dateTo) {
          typeId = typeId || categoryId && messagesService.categoriesWithOffer
                  .find(function (category) {
                    return category.CategoryId === categoryId;
                  }).Offers
                  .map(function (offer) {
                    return offer.OfferId;
                  })
                  .join(',');
          messagesService.applyFilter(typeId, dateFrom, dateTo, messagesService.undeliveredMessagesOnly);
          $state.go('app.pws.messages');
        };
        self.cancel = function () {
          messagesService.resetFilter(messagesService.undeliveredMessagesOnly);
          init();
        };

        self.messagesService = messagesService;
        self.types = typesSelect;
        if (!messagesService.categoriesWithOffer.length) {
          messagesService.fetchAllCategoriesWithOffer();
        }
        init();
      }]
    });
