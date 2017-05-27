var app = angular.module('app', ['ui.router'])
  .controller('AppController', ['$http', '$sce', '$stateParams', function ($http, $sce, $stateParams) {
    var vm = this;

    var COLORS = ['red', 'pink', 'purple', 'deeppurple', 'indigo', 'blue', 'lightblue', 'cyan', 'teal', 'green', 'lightgreen', 'lime', 'yellow', 'amber', 'orange', 'deeporange', 'brown', 'grey', 'bluegrey', 'black', 'white'],
      colors = COLORS;

    vm.buttons = [];
    vm.currentAudio = '';
    $http.get('json/data.json').then(function (data) {
      vm.buttons = data.data;
      angular.forEach(vm.buttons, function (i) {
        if (i.src === $stateParams.src) {
          vm.buttonDetail = i;
          vm.buttonDetail.video = vm.buttonDetail.video && $sce.trustAsResourceUrl('//www.youtube.com/embed/' + vm.buttonDetail.video + (vm.buttonDetail.video.indexOf('?') === -1 ? '?' : '&amp;') + '&amp;controls=0&amp;theme=dark&amp;showinfo=0&amp;rel=0&amp;modestbranding=1');
        }
        var rand = Math.floor(Math.random() * colors.length);
        i.class = (rand? colors[rand] : 'red') + '-button';
        var tmp = [];
        if (colors.length) {
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

    vm.play = function (title) {
      for (var i = 0; i < vm.buttons.length; i++) {
        var item = document.getElementsByClassName('audio-' + vm.buttons[i].title);
        if (vm.buttons[i] && item && item[0] && vm.buttons[i].title !== title) {
          item[0].pause();
        }
      }
      var audio = document.getElementsByClassName('audio-' + title)[0];
      audio.currentTime = 0;
      if (vm.currentAudio === title) {
        audio.pause();
        vm.currentAudio = '';
      }
      else {
        vm.currentAudio = title;
        audio.play();
        vm.currentAudio = '';
      }
    };
  }])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('buttons', {
        url: '/',
        templateUrl: 'views/all.html',
        controller: 'AppController as vm'
      })
      .state('item', {
        url: '/{src}',
        templateUrl: 'views/button.html',
        controller: 'AppController as vm'
      });
    $urlRouterProvider.otherwise('/');
  });