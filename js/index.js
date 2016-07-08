var app = angular.module('app', ['ui.router'])
  .controller('AppController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    var vm = this;

    var COLORS = ['red', 'pink', 'purple', 'deeppurple', 'indigo', 'blue', 'lightblue', 'cyan', 'teal', 'green', 'lightgreen', 'lime', 'yellow', 'amber', 'orange', 'deeporange', 'brown', 'grey', 'bluegrey', 'black', 'white'],
      colors = COLORS;

    $scope.buttons = [];
    $http.get('json/data.json').then(function(data){
      $scope.buttons = data.data;
      angular.forEach($scope.buttons, function(i){
        var rand = Math.floor(Math.random()*colors.length);
        i.class = colors[rand] + '-button';
        var tmp = [];
        if(colors.length) {
          for (var j = 0; j < colors.length; j++) {
            if (j !== rand) {
              tmp.push(colors[j]);
            }
          }
          colors = tmp;
        }
        else {
          colors = COLORS;
        }
        i.source = $sce.trustAsResourceUrl('sounds/' + i.src + '.mp3');
      });
    });

    $scope.play = function(title) {
      for (var i = 0; i < $scope.buttons.length; i++) {
        var item = document.getElementsByClassName('audio-' + $scope.buttons[i].title);
        if($scope.buttons[i] && item && item[0] && $scope.buttons[i].title !== title) {
          item[0].pause();
        }
      }
      var audio = document.getElementsByClassName('audio-' + title)[0];
      audio.currentTime = 0;
      audio.play();
    };
  }])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('buttons', {
        url: '/',
        templateUrl: 'views/all.html',
        controller: 'AppController as vm'
      })
      .state('item', {
        url: '/{src}',
        templateUrl: 'views/button.html',
        controller: function($scope, $stateParams){
          angular.forEach($scope.buttons, function(item) {
            if(item.src === $stateParams.src) {
              $scope.button = item;
            }
          });
        }
      });
    $urlRouterProvider.otherwise('/');
  });