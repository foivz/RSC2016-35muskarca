angular.module('petGuard')
  .service('messagesService', ['$rootScope', 'rpcService', function ($rootScope, rpcService) {
    var self = this,
      allCategories = [{categoryId: -1, categoryName: 'Subject'}, { categoryId: null, categoryName: 'mmcore.messages.filter.showAll'}], invoke, formatDate, countUndeliveredMessages, fetchMessages;

    invoke = rpcService.invoke.bind(rpcService, 'GamingNotificationService');

    formatDate = function (date) {
      return (date && (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds())) || null;
    };

    countUndeliveredMessages = function () {
      return invoke('CountUndeliveredPopupMessages', {})
        .then(function (result) {
          self.undeliveredMessages = result;
        });
    };

    this.fetchNextPage = function () {
      if (self.hasMoreMessages) {
        self.page++;
        fetchMessages();
      }
    };

    this.showMessagesFilter = false;
    this.showHideFilter = function () {
      this.showMessagesFilter = !this.showMessagesFilter;
      return this.showMessagesFilter;
    };

    fetchMessages = function () {
      countUndeliveredMessages();
      return invoke('GetMessageLog', {
        offerId: self.typeId || null,
        channel: 'POPUP',
        dateFrom: formatDate(self.dateFrom),
        dateTo: formatDate(self.dateTo),
        deliveryStatus: self.undeliveredMessagesOnly ? 'NOT_DELIVERED' : 'ALL',
        orderBy: 'TIME_CREATED',
        orderType: 'DSC',
        page: self.page,
        size: 10
      }).then(function (result) {
        self.messages = self.messages.concat(result.Messages || []);
        self.hasMoreMessages = self.messages.length < result.TotalCount;
      });
    }.preventSimultaneous().operationProgress('fetchMessages');

    self.resetFilter = function (undeliveredMessagesOnly) {
      var manyMoonsAgo = new Date(2015, 0), oneMonthAgo = new Date(), tomorrow = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      tomorrow.setDate(tomorrow.getDate() + 1);
      self.applyFilter(null, undeliveredMessagesOnly ? manyMoonsAgo : oneMonthAgo, tomorrow, undeliveredMessagesOnly);
    };

    self.applyFilter = function (typeId, dateFrom, dateTo, undeliveredMessagesOnly) {
      self.typeId = typeId;
      self.dateFrom = dateFrom;
      self.dateTo = dateTo;
      self.undeliveredMessagesOnly = undeliveredMessagesOnly;
      self.page = 0;
      self.messages = [];
      delete self.hasMoreMessages;
      fetchMessages();
    };

    self.showMessageDetails = function (messageID) {
      self.messageIDs['messageDetail' + messageID] = !self.messageIDs['messageDetail' + messageID];
      // console.log('messageDetail' + messageID);
    };

    self.messages = [];
    self.messageIDs = {};
    self.categoriesWithOffer = [];
    self.categories = allCategories;

    self.fetchAllCategoriesWithOffer = function () {
      return invoke('GetAllCategoriesWithOffer', {})
          .then(function (result) {
            self.categoriesWithOffer = result;
            self.categories = allCategories.concat(self.categoriesWithOffer.map(function (category) {
              return {
                categoryId: category.CategoryId,
                categoryName: category.Name
              };
            }));
          });
    };

    self.markAsRead = function (message) {
      if (message.Status === 'NOT_DELIVERED') {
        return invoke('MarkAsRead', { messageId: message.Id })
            .then(function () {
              self.messages
                  .forEach(function (msg) {
                    if (msg.Id === message.Id) {
                      msg.Status = 'DELIVERED';
                    }
                  });
              countUndeliveredMessages();
            });
      }
    };

    // self.resetFilter(true);

    $rootScope.$watch('isLoggedIn', function (isLoggedIn) {
      if (isLoggedIn) {
        countUndeliveredMessages();
      } else {
        delete self.undeliveredMessages;
        self.messages = [];
      }
    });
  }]);

