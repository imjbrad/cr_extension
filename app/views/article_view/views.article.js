'use strict';

angular.module('cr.views.article', [
    'cr.services.api',
    'cr.services.auth',
    'cr.services.alerts',
    'cr.directives.insight',
    'cr.directives.question',
    'ui.bootstrap',
    'angular-storage'
])

    .controller('ArticleViewCtrl', function($scope, Article, Question, CRAuth, $filter, $http, CRAlerts, store) {

        function _paginate(questionResults) {
            console.log(questionResults);
            $scope.currentQuestionPage = questionResults.current_page;
            $scope.currentQuestionSet = $scope.article.questions[$scope.currentQuestionPage] = questionResults;
            $scope.questionCount = questionResults.count;
            $scope.questionsPerPage = questionResults.per_page;
        }

        function _getNextQuestionSet() {
            if ($scope.currentQuestionSet.next){

                $http.defaults.headers.common.Authorization = "JWT "+CRAuth.current_user.token;
                $http.get($scope.currentQuestionSet.next)
                    .success(function(data){
                        _paginate(data);
                    })
                    .error(function(error){
                        console.log(error);
                    });
            }
        }

        $scope.article_id = 34;

        Article.get({ article_id: $scope.article_id },
            function (result) {


                $scope.article = result;
                $scope.article.insight_votes = result.insight_votes.insight_votes;

                $scope.questionPageChange = function() {
                    console.log('Page changed to: ' + $scope.currentQuestionPage);
                    $scope.currentQuestionSet = $scope.article.questions[$scope.currentQuestionPage] || _getNextQuestionSet();
                };

                $scope.$watch('questionFilter.selected', function() {
                    console.log("Filter changed to: "+$scope.questionFilter.selected);

                    Question.all({article_id: $scope.article_id, filter: $scope.questionFilter.selected},

                        function(data){

                            _paginate(data);

                        }, function(error){
                            console.log(error);
                        });
                });

                $scope.questionFilter = {
                    selected: "",
                    orderBy: ['answered', 'upvotes']
                };

                $scope.askQuestion = function(isValid) {

                    if (isValid) {
                        var question = Question.send({article_id: 34}, {title: $scope.question.title},
                            function(data){
                                $scope.article.questions.push(question);
                                $scope.questionForm.$setPristine();
                                $scope.question = {};
                            },function(error){
                                console.log(error);
                            });
                    }
                };

            });

            },function(error){
                console.log("Error Fetching Article");
                console.log(error);
            });