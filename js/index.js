var app = angular
  .module("app", ["ui.router"])
  .controller("AppController", [
    "$http",
    "$sce",
    "$stateParams",
    "$scope",
    "$window",
    "$filter",
    "orderByFilter",
    function ($http, $sce, $stateParams, $scope, $window, $filter, orderBy) {
      var vm = this;

      var COLORS = ["aliceblue", "antiquewhite", "antiquewhite1", "antiquewhite2", "antiquewhite3", "antiquewhite4", "aquamarine", "aquamarine1", "aquamarine2", "aquamarine3", "aquamarine4", "azure", "azure1", "azure2", "azure3", "azure4", "beige", "bisque", "bisque1", "bisque2", "bisque2", "bisque3", "bisque4", "black", "blanchedalmond", "blue", "blue1", "blue2", "blue3", "blue4", "blueviolet", "brown", "brown1", "brown2", "brown3", "brown4", "burlywood", "burlywood1", "burlywood2", "burlywood3", "burlywood4", "cadetblue", "cadetblue1", "cadetblue2", "cadetblue3", "cadetblue4", "chartreuse", "chartreuse1", "chartreuse2", "chartreuse3", "chartreuse4", "chocolate", "chocolate1", "chocolate2", "chocolate3", "chocolate4", "coral", "coral1", "coral2", "coral3", "coral4", "cornflowerblue", "cornsilk", "cornsilk1", "cornsilk2", "cornsilk3", "cornsilk4", "crimson", "cyan", "cyan1", "cyan2", "cyan3", "cyan4", "darkblue", "darkcyan", "darkgoldenrod", "darkgoldenrod1", "darkgoldenrod2", "darkgoldenrod3", "darkgoldenrod4", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkolivegreen1", "darkolivegreen2", "darkolivegreen3", "darkolivegreen4", "darkorange", "darkorange1", "darkorange2", "darkorange3", "darkorange4", "darkorchid", "darkorchid1", "darkorchid2", "darkorchid3", "darkorchid4", "darkred", "darksalmon", "darkseagreen", "darkseagreen1", "darkseagreen2", "darkseagreen3", "darkseagreen4", "darkslateblue", "darkslategray", "darkslategray1", "darkslategray2", "darkslategray3", "darkslategray4", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deeppink1", "deeppink2", "deeppink3", "deeppink4", "deepskyblue", "deepskyblue1", "deepskyblue2", "deepskyblue3", "deepskyblue4", "dimgray", "dimgrey", "dodgerblue", "dodgerblue1", "dodgerblue2", "dodgerblue3", "dodgerblue4", "firebrick", "firebrick1", "firebrick2", "firebrick3", "firebrick4", "floralwhite", "forestgreen", "gainsboro", "ghostwhite", "gold", "gold1", "gold2", "gold3", "gold4", "goldenrod", "goldenrod1", "goldenrod2", "goldenrod3", "goldenrod4", "gray", "gray0", "gray1", "gray2", "gray3", "gray4", "gray5", "gray6", "gray7", "gray8", "gray9", "gray10", "gray11", "gray12", "gray13", "gray14", "gray15", "gray16", "gray17", "gray18", "gray19", "gray20", "gray21", "gray22", "gray23", "gray24", "gray25", "gray26", "gray27", "gray28", "gray29", "gray30", "gray31", "gray32", "gray33", "gray34", "gray35", "gray36", "gray37", "gray38", "gray39", "gray40", "gray41", "gray42", "gray43", "gray44", "gray45", "gray46", "gray47", "gray48", "gray49", "gray50", "gray51", "gray52", "gray53", "gray54", "gray55", "gray56", "gray57", "gray58", "gray59", "gray60", "gray61", "gray62", "gray63", "gray64", "gray65", "gray66", "gray67", "gray68", "gray69", "gray70", "gray71", "gray72", "gray73", "gray74", "gray75", "gray76", "gray77", "gray78", "gray79", "gray80", "gray81", "gray82", "gray83", "gray84", "gray85", "gray86", "gray87", "gray88", "gray89", "gray90", "gray91", "gray92", "gray93", "gray94", "gray95", "gray96", "gray97", "gray98", "gray99", "gray100", "green", "green1", "green2", "green3", "green4", "greenyellow", "grey", "grey0", "grey1", "grey2", "grey3", "grey4", "grey5", "grey6", "grey7", "grey8", "grey9", "grey10", "grey11", "grey12", "grey13", "grey14", "grey15", "grey16", "grey17", "grey18", "grey19", "grey20", "grey21", "grey22", "grey23", "grey24", "grey25", "grey26", "grey27", "grey28", "grey29", "grey30", "grey31", "grey32", "grey33", "grey34", "grey35", "grey36", "grey37", "grey38", "grey39", "grey40", "grey41", "grey42", "grey43", "grey44", "grey45", "grey46", "grey47", "grey48", "grey49", "grey50", "grey51", "grey52", "grey53", "grey54", "grey55", "grey56", "grey57", "grey58", "grey59", "grey60", "grey61", "grey62", "grey63", "grey64", "grey65", "grey66", "grey67", "grey68", "grey69", "grey70", "grey71", "grey72", "grey73", "grey74", "grey75", "grey76", "grey77", "grey78", "grey79", "grey80", "grey81", "grey82", "grey83", "grey84", "grey85", "grey86", "grey87", "grey88", "grey89", "grey90", "grey91", "grey92", "grey93", "grey94", "grey95", "grey96", "grey97", "grey98", "grey99", "grey100", "honeydew", "honeydew1", "honeydew2", "honeydew3", "honeydew4", "hotpink", "hotpink1", "hotpink2", "hotpink3", "hotpink4", "indianred", "indianred1", "indianred2", "indianred3", "indianred4", "indigo", "indigo2", "ivory", "ivory1", "ivory2", "ivory3", "ivory4", "khaki", "khaki1", "khaki2", "khaki3", "khaki4", "lavender", "lavenderblush", "lavenderblush1", "lavenderblush2", "lavenderblush3", "lavenderblush4", "lawngreen", "lemonchiffon", "lemonchiffon1", "lemonchiffon2", "lemonchiffon3", "lemonchiffon4", "lightblue", "lightblue1", "lightblue2", "lightblue3", "lightblue4", "lightcoral", "lightcyan", "lightcyan1", "lightcyan2", "lightcyan3", "lightcyan4", "lightgoldenrod", "lightgoldenrod1", "lightgoldenrod2", "lightgoldenrod3", "lightgoldenrod4", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightpink1", "lightpink2", "lightpink3", "lightpink4", "lightsalmon", "lightsalmon1", "lightsalmon2", "lightsalmon3", "lightsalmon4", "lightseagreen", "lightskyblue", "lightskyblue1", "lightskyblue2", "lightskyblue3", "lightskyblue4", "lightslateblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightsteelblue1", "lightsteelblue2", "lightsteelblue3", "lightsteelblue4", "lightyellow", "lightyellow1", "lightyellow2", "lightyellow3", "lightyellow4", "limegreen", "linen", "magenta", "magenta1", "magenta2", "magenta3", "magenta4", "maroon", "maroon1", "maroon2", "maroon3", "maroon4", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumorchid1", "mediumorchid2", "mediumorchid3", "mediumorchid4", "mediumpurple", "mediumpurple1", "mediumpurple2", "mediumpurple3", "mediumpurple4", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "mistyrose1", "mistyrose2", "mistyrose3", "mistyrose4", "moccasin", "navajowhite", "navajowhite1", "navajowhite2", "navajowhite3", "navajowhite4", "navy", "navyblue", "oldlace", "olivedrab", "olivedrab1", "olivedrab2", "olivedrab3", "olivedrab4", "orange", "orange1", "orange2", "orange3", "orange4", "orangered", "orangered1", "orangered2", "orangered3", "orangered4", "orchid", "orchid1", "orchid2", "orchid3", "orchid4", "palegoldenrod", "palegreen", "palegreen1", "palegreen2", "palegreen3", "palegreen4", "paleturquoise", "paleturquoise1", "paleturquoise2", "paleturquoise3", "paleturquoise4", "palevioletred", "palevioletred1", "palevioletred2", "palevioletred3", "palevioletred4", "papayawhip", "peachpuff", "peachpuff1", "peachpuff2", "peachpuff3", "peachpuff4", "peru", "pink", "pink1", "pink2", "pink3", "pink4", "plum", "plum1", "plum2", "plum3", "plum4", "powderblue", "purple", "purple1", "purple2", "purple3", "purple4", "red", "red1", "red2", "red3", "red4", "rosybrown", "rosybrown1", "rosybrown2", "rosybrown3", "rosybrown4", "royalblue", "royalblue1", "royalblue2", "royalblue3", "royalblue4", "saddlebrown", "salmon", "salmon1", "salmon2", "salmon3", "salmon4", "sandybrown", "seagreen", "seagreen1", "seagreen2", "seagreen3", "seagreen4", "seashell", "seashell1", "seashell2", "seashell3", "seashell4", "sgibeet", "sgibrightgray", "sgibrightgrey", "sgichartreuse", "sgidarkgray", "sgidarkgrey", "sgigray0", "sgigray4", "sgigray8", "sgigray12", "sgigray16", "sgigray20", "sgigray24", "sgigray28", "sgigray32", "sgigray36", "sgigray40", "sgigray44", "sgigray48", "sgigray52", "sgigray56", "sgigray60", "sgigray64", "sgigray68", "sgigray72", "sgigray76", "sgigray80", "sgigray84", "sgigray88", "sgigray92", "sgigray96", "sgigray100", "sgigrey0", "sgigrey4", "sgigrey8", "sgigrey12", "sgigrey16", "sgigrey20", "sgigrey24", "sgigrey28", "sgigrey32", "sgigrey36", "sgigrey40", "sgigrey44", "sgigrey48", "sgigrey52", "sgigrey56", "sgigrey60", "sgigrey64", "sgigrey68", "sgigrey72", "sgigrey76", "sgigrey80", "sgigrey84", "sgigrey88", "sgigrey92", "sgigrey96", "sgigrey100", "sgilightblue", "sgilightgray", "sgilightgrey", "sgimediumgray", "sgimediumgrey", "sgiolivedrab", "sgisalmon", "sgislateblue", "sgiteal", "sgiverydarkgray", "sgiverydarkgrey", "sgiverylightgray", "sgiverylightgrey", "sienna", "sienna1", "sienna2", "sienna3", "sienna4", "skyblue", "skyblue1", "skyblue2", "skyblue3", "skyblue4", "slateblue", "slateblue1", "slateblue2", "slateblue3", "slateblue4", "slategray", "slategray1", "slategray2", "slategray3", "slategray4", "slategrey", "snow", "snow1", "snow2", "snow3", "snow4", "springgreen", "springgreen1", "springgreen2", "springgreen3", "springgreen4", "steelblue", "steelblue1", "steelblue2", "steelblue3", "steelblue4", "tan", "tan1", "tan2", "tan3", "tan4", "thistle", "thistle1", "thistle2", "thistle3", "thistle4", "tomato", "tomato1", "tomato2", "tomato3", "tomato4", "turquoise", "turquoise1", "turquoise2", "turquoise3", "turquoise4", "violet", "violetred", "violetred1", "violetred2", "violetred3", "violetred4", "wheat", "wheat1", "wheat2", "wheat3", "wheat4", "white", "whitesmoke", "yellow", "yellow1", "yellow2", "yellow3", "yellow4", "yellowgreen"],
        colors = [];

      init = function () {
        vm.currentAudio = "";

        var localStorageButtons = JSON.parse($window.localStorage.getItem('buttons'));
        vm.buttons = localStorageButtons;

        // Retrieve JSON afterwards
        $http.get('json/data.json').then(function (data) {
          if(data.status === 200) {
            angular.forEach(data.data, function (i) {
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

              // Describe full path source
              const fileName = i.title.replace(/[\s.,\/#!$%\^&\*;:{}=\-_`~()?!<>'"+]/gmi, "")
                  .toLowerCase()
                  .replace(/[àâ]/gmi, "a")
                  .replace(/ç/gmi, "c")
                  .replace(/[éèê]/gmi, "e")
                  .replace(/ù/gmi, "u")
                  .replace(/[îï]/gmi, "i");
              if (fileName) {
                i.fullPath = "sounds/" + fileName + ".mp3";
              }

            });
            vm.buttons = angular.merge(data.data, localStorageButtons);

            // Store buttons
            saveButton(vm.buttons);
          }
        });

        // Custom lazy load
        vm.limit = 120;
        var inter = setInterval(function () {
            if (vm.limit > vm.buttons) {
                vm.limit = -1;
                $scope.$apply();
                clearInterval(inter);
            } else {
                vm.limit += 120;
                $scope.$apply();
            }
        }, 200);

        // Load a random button
        setInterval(function () {
          vm.randomButton = angular.copy(vm.buttons[Math.floor(Math.random() * vm.buttons.length)]);
          vm.randomButton.title = '???';
          $scope.$apply();
        }, 2000);
      };
      init();

      vm.play = function (button, key, repeat) {
        vm.activeButton = key;
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
              gtag('event', 'button_play', {
              'event_label': button.title
            });
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
            audio.loop = typeof repeat !== 'undefined' && repeat;

            audio.play();
            gtag('event', 'button_play', {
              'event_label': button.title
            });
          }
        }
      };

      vm.toggleFav = function(button) {
        if(button.fav) {
          delete button.fav;
        }
        else {
          button.fav = true;
        }

        // Store it
        saveButton(button);
      };

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

      vm.scrollToLetter = function(letter) {
        var filteredButtons = orderBy(vm.buttons, 'title');
        if(letter === '#') {

        }
        else {
          var found = false;
          angular.forEach(filteredButtons, function(item, key) {
            if(letter === item.firstLetter && !found) {
              found = true;
              window.scrollTo(0, document.querySelectorAll('sound-button')[key].offsetTop - 50);
            }
          });
        }
      };

      function saveButton(button) {
        var dataButtons = JSON.parse($window.localStorage.getItem('buttons'));
        if (dataButtons) {
          var found = false;
          angular.forEach(dataButtons, function (item, key) {
            if (item.title === button.title && item.type === button.type) {
              found = key;
            }
          });
          if (!found) {
            dataButtons.push(button);
          }
          else {
            dataButtons[found] = button;
          }
          $window.localStorage.setItem('buttons', JSON.stringify(dataButtons));
        }
        else {
          $window.localStorage.setItem('buttons', JSON.stringify([button]));
        }
      }
    }
  ])
  .directive("soundButton", function(){
    return {
      restrict: 'E',
      scope: {
        vm: '=',
        button: '=',
        key: '='
      },
      templateUrl: 'button.html'
    }
  })
  .directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
      var fn = $parse(attrs.ngRightClick);
      element.bind('contextmenu', function(event) {
        scope.$apply(function() {
          event.preventDefault();
          fn(scope, {$event:event});
        });
      });
    };
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("buttons", {
        url: "/",
        templateUrl: "all.html",
        controller: "AppController as vm"
      })
      .state("item", {
        url: "/{fileName}",
        templateUrl: "button-detail.html",
        controller: "AppController as vm"
      });
    $urlRouterProvider.otherwise("/");
  });
