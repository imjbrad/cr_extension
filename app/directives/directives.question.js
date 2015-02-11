/**
 * Created by jordanbradley on 1/23/15.
 */
angular.module('cr.directives.question', ['cr.services.api'])

    .directive('question', function(){
        return {
            restrict: 'E',
            replace: false,
            scope: {
                question: '='
            },
            controller: 'QuestionCtrl',
            templateUrl: '/app/directives/question.html',
            link: function(scope, element, attr) {
            }
        };
    })

    .controller('QuestionCtrl', function($scope, CRAuth, Question, $timeout){

        function _simulateUpvote(){
            $scope.question.upvotes += 1;
            $scope.upvote = {pk:true};
        }

        function _simulateRevokeUpvote() {
            $scope.question.upvotes -= 1;
            $scope.upvote = {pk:false};
        }

        function _init(){
            Question.findUpvote({article_id: 34, question_id: $scope.question.pk}, {},
            function(data){
                console.log("Found existing upvote for question "+$scope.question.pk);
                $scope.upvote = {pk: data.pk};

            },function(error){
                console.log("Couldn't find existing upvote");
            });
    }

        $scope.upvote = {
            pk: false
        };

        $scope.isQuestionOwner = (CRAuth.current_user) ? ($scope.question.user == CRAuth.current_user.pk) : false;

        $scope.deleteQuestion = function() {

            Question.delete({article_id: 34, question_id: $scope.question.pk})
                .$promise.then(
                function(data){
                    $scope.question.pk = null;
                    console.log(data)

                },function(error){
                    console.log(error);
                });

        };

        $scope.upvoteClick = function() {
            if(!$scope.upvote.pk){
                $timeout(function(){
                    Question.postUpvote({article_id: 34, question_id: $scope.question.pk}, {})
                        .$promise.then(
                        function(data){
                            $scope.upvote = {pk:data.pk};
                            console.log("Upvoted Question");
                        },function(error){
                            console.log(error);
                        });
                }, 500);

                _simulateUpvote();

            }else{
                console.log("Should revoke upvote");
                Question.revokeUpvote({article_id: 34, question_id: $scope.question.pk, upvote_id: $scope.upvote.pk}, {})
                    .$promise.then(
                    function(data){
                        console.log("Revoked Upvote");

                    },function(error){
                        console.log(error);
                    });

                _simulateRevokeUpvote();
            }
        };

        $scope.followQuestion = function() {

        };

        _init();
    });