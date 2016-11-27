angular.module('common')
  .service('pagingComponentService', [function () {
    var self = this;
    self.pagingData = {};
    self.setPagingInfo = function (pageSize, stateName, maxPage, currentPage) {
      self.pagingData.pageSize = pageSize;
      self.pagingData.currentPage = currentPage;
      self.pagingData.stateName = stateName;
      self.pagingData.maxPage = maxPage;
      self.pagingData.numOfTransactions = self.maxPage * self.pageSize;
      self.pagingData.isFetching = false;
      self.pagingData.numOfPages = maxPage + 1;
      self.pagingData.lastPage = self.pagingData.numOfPages;
    };
    self.getPagingData = function () {
      return self.pagingData;
    };
  }])
  .component('pagingComponent', {
    templateUrl: 'common/paging/pagingComponent.html',
    controller: ['$scope', 'pagingComponentService', function ($scope, pagingComponentService) {
      var self = this;
      self.pagingData = pagingComponentService.getPagingData();
      self.getPageNumber = function (num) {
        return new Array(num);
      };
      self.fetchPage = function () {
      };
      self.fetchNextPage = function () {
      };
      self.fetchPreviousPage = function () {
      };
    }]
  });
