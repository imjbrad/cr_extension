'use strict';

angular.module('cr.views.article', [
    'cr.services.api',
    'cr.services.auth',
    'cr.services.alerts',
    'cr.services.chrome',
    'cr.directives.insight',
    'cr.directives.question',
    'ui.bootstrap',
    'angular-storage'
])

    .controller('ArticleViewCtrl', function($scope, Article, Question, CRAuth, $filter, $http, CRChrome, $state) {

        function init(url){

            console.log("Searching for Article");

            $scope.article_url = url;
            //$scope.article_id = 34;

            Article.get({url: $scope.article_url},
                function (result) {

                    $scope.article = result;
                    $scope.article_id = result.pk;
                    $scope.article.insight_votes = result.insight_votes;

                    $scope.insightFilter = {
                        overall: {'category': 'ov'},
                        top: {category: 'top'}
                    };

                    $scope.questionSet = [];
                    $scope.questionSet.allQuestions = [];
                    $scope.question = {};

                    $scope.questionFilter = {
                        selected: "",
                        answered: {'answered': true},
                        me: {'user': CRAuth.current_user ? CRAuth.current_user.pk : null},
                        orderBy: ['answered', 'upvotes']
                    };

                    $scope.getMoreQuestions = function() {
                        if ($scope.questionSet.next){

                            $http.get($scope.questionSet.next)
                                .success(function(data){
                                    var allQuestions = $scope.questionSet.allQuestions.concat(data.results);

                                    $scope.questionSet = data;
                                    $scope.questionSet.allQuestions = allQuestions;
                                })
                                .error(function(error){
                                    console.log(error);
                                });
                        }
                    };

                    $scope.getQuestions = function() {
                        if (!$scope.questionSet.length){
                            Question.all({article_id: $scope.article_id}, function(data){
                                console.log(data);
                                $scope.questionSet = data;
                                $scope.questionSet.allQuestions = data.results;
                            }, function(error){
                                console.log(error);
                            })
                        }else{
                            $scope.getMoreQuestions();
                        }
                    };

                    $scope.askQuestion = function(isValid) {

                        if (isValid) {
                            var question = Question.ask({article_id: $scope.article_id}, {title: $scope.question.title},
                                function(data){
                                    $scope.questionSet.allQuestions.push(question);
                                    $scope.questionForm.$setPristine();
                                    $scope.question = {};
                                },function(error){
                                    console.log(error);
                                });
                        }
                    };

                    $scope.getQuestions();


                },function(error){
                    console.log(error);
                    redirect();
                });
        }

        function redirect(){
            console.log("Article Not Found");
            $state.go("article404", {url: $scope.article_url});
        }

        CRChrome.getCurrentUrl(init);
        //init()
});