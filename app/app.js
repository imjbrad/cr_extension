'use strict';

// Declare app level module which depends on views, and components
angular.module('cr', [
  'ngRoute',
  'ui.router',
  'ngAnimate',

  'cr.views.login',
  'cr.views.article',
  'cr.views.alerts'
])

    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {

      $urlRouterProvider.otherwise("/article");
      $stateProvider
          .state('article', {
            url: "/article",
            templateUrl: "/app/views/article_view/article.html"
          })
          .state('article.login', {
            url: "/login",
            views: {
              overhead: {templateUrl: "/app/views/login_view/login.html"}
            }
          })
          .state('article.alerts', {
            url: "/alerts",
            views: {
              overhead: {templateUrl: "/app/views/alerts_view/alerts.html"}
            }
          });

    });