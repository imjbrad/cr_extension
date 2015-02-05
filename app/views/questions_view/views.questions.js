/**
 * Created by jordanbradley on 1/22/15.
 */
/**
 * Created by jordanbradley on 1/15/15.
 */
angular.module('cr.views.questions', ['cr.services.api', 'cr.directives.insight'])

    .controller('QuestionsCtrl', function($scope, CRAuth, $state) {
        $scope.article_id = $scope.$parent.article_id

    })

    .animation('.move-slide', function () {
        return {
            enter: function(element, done) {
                //$('body').animate({
                //    top: -(element.offset().top-10)
                //});

                element.animate({
                    maxHeight: 600
                }, done);
            },

            leave: function(element, done){

                element.animate({
                    maxHeight: 0
                }, done);
            }
        };
    });
