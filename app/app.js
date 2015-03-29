'use strict';

// Declare app level module which depends on views, and components
angular.module('cr', [
  'ngRoute',
  'ui.router',
  'ngAnimate',

  'cr.views.login',
  'cr.views.article',
  'cr.views.alerts',
  'cr.views.article_404'
])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $urlRouterProvider.otherwise("/");
  $stateProvider
      .state('article', {
        url: "/",
        templateUrl: "/app/views/article_view/article.html"
      })
      .state('article.login', {
        url: "login",
        views: {
          overhead: {templateUrl: "/app/views/login_view/login.html"}
        }
      })
      .state('article.alerts', {
        url: "alerts",
        views: {
          overhead: {templateUrl: "/app/views/alerts_view/alerts.html"}
        }
      })

     .state('article404', {
        url: "/404",
        templateUrl: "/app/views/article_404_view/article_404.html"
     });

});

