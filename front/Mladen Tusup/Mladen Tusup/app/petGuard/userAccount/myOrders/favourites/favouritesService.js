angular.module('petGuard')
.service('favouritesService', ['$rootScope', '$q', 'rpcService', 'language',
    function ($rootScope, $q, rpcService, language) {
      var
      invokeFavourites = rpcService.invoke.bind(rpcService, 'DGEService'),
      self = this;
      self.listOfFavouriteGames = [];
      self.getFavourites = function () {
        var response = invokeFavourites('getFavoriteWagersForGames', {
            externalGameIds : ['Lotto6','Elot','JokerPlus','Keno','Pick3','SuperLotto'],
            IDMDLanguage : language.IDMDLanguage
          });
        self.isFetching = true;
        self.listOfFavouriteGames = [];
        response.then(function (result) {
          if (!result) {
            return;
          }
          self.isFetching = false;
          angular.forEach(result, function (favourite) {
            favourite.totalStake = favourite.TotalStake;
            favourite.timesPlayed = favourite.EditionCount;
            favourite.gameName = favourite.Game.Name;
            favourite.alias = favourite.Alias;
            favourite.gameBoardStacks = favourite.BoardStacks;
            favourite.gameBoardStacks.forEach(function (boardStack) {
              if (boardStack.GameId === 'Elot' && boardStack.PickValues !== '') {
                boardStack.oldPickValues = boardStack.PickValues;
                boardStack.PickValues = self.parseRafflePickValues(boardStack.PickValues);
              }
              boardStack.Boards.forEach(function (board) {
              board.oldPickValues = board.PickValues;
              board.PickValues = self.parsePickValues(boardStack.GameId, board.PickValues, board.PickSystem);
            });
            });
            favourite.hasDetails = favourite.gameBoardStacks.length === 0 ? false : true;
            favourite.visible = false;
            favourite.wagerId = favourite.FavoriteWagerId;
            favourite.isDefault = favourite.IsDefault;
            self.listOfFavouriteGames.push(favourite);
          });
          self.hasMoreFavourites = self.listOfFavouriteGames.length < result.length;
          self.listOfFavouriteGames
             .sort(function (a, b) {
              var nameA = a.alias.toUpperCase(),
              nameB = b.alias.toUpperCase();
              if (nameA > nameB) {
                return 1;
              }
              if (nameA < nameB) {
                return -1;
              }
              return 0;
            });
        }, function errorFunction() {
          self.isFetching = false;
        });
        return self.listOfFavouriteGames;
      };
      self.updateGameAlias = function (favourite) {
        return invokeFavourites('updateDefaultFavoriteWager', {
            wagerId : favourite.wagerId,
            isDefault : favourite.isDefault,
            alias : favourite.alias,
            IDMDLanguage : language.IDMDLanguage
          });
      };
      self.deleteFavourite = function (favourite) {
        var favIndex = self.listOfFavouriteGames.indexOf(favourite),
        response = invokeFavourites('deleteFavoriteWager', {
          wagerFavoriteId : favourite.wagerId,
          IDMDLanguage : language.IDMDLanguage
        });
        response.then(function () {
        });
        if (favIndex > -1) {
          self.listOfFavouriteGames.splice(favIndex, 1);
        }
      };
      self.parsePickValues = function (gameId, pickValues, pickSystem) {
        var pickSplit = pickValues.split(':'),
        transformPickElement,
        splitAndTransformPickElements,
        fixedNumbers = 0,
        variableNumbers = 0,
        systemMatch = pickSystem ? pickSystem.match(/^f(\d+)v(\d+)$/) : null;
        if (systemMatch) {
          fixedNumbers = parseInt(systemMatch[1]);
          variableNumbers = parseInt(systemMatch[2]);
        }
        transformPickElement = function (element, index) {
          return {
            value : element.split(':')[0],
            matching : false,
            type : index < fixedNumbers ? 'fixed' : index < (fixedNumbers + variableNumbers) ? 'variable' : 'standard'
          };
        };
        splitAndTransformPickElements = function (elements) {
          return elements.split(',').map(transformPickElement);
        };
        switch (gameId) {
        case 'Elot':
          return {
            numbers : splitAndTransformPickElements(pickSplit[0]),
            stars : splitAndTransformPickElements(pickSplit[1])
          };
        case 'JokerPlus':
          return {
            numbers : splitAndTransformPickElements(pickSplit[0]),
            zodiac : transformPickElement(pickSplit[1])
          };
        default:
          return splitAndTransformPickElements(pickValues);
        }
      };
      self.parseRafflePickValues = function (pickValues) {
        var pickSplit = pickValues.split(':');
        if (pickSplit.length === 3) {
          return {
            firstnumber : pickSplit[0],
            secondnumber : pickSplit[1],
            numberdraws : parseInt(pickSplit[2]),
            rafflefrom : pickSplit[0].substr(0, 1) + ' ' + pickSplit[0].substr(1, 3) + ' ' + pickSplit[0].substr(4, 5),
            raffleto : pickSplit[1].substr(0, 1) + ' ' + pickSplit[1].substr(1, 3) + ' ' + pickSplit[1].substr(4, 5),
            numbercodes : parseInt(Number(pickSplit[1].substr(4, 5)) - Number(pickSplit[0].substr(4, 5)) + 1)
          };
        }
        return {
          firstnumber : '',
          secondnumber : '',
          numberdraws : 0,
          rafflefrom : '',
          raffleto : '',
          numbercodes : 0
        };
      };
    }
]);
