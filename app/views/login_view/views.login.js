/**
 * Created by jordanbradley on 1/15/15.
 */
angular.module('cr.views.login', ['cr.services.api', 'cr.directives.insight'])

    .controller('LoginCtrl', function($scope, CRAuth, $state) {
        var _previousState = null;

        $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
            _previousState = from;
            console.log(_previousState.name);
        });

        $scope.login = function(isValid) {
            // check to make sure the form is completely valid
            if (isValid) {
                CRAuth.login($scope.user.email, $scope.user.password, function(sucess, status){
                    if (_previousState.name != null) {
                        $state.go(_previousState.name);
                    }
                    console.log(sucess, status);
                }, function(error, status){
                    $scope.auth_error = error.non_field_errors.join(", ");
                    $scope.user = null;
                });
            }
        };
    });
