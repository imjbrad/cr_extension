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

    .controller('QuestionCtrl', function($scope, CRAuth, Question){
        $scope.isQuestionOwner = (CRAuth.current_user) ? ($scope.question.user == CRAuth.current_user.pk) : false;

    });