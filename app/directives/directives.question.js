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
            link: function($scope, element, attr, $interval) {

                if($scope.question.following){
                    $scope.current_follow = $scope.question.following;
                    $scope.following = 1;
                }

                if($scope.question.upvoted){
                    $scope.upvoted = 1;
                    $scope.current_upvote = $scope.question.upvoted;
                }

            }
        };
    })

    .controller('QuestionCtrl', function($scope, CRAuth, Question, $timeout, $interval){
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

        $scope.toggle_upvote = function() {

            console.log("User has interacted with upvote button");

            if($scope.upvoted){

                console.log("Simulating Upvote");
                $scope.question.upvotes += 1;

                if(!$scope.current_upvote){

                    Question.upvote({article_id: 34, question_id: $scope.question.pk}, {})
                        .$promise.then(
                        function(data){
                            $scope.current_upvote = data.pk;
                            console.log("Upvoted Question");

                        },function(error){
                            console.log(error);
                        });
                }
            }else{

                console.log("Simulating Revoke");
                if ($scope.question.upvotes > 0)
                    $scope.question.upvotes -= 1;

                if($scope.current_upvote){

                    Question.revokeUpvote({article_id: 34, question_id: $scope.question.pk, upvote_id: $scope.current_upvote}, {})
                        .$promise.then(
                        function(data){
                            console.log("Revoked Upvote");
                            $scope.current_upvote = null;
                        },function(error){
                            console.log(error);
                        });
                }
            }

        };

        $scope.toggle_follow = function(){

            if($scope.following){
                console.log("Simulating following");
                $scope.question.following = true;

                if(!$scope.current_follow){
                    Question.follow({article_id: 34, question_id: $scope.question.pk}, {})
                    .$promise.then(
                    function(data){
                        console.log("Followed");
                        $scope.current_follow = data.pk;
                        $scope.question.following = data.pk; //when the follow is posted, set the actual value
                    },function(error){
                        console.log(error);
                    });
                }
            }else{
                if($scope.current_follow){
                    console.log("Simulating unfollow");
                    $scope.question.following = false;

                    Question.revokeFollow({article_id: 34, question_id: $scope.question.pk, follow_id: $scope.current_follow}, {})
                        .$promise.then(
                        function(data){
                            console.log("Revoked Follow");
                            $scope.current_follow = null;
                        },function(error){
                            console.log(error);
                        });
                }
            }


        };

    });