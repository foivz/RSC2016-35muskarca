angular.module('common')
.controller('contactUsController', ['$scope', '$rootScope', 'uiGmapGoogleMapApi', function ($scope, $rootScope, uiGmapGoogleMapApi) {
        
    $scope.bd = {
  northeast: {
    latitude: 44.789990,
    longitude: 20.483236
  },
  southwest: {
    latitude: 44.789990,
    longitude: 20.483236
  }
};
var areaLat      = 44.789990,
      areaLng      = 20.483236,
      areaZoom     = 7;

  uiGmapGoogleMapApi.then(function(maps) {
    $scope.map     = { center: { latitude: areaLat, longitude: areaLng }, zoom: areaZoom };
    $scope.options = { 
        scrollwheel: false, 
        streetViewControl: false,
        mapTypeControl: false,
        scaleControl: false,
        rotateControl: false,
        zoomControl: false 
    };
  });
    
}]);