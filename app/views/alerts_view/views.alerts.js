/**
 * Created by jordanbradley on 1/17/15.
 */
angular.module('cr.views.alerts', ['cr.services.alerts'])
    .controller('CRAlertsCtrl', function($scope, CRAlerts, $interval) {

        $scope.alerts = CRAlerts.all();

        CRAlerts.onUpdate(function (alert){

            $scope.alerts = CRAlerts.all();

            var overhead = angular.element("[ui-view='overhead']")[0];
            if (overhead.clientHeight) {
                overhead.style.height = 0;
            } else {
                console.log("checing heigh");
                var wrapper = angular.element('.measuring-wrapper')[0];
                overhead.style.height = wrapper.clientHeight + "px";
            }
        });

        function grow(){

        }
    });