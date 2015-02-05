angular.module('cr.services.alerts', [])

    .factory('CRAlerts', function($window, $state, $timeout){

        var alertService = {},
            _sessionStorage_id = "cr.services.alerts",
            _usercallBack = null,
            _alerts = angular.fromJson($window.sessionStorage.getItem(_sessionStorage_id)) || [];

        function _push_alerts(newAlertObject){

            if(newAlertObject){
                _alerts.push(newAlertObject);

                $timeout(function() {
                    alertService.clear(newAlertObject);
                }, 4000);
            }

            $window.sessionStorage.setItem(_sessionStorage_id, angular.toJson(_alerts));

            if(newAlertObject) {
                if($state.current.name != 'article.alerts')
                    $state.go('article.alerts');
            }

            if(_usercallBack)
                _usercallBack(newAlertObject);

        }

        alertService.onUpdate = function(userCallBack){
            _usercallBack = userCallBack;
        };

        alertService.all = function(){
            return _alerts;
        };

        alertService.push = function(alertObject){
            _push_alerts(alertObject);
        };

        alertService.clear = function(alertObject){
            _alerts.splice(_alerts.indexOf(alertObject), 1);
            _push_alerts();
        };

        return alertService;

    });