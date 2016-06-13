'use strict';

/* App Module */

var ngMoviesApp = angular.module('ngMoviesApp', [
  'ui.router',
  'movieControllers'
]);


ngMoviesApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    
  $urlRouterProvider.otherwise('/');
  
  $stateProvider
    .state('home', {
      url: '/',
      views: {
        'main': {
          url:"",
          templateUrl: 'partials/main.html',
          controller: 'MoviesCtrl'  
        }
      }  
   });
        
});
