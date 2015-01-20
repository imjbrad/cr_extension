/**
 * Created by jordanbradley on 1/19/15.
 */
angular.module('cr.directives.auth', ['cr.services.api'])

/**
 *
 * simple directive that
 */
    .directive("requireAuth", function(CRAuth, CRAlerts, $state){
        return {
            restrict: 'A',
            replace: false,
            require: '?ngModel',
            link: function(scope, element, attr, ngModel) {
                element.bind("click", function(){
                    if(!CRAuth.current_user){
                        CRAlerts.push({msg:"Please Log In"})
                    }
                });
            }
        };
    });