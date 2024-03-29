/**
 * Created by jordanbradley on 1/11/15.
 */

angular.module('cr.services.auth', ['ngResource', 'angular-storage', 'cr.config'])

    .factory('CRAuth', function($http, store, $location, $rootScope, $state, CONFIG) {

        var auth = {};
        $rootScope.CRAuth = {};

        function _set_current_user(token, success){

            $http.defaults.headers.get = {Authorization: 'JWT ' + token};

            $http.get(CONFIG.API + '/me/')
                .success(function(data, status, headers, config) {
                    auth.current_user = {email:data.email, pk:data.user_id, token: token, exp: data.exp, original_auth: data.orig_iat ? false:true};
                    store.set("current_user", auth.current_user);

                    $rootScope.$broadcast('CRAuth.AuthenticationChanged');
                    $rootScope.CRAuth.authenticated = true;

                    _push_auth_headers();
                    console.log(auth.current_user);

                    if(success)
                        success(data, status);
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                    //auth.require_login();
                });
        }

        function _push_auth_headers(){
            if(auth.current_user && auth.current_user.token){
                var header = 'JWT ' + auth.current_user.token;
                $http.defaults.headers.common.Authorization = header;
                console.log($http.defaults);
            }
        }

        auth.current_user = (function() {
            return store.get("current_user") || null;
        })();


        auth.require_login = function(fn) {
            if(fn){
                if(!auth.current_user){
                    return auth.require_login
                }else{
                    return fn;
                }
            }else{
                console.log("Requiring Login");
                $state.go("article.login");
                //$location.url('/article/login');
            }
        };

        auth.refresh = function(){
            //push any existing headers
            _push_auth_headers();

            //refresh the session, set a new current user, and re-push the headers
            if(auth.current_user && auth.current_user.exp) {
                console.log("Trying to Extend Session");
                $http.post(CONFIG.API + '/token-refresh/', {token: auth.current_user.token}).
                    success(function (data, status, headers, config) {
                        _set_current_user(data.token);
                        console.log("Extended Session");
                    }).
                    error(function (data, status, headers, config) {
                        console.log("CR tried to automatically extend your session but something went wrong. Try logging back in");
                        //flush invalid or incorrect user data and ask them to log back in
                        auth.logout();
                        auth.require_login();
                        console.log(data);
                    });
            }else{
                console.log("No valid user available to refresh, flushing");
                auth.logout();
            }
        };

        auth.login = function(email, password, success, error) {
            $http.post(CONFIG.API + '/token-auth/', {email: email, password: password}).
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
            $rootScope.CRAuth.authenticated = false;
        };

        return auth

    })
    .factory("CRAuth.Interceptor", function($q, $location, $window, store, $rootScope){
        return {
            responseError: function (rejection) {
                //$rootScope.$emit('CRAuth.Interceptor.error', rejection);

                if (rejection.status == 0 && rejection.data == null){
                    console.log("Check your connection");
                }

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

