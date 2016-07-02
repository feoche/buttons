var app = angular.module('app', [])
  .controller('AppController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    var vm = this;

    var colors = ['red', 'pink', 'purple', 'deeppurple', 'indigo', 'blue', 'lightblue', 'cyan', 'teal', 'green', 'lightgreen', 'lime', 'yellow', 'amber', 'orange', 'deeporange', 'brown', 'grey', 'bluegrey', 'black', 'white'];

    vm.buttons = [{
      title: 'Après',
      src: $sce.trustAsResourceUrl('sounds/apay.mp3')
    }, {
      title: 'Bonne nuit les chiards',
      description: 'Un petit coup de pipeau?',
      src: $sce.trustAsResourceUrl('sounds/bonnenuitleschiards.mp3')
    }, {
      title: 'Careless Whisper',
      description: 'Envie de sensualité?',
      src: $sce.trustAsResourceUrl('sounds/carelesswhisper.mp3')
    }, {
      title: 'Hello darkness my old friend',
      description: 'Pour les moments de solitude',
      src: $sce.trustAsResourceUrl('sounds/hellodarknessmyoldfriend.mp3')
    }, {
      title: 'Keuuuuuwah',
      description: 'Exclamation tirée de la série \'Le coeur a ses raisons\'',
      src: $sce.trustAsResourceUrl('sounds/keuuuuuwah.mp3')
    }, {
      title: 'Tin-tin-tin-tiiin !',
      description: 'Exclamation tirée du sublime film \'La cité de la peur\'',
      src: $sce.trustAsResourceUrl('sounds/lacitédelapeur.mp3')
    }, {
      title: 'C\'est qui le patron?',
      description: 'Ne mets pas tes doigts sur la porte, tu risques de te faire pincer très fort',
      src: $sce.trustAsResourceUrl('sounds/lapindumétro.mp3')
    }, {
      title: 'Merci vous !',
      src: $sce.trustAsResourceUrl('sounds/mercivous.mp3')
    }, {
      title: 'Non',
      description: 'Mario l\'a dit',
      src: $sce.trustAsResourceUrl('sounds/non.mp3')
    }, {
      title: 'Oué oué !',
      description: 'C\'est pas un Racaillou ça m\'dame !',
      src: $sce.trustAsResourceUrl('sounds/ouaisouais.mp3')
    }, {
      title: 'Papi fougasse - l\'énigme',
      src: $sce.trustAsResourceUrl('sounds/papifougasse.mp3')
    }, {
      title: 'Papi fougasse - solution',
      src: $sce.trustAsResourceUrl('sounds/papifougasse2.mp3')
    }, {
      title: 'Super Timor',
      description: 'Paraît que c\'est encore plus fort avec sa nouvelle formule',
      src: $sce.trustAsResourceUrl('sounds/supertimor.mp3')
    }, {
      title: 'Surprise',
      src: $sce.trustAsResourceUrl('sounds/surprise.mp3')
    }, {
      title: 'We are the champions',
      description: 'Pour fêter ses succès !',
      src: $sce.trustAsResourceUrl('sounds/wearethechampions.mp3')
    }];
    
    angular.forEach(vm.buttons, function(i){
      var rand = Math.floor(Math.random()*colors.length);
      i.class = colors[rand] + '-button';
      var tmp = [];
      for(var j = 0; j<colors.length; j++){
        if(j !== rand) {
          tmp.push(colors[j]);
        }
      }
      colors = tmp;
    });

    vm.play = function(index) {
      for (var i = 0; i < vm.buttons.length; i++) {
        document.getElementsByClassName("audio-" + i)[0].pause();
      }
      document.getElementsByClassName("audio-" + index)[0].load();
      document.getElementsByClassName("audio-" + index)[0].play();
    };
  }]);