'use strict';

/* Controllers */

var movieControllers = angular.module('movieControllers', []);

movieControllers.controller('MoviesCtrl', ['$scope', '$http','$state',

  function ($scope, $http,$state) {
    
      $scope.search = "";
      $scope.results = [];
      $scope.cacheMovies = [];
      $scope.cacheMovieDetails = [];

      var archive;
      var cacheMovies = $scope.cacheMovies;
      var cacheMovieDetails = $scope.cacheMovieDetails;

      //Search for a Movie
      $scope.submit = function() {
        if ($scope.search) {
          var query = $scope.search;
          var isPrevSearch = false;

          //Check and see if the search is already in the archive
          if($scope.archive){
            archive.forEach(function(archiveItem){
              if(archiveItem.Query == query){
                $scope.results = archiveItem.Search;
                isPrevSearch = true;
              }
            });
          } 

          //If not in the archive make search on OMDb
          if(!isPrevSearch){

            $http.get("http://www.omdbapi.com/?s=" + $scope.search +"&type=movie").then(function(response){ 
              
              var data = response.data;

              if(data.Response == "True"){
                $('.search-form').removeClass("error");
                var data = response.data;
                data.Search.forEach(function(movie){
                  cacheMovies.forEach(function(cachedMovie){
                    if(movie.imdbID == cachedMovie.imdbID){
                      movie.Rating = cachedMovie.Rating;
                      return;
                    }
                  });
                });

                data.Query = query;
                if(!$scope.archive){
                  $scope.archive = [];
                  archive = $scope.archive;
                }

                archive.push(data);
                
                $scope.results = data.Search;
              } else {
                $('.search-form').addClass("error");
              }

              

            });
          } 
          $('.search').blur();
        }
      };

      //Select a Previous Search
      $scope.prevSearch = function(data) {
        $scope.results = data.Search;
        $('.search').val(data.Query);
      }

      //Set a Rating
      $scope.setRating = function(movie,num){
        
        movie.Rating = num;

        var tempMovie = movie;

        var id = tempMovie.imdbID;

        var isCached = false;

        //Check and see if the rating is cached
        cacheMovies.forEach(function(cachedMovie){
          if(cachedMovie.imdbID == id) {
            cachedMovie.Rating = num;
            isCached = true;
          }
        });

        if(!isCached){
          cacheMovies.push(tempMovie);
        }
        //Set the Rating in all previous archives
        archive.forEach(function(archiveItem){
          archiveItem.Search.forEach(function(movie){
            if(movie.imdbID == id){
              movie.Rating = num;
            }
      
          });
        });
      }

      //Open the details about a specific movie
      $scope.openModal = function(id) {

        var isCached = false;

        //Check and see if the details are already cached
        cacheMovieDetails.forEach(function(cachedDetail){
          if(cachedDetail.imdbID == id){
            $scope.modalMovie = cachedDetail;
            $('.modal').modal();
            isCached = true;
          }
        });

        //If not cached then do a search for movie by IMDB id
        if(!isCached){
          $http.get("http://www.omdbapi.com/?i=" + id).then(function(response){
            var movie = response.data;
            $scope.modalMovie = movie;
            $('.modal').modal();
            cacheMovieDetails.push(movie);
          }); 
        } 
      }
    }
  ]);

