/**
 * Created by jordanbradley on 2/28/15.
 */
angular.module('cr.views.article_404', ['cr.services.api', 'cr.services.chrome'])

    .controller('Article404Ctrl', function($scope, Suggestion, CRChrome) {

        $scope.suggestClick = function(){

            if ($scope.suggestionBox){
                $scope.suggestionBox = false;
                $scope.submitted = true;

                Suggestion.post({
                    url: CRChrome.getCurrentUrl(),
                    message: angular.element("#suggestionText").val()},

                    function(data){
                        console.log(data);
                    },
                    function(error){
                        console.log(error);
                        console.log(error.data);
                    });
            }else{
                $scope.suggestionBox = true;
            }
        };

    });