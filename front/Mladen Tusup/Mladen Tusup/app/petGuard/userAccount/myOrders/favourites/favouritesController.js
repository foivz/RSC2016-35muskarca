 angular.module('petGuard')
  .controller('FavouritesCtrl', ['$scope', 'favouritesService', function ($scope, favouritesService) {
    $scope.showDetails = false;
    $scope.favouritesService = favouritesService;
    $scope.showHideDetails = function (favourite) {
      $scope.showDetails = !$scope.showDetails;
      favourite.visible = !favourite.visible;
    };
    $scope.listOfFavouriteGames = $scope.favouritesService.getFavourites();
    $scope.updateGameAlias = function (favourite, alias) {
      favourite.alias = alias;
      $scope.favouritesService.updateGameAlias(favourite);
    };
    $scope.deleteFavourite = function (favourite) {
      $scope.favouritesService.deleteFavourite(favourite);
    };
  }]);
