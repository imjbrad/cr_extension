'use strict';

angular.module('cr.views.article', ['cr.services.api', 'cr.services.alerts', 'cr.directives.insight', 'angular-storage'])

    .controller('ArticleViewCtrl', function($scope, Article, InsightVotes, $interval, $timeout, CRAlerts, store) {

        Article.get({ article_id: 34 }).$promise
            .then(function (result) {
                console.log(result);
                $scope.article = result;
                $scope.article.insight_votes = result.insight_votes.insight_votes;
                $interval(function() {
                    //InsightVotes.get({ article_id: $scope.article.pk })
                    //    .$promise.then(function(data){
                    //        console.log("Fetched Votes");
                    //        $scope.article.insight_votes = data.insight_votes;
                    //    });
                }, 10000);
            },function(error){
                console.log("Error Fetching Article");
                console.log(error);
            });
    });



