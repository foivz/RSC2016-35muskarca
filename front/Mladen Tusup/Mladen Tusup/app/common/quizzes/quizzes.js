(function () {
    'use strict';
 
    angular
        .module('common')
        .controller('quizzes', Quizzes);
 
    Quizzes.$inject = ['activeQuizzes', '$scope', '$http', 'RESTAPI', '$cookies'];
    function Quizzes(activeQuizzes, $scope, $http, RESTAPI,$cookies) {
        var token = JSON.parse($cookies.get('globals'));
        $scope.activeQuizzes = activeQuizzes.data.payload;
        $scope.startQuiz = function (quizId, index) {
            $http.get(RESTAPI+'/quiz/'+quizId)
                    .success(function (response) {
                    $scope.started = true;
                    $scope.selected = index;
                });
        };
    }
 
})();