var app = angular
  .module("app", ["ui.router"])
  .controller("AppController", [
    "$http",
    "$sce",
    "$stateParams",
    "$scope",
    "$window",
    function ($http, $sce, $stateParams, $scope, $window) {
      var vm = this;

      var COLORS = [
          "red",
          "pink",
          "purple",
          "deeppurple",
          "indigo",
          "blue",
          "lightblue",
          "cyan",
          "teal",
          "green",
          "lightgreen",
          "lime",
          "yellow",
          "amber",
          "orange",
          "deeporange",
          "brown",
          "grey",
          "bluegrey",
          "black",
          "white"
        ],
        colors = [];

      init = function () {
        vm.currentAudio = "";

        var dataButtons = JSON.parse($window.localStorage.getItem('buttons'));
        if(dataButtons) {
          vm.buttons = dataButtons;
        }

        // Retrieve JSON afterwards
        $http.get('json/data.json').then(function (data) {
          if(!dataButtons) {
            vm.buttons = data.status === 200 && data.data;
          }

          // Set buttons
          angular.forEach(vm.buttons, function (i) {
            if (i.fileName === $stateParams.fileName) {
              vm.buttonDetail = i;
              vm.buttonDetail.video =
                vm.buttonDetail.video &&
                $sce.trustAsResourceUrl(
                  "//www.youtube.com/embed/" +
                  vm.buttonDetail.video +
                  (vm.buttonDetail.video.indexOf("?") === -1 ? "?" : "&amp;") +
                  "&amp;controls=0&amp;theme=dark&amp;showinfo=0&amp;rel=0&amp;modestbranding=1"
                );
            }

            // Add non-user tag to it
            i.type = 'data';

            // Adding random colors to button
            pickButtonColor(i);

            // Describe full path source
            if(i.fileName) {
              i.fullPath = "sounds/" + i.fileName + ".mp3";
            }

            // Store buttons
            saveButton(i);
          });
        });

        // Load a random button
        setInterval(function () {
          vm.randomButton = vm.buttons[Math.floor(Math.random() * vm.buttons.length)];
          $scope.$apply();
        }, 2000);
      };
      init();

      function pickButtonColor(i) {
        if (typeof colors === 'undefined') {
          var colors = angular.copy(COLORS);
        }
        var rand = Math.floor(Math.random() * colors.length);
        i.class = colors[rand] + "-button";
        colors.splice(rand, 1);
      }

      function onVisibilityChange(el, callback) {
        var old_visible;
        return function () {
          var visible = isElementInViewport(el);
          if (visible !== old_visible) {
            old_visible = visible;
            if (typeof callback === 'function') {
              callback();
            }
          }
        }
      }

      /*var handler = onVisibilityChange(el, function() {
        /!* your code go here *!/
      });
      //jQuery
            $(window).on('DOMContentLoaded load resize scroll', handler);

      //non-jQuery
       if (window.addEventListener) {
       addEventListener('DOMContentLoaded', handler, false);
       addEventListener('load', handler, false);
       addEventListener('scroll', handler, false);
       addEventListener('resize', handler, false);
       } else if (window.attachEvent)  {
       attachEvent('onDOMContentLoaded', handler); // IE9+ :(
       attachEvent('onload', handler);
       attachEvent('onscroll', handler);
       attachEvent('onresize', handler);
       }*/


      vm.play = function (button) {
        if (button.fullPath && !button.fullPath.match(/.*?\.mp3/g)) { // Launching iframe
          var iframe = document.getElementsByTagName("iframe")[0];
          var url = button.fullPath,
            resUrl = '';
          // Youtube
          if (url.match(/youtube/g)) {
            resUrl = url.replace("watch?v=", "embed/").replace(/^(.*?)&(.*?)$/g, '$1?rel=0&autoplay=1&$2');
          }
          iframe.src = resUrl;
        }
        else { // mp3 playing
          var audio = document.getElementsByTagName("audio")[0];
          var audioSource = audio.src && audio.src.replace(/.*?buttons\//g, '');
          var buttonSource = button.fullPath;
          if (audioSource === buttonSource) { // Click on the same button
            if (!audio.currentTime || audio.duration - audio.currentTime < audio.duration / 20 || button.paused) { // Start of track/End of track, reset timer
              if (!button.paused) {
                audio.currentTime = 0.01;
              }
              audio.play();
              button.paused = false;
            }
            else { // Track is playing
              audio.pause();
              button.paused = true;
            }
          }
          else { // Click on new button
            if (audio.currentTime && audio.currentTime <= audio.duration) { // Previous track is running
              audio.pause(); // Unload previous
            }

            // Hotswap audio sources
            audio.src = buttonSource;
            audio.preload = 'auto';
            audio.currentTime = 0.01;

            // var xhr = new XMLHttpRequest();
            // xhr.open('GET', buttonSource, true);
            // xhr.responseType = 'blob';
            // xhr.onload = function () {
            //   audio.fileName = URL.createObjectURL(xhr.response);
            // };
            // xhr.send();

            audio.play();
          }
        }
      };

      // function getData(audioFile, callback) {
      //   var reader = new FileReader();
      //   reader.onload = function(event) {
      //     var data = event.target.result.split(',')
      //       , decodedImageData = btoa(data[1]);
      //     callback(decodedImageData);
      //   };
      //   reader.readAsDataURL(audioFile);
      // }

      vm.addButton = function (button) {
        var newButton = {
          title: button.title,
          fullPath: button.url,
          type: 'user'
        };

        pickButtonColor(newButton);

        // Push to buttons
        vm.buttons.push(newButton);

        // Store it
        saveButton(newButton);

        // Reset fields
        vm.addNewButton = false;
        button.title = '';
        button.url = '';
      };

      function saveButton(button) {
        var dataButtons = JSON.parse($window.localStorage.getItem('buttons'));
        if (dataButtons) {
          var found = false;
          angular.forEach(dataButtons, function (item) {
            if (item.title === button.title && item.type === button.type) {
              found = true;
            }
          });
          if (!found) {
            dataButtons.push(button);
            $window.localStorage.setItem('buttons', JSON.stringify(dataButtons));
          }
        }
        else {
          $window.localStorage.setItem('buttons', JSON.stringify([button]));
        }
      }
    }
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("buttons", {
        url: "/",
        templateUrl: "all.html",
        controller: "AppController as vm"
      })
      .state("item", {
        url: "/{fileName}",
        templateUrl: "button.html",
        controller: "AppController as vm"
      });
    $urlRouterProvider.otherwise("/");
  });