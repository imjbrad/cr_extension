/**
 * Created by jordanbradley on 1/11/15.
 */

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

angular.module('cr.services.api', ['ngResource', 'angular-storage'])

    .factory('Article', function($resource) {
        return $resource('http://127.0.0.1:8000/api/article/:article_id');
    })

    .factory('Vote', function($resource, CRAuth){
        var custom_actions = {};
        custom_actions.authGET = {method:'GET'};
        if(CRAuth.current_user && CRAuth.current_user.token){
            custom_actions.authGET.headers = {"Authorization": 'JWT '+ CRAuth.current_user.token }
        }

        return $resource('http://127.0.0.1:8000/api/article/:article_id/topic/:topic_id/vote/:vote_id', {}, custom_actions);
    })

    .factory('InsightVotes', function($resource){
        return $resource('http://127.0.0.1:8000/api/article/:article_id/topics');
    })

    .factory('CRAuth', function($http, store, $location, $rootScope) {

        var auth = {};

        function _set_current_user(token, success){
            $http.defaults.headers.get = {Authorization: 'JWT ' + token};

            $http.get('http://127.0.0.1:8000/api/me/')
                .success(function(data, status, headers, config) {
                    auth.current_user = {email:data.email, pk:data.user_id, token: token, exp: data.exp, original_auth: data.orig_iat ? false:true};
                    store.set("current_user", auth.current_user);
                    $rootScope.$broadcast('CRAuth.AuthenticationChanged');
                    _push_auth_headers();
                    console.log(auth.current_user);

                    if(success)
                        success(data, status);
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                    auth.require_login();
                });
        }

        function _push_auth_headers(){
            if(auth.current_user && auth.current_user.token){
                var header = 'JWT ' + auth.current_user.token;

                $http.defaults.headers.post.Authorization =
                $http.defaults.headers.put.Authorization =
                $http.defaults.headers.patch.Authorization = header;
                $http.defaults.headers.delete = {"Authorization": header};
                console.log($http.defaults);
            }
        }

        auth.current_user = store.get("current_user") || null;

        auth.require_login = function(fn) {
            if(fn){
                return function callback(){
                    if(!auth.current_user){
                        console.log("Requiring Login");
                        $location.url('/article/login');
                    }else{
                        fn();
                    }
                }
            }else{
                console.log("Requiring Login");
                $location.url('/article/login');
            }
        };

        auth.refresh = function(){
            //set auth headers on init
            _push_auth_headers();
            //refresh if time is almost up
            if(auth.current_user && auth.current_user.token.exp && (!auth.current_user.original_auth)){
                var now = Date.now() / 1000, //from ms to s
                    exp = auth.current_user.exp, //in seconds
                    remainder = exp - now;

                if (remainder <= 3600){ //one hour
                    console.log("Extending Session");
                    $http.post('http://127.0.0.1:8000/api/token-refresh/', {token: auth.current_user.token}).
                        success(function(data, status, headers, config) {
                            _set_current_user(data.token);
                        }).
                        error(function(data, status, headers, config) {
                            console.log("CR tried to automatically extend your session but something went wrong. Try logging back in");
                            auth.require_login();
                        });
                }else{
                    console.log("Not Refreshing")
                }
                console.log("There are still roughly "+(remainder/60)+" min left before the session is expired")
            }else{console.log("CR can't extend the session... there is no current user with a non-original token")}
        };

        auth.login = function(email, password, success, error) {
            $http.post('http://127.0.0.1:8000/api/token-auth/', {email: email, password: password}).
                success(function(data, status, headers, config) {
                    _set_current_user(data.token, success);

                }).
                error(function(data, status, headers, config) {
                    error(data, status);
                });
        };

        auth.logout = function() {
            store.remove('current_user');
            $rootScope.$broadcast('CRAuth.AuthenticationChanged');
        };

        return auth

    })
    .factory("CRAuth.Interceptor", function($q, $location, $window, store, $rootScope){
        return {
            responseError: function (rejection) {
                //$rootScope.$emit('CRAuth.Interceptor.error', rejection);
                //if (rejection.status == 403){
                //    $location.url('/article/login');
                //}
                return $q.reject(rejection);
            }
        };
    })
    .run(function(CRAuth){
        CRAuth.refresh();
    })
    .config(function($httpProvider, $locationProvider) {
        $httpProvider.interceptors.push('CRAuth.Interceptor');
    })
;

//Articles
//GET api/article/id/
//
//Questions
//GET api/article/id/questions
//GET UPDATE api/article/id/question/id
//POST api/article/id/question/ask
//
//Insights
//GET api/article/id/topics
//
//Votes
//UPDATE DELETE api/article/id/topic/id/vote/id
//POST api/article/id/topic/id/vote
//
//Upvotes
//POST api/article/id/question/id/upvote
//DELETE api/article/id/question/id/upvote/id

