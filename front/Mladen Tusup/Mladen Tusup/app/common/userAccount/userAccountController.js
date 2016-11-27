(function () {
    'use strict';
 
    angular
        .module('common')
        .controller('userAccountController', UserAccountController);
 
    UserAccountController.$inject = ['$rootScope', '$scope', 'questions', 'quizzes', '$http', 'geolocationSvc', 'RESTAPI', '$cookies', '$state'];
    function UserAccountController($rootScope, $scope, questions, quizzes, $http, geolocationSvc, RESTAPI, $cookies, $state) {
        $scope.quiz = {};
        if ($cookies.get('globals')) {  
           $scope.userData = JSON.parse($cookies.get('globals'));
           $scope.fullname = $scope.userData.currentUser.fullname;
       }

        $scope.shouldCreateNewQuiz = false;
        $scope.createNewQuiz = function () {
            $scope.shouldCreateNewQuiz = !$scope.shouldCreateNewQuiz;
            $scope.shouldShowPreviousQuestions = false;
        };

        $scope.shouldShowPreviousQuestions = false;
        $scope.showPreviousQuestions = function () {
            $scope.shouldShowPreviousQuestions = !$scope.shouldShowPreviousQuestions;
        };
        $scope.shouldCreateNewQuestion = false;
        $scope.createNewQuestion = function () {
            $scope.shouldCreateNewQuestion = !$scope.shouldCreateNewQuestion;
        };
        $scope.createQuiz = function (form) {
            var token = JSON.parse($cookies.get('globals'));
        for (var i=0; i<$scope.selectedQuestions.length; i++) {    $scope.selectedQuestionsId.push($scope.selectedQuestions[i].idquestion);
                }
            geolocationSvc.getCurrentPosition().then(function (success) {
                $scope.quiz.latitude = success.coords.latitude;
                $scope.quiz.longitude = success.coords.longitude;
                $http.post(RESTAPI+'/quiz', { longitude: $scope.quiz.longitude, latitude: $scope.quiz.latitude, name: $scope.quiz.name, maxparticipants: $scope.quiz.numOfPlayers, startdate: $scope.quiz.startDate, enddate: $scope.quiz.endDate, token: token.token, questions: $scope.selectedQuestionsId })
                .success(function (response) {
                    $state.go('iQuiz.common.activeQuizzes');
                });
            });
 
        };
        
        $scope.currentDetails = [];
        //get questions
        $scope.questions = questions.data.payload;
        $scope.quizzes = quizzes.data.payload;
        
        $scope.shouldShowDetails = function (quizId, index) {
            $http.get(RESTAPI+'/quiz/admin/'+quizId)
                    .success(function (response) {
                    $scope.showDetails = index;
                $scope.currentDetails = response.payload;
                for(var i=0; i<$scope.currentDetails.length;i++) {
                    $scope.currentDetails[i].successRate = 
                         ($scope.currentDetails[i].good/$scope.currentDetails[i].count)*100;
                }
            });
        };
            
       
        $scope.returnSelected = function (question,id) {
           $scope.questions.push(question);
           $scope.selectedQuestions.splice(id, 1);
        };
        $scope.selectedQuestions = [];
        $scope.selectedQuestionsId = [];
        $scope.removeItem = function (id, question) {
           $scope.selectedQuestions.push(question);
           $scope.questions.splice(id, 1);
        };
    
}
    
})();