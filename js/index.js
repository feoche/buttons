var app = angular.module('app', [])
  .controller('AppController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    var vm = this;

    var COLORS = ['red', 'pink', 'purple', 'deeppurple', 'indigo', 'blue', 'lightblue', 'cyan', 'teal', 'green', 'lightgreen', 'lime', 'yellow', 'amber', 'orange', 'deeporange', 'brown', 'grey', 'bluegrey', 'black', 'white'],
      colors = COLORS;

    vm.buttons = [];
    $http.get('json/data.json').then(function(data){
      vm.buttons = data.data;
      angular.forEach(vm.buttons, function(i){
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
        i.src = $sce.trustAsResourceUrl('sounds/' + i.src + '.mp3');
      });
    });

    vm.play = function(title) {
      for (var i = 0; i < vm.buttons.length; i++) {
        var item = document.getElementsByClassName("audio-" + vm.buttons[i].title);
        if(vm.buttons[i] && item && item[0] && vm.buttons[i].title !== title) {
          item[0].pause();
        }
      }
      var audio = document.getElementsByClassName("audio-" + title)[0];
      audio.currentTime = 0;
      audio.play();
    };
  }]);