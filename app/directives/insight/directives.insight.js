angular.module("cr.directives.insight", ['ui.bootstrap.buttons', 'cr.services.api', 'cr.services.alerts'])

    .directive("insightVotePanel", function() {
        return {
            restrict: 'EA',
            replace: false,
            scope: {
                insight: '=',
                btnRadio: '=',
                article: '=articlePk'
            },
            templateUrl: '/app/directives/insight/insight.html',
            controller: 'InsightVotePanelCtrl',
            link: function(scope, element, attr) {
            }
        };
    })

    .controller("InsightVotePanelCtrl", function($rootScope, $scope, Vote, $timeout, $state, CRAuth, $location, CRAlerts){

        function getVote(){
            if ($scope.insight.user_vote){
                $scope.currentVote = $scope.insight.user_vote;
                $scope.radioModel.selectedChoice = ''+$scope.currentVote.choice;
            }
        }

        function simulateVote(){
            console.log("simulating vote");
            var new_choice = $scope.radioModel.selectedChoice;
            $scope.insight.insight_votes[new_choice].count += 1;
            $scope.currentVote = {choice: new_choice};
            calculatePopularVote()
        }

        function simulateRevoke(swap){
            console.log("simulating revoke");
            if($scope.insight.insight_votes[$scope.currentVote.choice].count > 0){
                $scope.insight.insight_votes[$scope.currentVote.choice].count -= 1;
                $scope.currentVote = null;
            }
            if(!swap)
                $scope.radioModel.selectedChoice = null;
            calculatePopularVote()
        }

        function calculatePopularVote() {
            console.log("calculating popular vote");
            var max_count = 0,
                max_key = "";

            for (choice in $scope.insight.insight_votes) {
                if ($scope.insight.insight_votes[choice].count > max_count) {
                    max_count = $scope.insight.insight_votes[choice].count;
                    max_key = $scope.insight.insight_votes[choice].choice_display_name;
                } else if ($scope.insight.insight_votes[choice].count == max_count) {
                    max_key += ((max_key == "" && max_key.indexOf("/") == -1 ? " " : "/") + $scope.insight.insight_votes[choice].choice_display_name);
                    max_count = $scope.insight.insight_votes[choice].count
                }
            }

            if (max_count == 0) {
                max_key = "Contribute to \"" + $scope.insight.name.split("_").join(" ") + "\" first!";
            }

            $scope.insight.popular_choice = {"choice": max_key, "count": max_count};
        }

        $scope.revokable = ($scope.currentVote && $scope.currentVote.choice) ? true:false;

        $scope.revoke = CRAuth.require_login(function(swap, callback){
            console.log("trying to revoke");
            if($scope.currentVote && $scope.currentVote.choice){
                Vote.delete({ article_id: $scope.article, topic_id: $scope.insight.pk, vote_id: $scope.currentVote.pk})
                    .$promise.then(function(data){
                        console.log("removed existing vote");

                        if (callback)
                            callback();

                    }, function(data){
                        console.log(data);
                    });
                simulateRevoke(swap);
            }else{
                console.log("no current vote to revoke");
            }
        });

        $scope.vote = CRAuth.require_login(function(){
                console.log("Trying to Vote");
                if($scope.currentVote && $scope.currentVote.choice){
                    console.log("Have to remove existing vote first");
                    $scope.revoke(true, function(){
                        console.log("Trying vote again");
                        $scope.vote()
                    })
                }else{
                    simulateVote();
                    Vote.save({ article_id: $scope.article, topic_id: $scope.insight.pk}, {choice: $scope.radioModel.selectedChoice})
                        .$promise.then(
                        function(result){
                            console.log("Successful Vote");
                            console.log(result);
                            $scope.currentVote = result;
                        },
                        function(error) {
                            console.log("pushing error");
                            console.log(error);
                            CRAlerts.push({msg: error.data.detail || "Something went wrong."});

                        });
                }});

        $scope.$on('CRAuth.AuthenticationChanged', function(event, data){
            console.log("The authentication status has changed");
            $scope.radioModel.disabled = !CRAuth.current_user
        });

        $scope.radioModel = {
            selectedChoice: '',
            disabled: !CRAuth.current_user
        };

        $scope.toggleVotePanel = function($event){

            if (!$scope.currentInsightPanel){
                $scope.currentInsightPanel = $event.currentTarget;
            }

            angular.element($scope.currentInsightPanel).toggleClass("move-over");
        };

        $scope.init = function() {
            //console.log("Insight Vote Panel Init");
            getVote();
            calculatePopularVote();
        };

        $scope.init();
    });