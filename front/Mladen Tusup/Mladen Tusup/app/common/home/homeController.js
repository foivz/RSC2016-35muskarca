/**
 * Created by Mladen on 11/13/16.
 */
angular.module('common')
    .controller('homeController', ['$scope', '$mdDialog', '$rootScope', '$cookies', function ($scope, $mdDialog, $rootScope, $cookies) {
    
       if ($cookies.get('globals')) {  
           $scope.userData = JSON.parse($cookies.get('globals'));
           $scope.fullname = $scope.userData.currentUser.fullname;
       }
//     
        
     //$scope.$on('$destroy', listener);
//  $scope.showLoginModal = function(ev) {
//    $mdDialog.show({
//      controller: LoginModalController,
//      templateUrl: 'common/home/loginModal.html',
//      parent: angular.element(document.body),
//      targetEvent: ev,
//      clickOutsideToClose:true,
//      disableBodyVerticalScroll: true
//    })
//    .then(function(answer) {
//      
//    }, function() {
//      
//    });
//  };
//    function LoginModalController($scope, $mdDialog) {
//    $scope.hide = function() {
//      $mdDialog.hide();
//    };
//
//    $scope.cancel = function() {
//      $mdDialog.cancel();
//    };
//
//    $scope.answer = function(answer) {
//      $mdDialog.hide(answer);
//    };
//  }
}]);