var app = angular
  .module("app", ["ui.router"])
  .controller("AppController", [
    "$http",
    "$sce",
    "$stateParams",
    "$scope",
    "$window",
    function($http, $sce, $stateParams, $scope, $window) {
      var vm = this;

      init = function() {
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

        vm.currentAudio = "";
        vm.buttons = data;

        // Set buttons
        angular.forEach(vm.buttons, function(i, key) {
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

          // Adding random colors to button
          if(!colors.length) {
            colors = angular.copy(COLORS);
          }
          var rand = Math.floor(Math.random() * colors.length);
          i.class = colors[rand] + "-button";
          colors.splice(rand, 1);

          // Set if new or not
          i.new = vm.buttons.length - key < 20;

          // Describe full path source
          i.fullPath = "sounds/" + i.fileName + ".mp3";
          i.source = $sce.trustAsResourceUrl(i.fullPath);
        });

        // Add user buttons
        var userButtons = $window.localStorage.getItem('userButtons');
        console.log('user', userButtons);
        if(userButtons) {
          userButtons = JSON.parse($window.localStorage.getItem('userButtons'));
        }

        // Load a random button
        setInterval(function() {
          vm.randomButton = vm.buttons[Math.floor(Math.random() * vm.buttons.length)];
          $scope.$apply();
        }, 2000);
      };
      init();

      function onVisibilityChange(el, callback) {
        var old_visible;
        return function () {
          var visible = isElementInViewport(el);
          if (visible != old_visible) {
            old_visible = visible;
            if (typeof callback == 'function') {
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


      vm.play = function(button) {
        var audio = document.getElementsByTagName("audio")[0];
        var audioSource = audio.src && audio.src.replace(/.*?buttons\//g, '');
        var buttonSource = button.fullPath;
        if(audioSource === buttonSource) { // Click on the same button
          if(!audio.currentTime || audio.duration - audio.currentTime < audio.duration/20 || button.paused) { // Start of track/End of track, reset timer
            if(!button.paused) {
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
      };

      function getData(audioFile, callback) {
        var reader = new FileReader();
        reader.onload = function(event) {
          var data = event.target.result.split(',')
            , decodedImageData = btoa(data[1]);
          callback(decodedImageData);
        };
        reader.readAsDataURL(audioFile);
      }
    }
  ])
  .config(function($stateProvider, $urlRouterProvider) {
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

// DATA

var data = [
  {
    title: "0118 999 88199 9119 725...3",
    description: "Le fameux numéro <3",
    fileName: "01189998819991197253",
    video: "ab8GtuPdrUQ"
  },
  {
    title: "06h30",
    description: "Et tout va bien !",
    fileName: "6h30",
    video: "q0GUzoHvS8s"
  },
  {
    title: "1up",
    description: "You get an extra life !",
    fileName: "1up",
    video: "_lSfM7F-_2E"
  },
  {
    title: "20th Century Fox à la flute",
    description: "Ca donne envie de s'y remettre hein?",
    fileName: "20thcenturyfoxflute",
    video: "IsdCGQbbd8k"
  },
  {
    title: "</3",
    description: "GlaDoS :'(",
    fileName: "glados",
    video: "4CdoufQu1ko"
  },
  {
    title: "A moi?",
    fileName: "amoi",
    video: "pnj7O2YatBM"
  },
  {
    title: "A que coucou",
    description: "COUCOU !",
    fileName: "aquecoucou",
    video: "3bK3Ddbqs7E"
  },
  {
    title: "Akhmed",
    description: "I kill you",
    fileName: "ikillyou",
    video: "GBvfiCdk-jc"
  },
  {
    title: "Alleluia",
    description: "Sainte bombe TMTC <3",
    fileName: "hallelujah",
    video: "IUZEtVbJT5c"
  },
  {
    title: "Amazing horse",
    description: "Sweet lemonade !",
    fileName: "lookatmyhorse",
    video: "VecVykoHCuU"
  },
  {
    title: "Après",
    fileName: "apay"
  },
  {
    title: "Apwal",
    fileName: "apoil",
    video: "LT6GbI5_cww"
  },
  {
    title: "Arthour",
    description: "Couillère",
    fileName: "arthour",
    video: "J7x7FyYGj74"
  },
  {
    title: "Au revoir.",
    fileName: "aurevoir",
    video: "fNHMF-tW9vA"
  },
  {
    title: "Badger",
    description: "Mushroom mushroom !",
    fileName: "badger",
    video: "pzagBTcYsYQ"
  },
  {
    title: "Badumtss",
    description: "Pour toutes les vannes de merde",
    fileName: "badumtss",
    video: "yNizwPBaU6U"
  },
  {
    title: "Balls of steel",
    fileName: "ballsofsteel",
    video: "2rAjily7rME"
  },
  {
    title: "Banana phone",
    fileName: "bananaphone",
    video: "3vWm47yPLGc"
  },
  {
    title: "Bazinga",
    description: "Sheldon Cooper t'a eu !",
    fileName: "bazinga",
    video: "u85u2ymDl8M"
  },
  {
    title: "Benny Hill",
    fileName: "bennyhill",
    video: "hJC4HvpWewM"
  },
  {
    title: "Benzaie live",
    description: "Cette EXAGERATION !",
    fileName: "benzaielive",
    video: "L13ZlraWWQk"
  },
  {
    title: "Bird is the word",
    description: "Peter Griffin did it again",
    fileName: "birdistheword",
    video: "7OXVPgu6urw"
  },
  {
    title: "Bob l'éponge",
    description: "ou alors...",
    fileName: "spongebob",
    video: "vE2ETqUGj6Q"
  },
  {
    title: "Boblennon",
    description: "Notre dieu à tous",
    fileName: "boblennon",
    video: "P0unM_XNYPQ"
  },
  {
    title: "Bonne nuit les chiards",
    description: "Un petit coup de pipeau?",
    fileName: "bonnenuitleschiards",
    video: "9KbREoFax3U"
  },
  {
    title: "Boom headshot !",
    description: "Pour remplacer votre son de headshot sur CS",
    fileName: "boomheadshot",
    video: "olm7xC-gBMY"
  },
  {
    title: "Boule noire",
    description: "OHOHOHOH",
    fileName: "boulenoire",
    video: "y_sG_lPgMvk"
  },
  {
    title: "C'est pas faux",
    description: "Perceval rulz",
    fileName: "cestpasfaux",
    video: "JTsKShlfgBk"
  },
  {
    title: "C'est pas sorcier",
    description: "Une putain d'émission <3",
    fileName: "cestpassorcier",
    video: "eVxjTDvdaL0"
  },
  {
    title: "C'est qui le patron?",
    description:
      "Ne mets pas tes doigts sur la porte, tu risques de te faire pincer très fort",
    fileName: "lapindumetro",
    video: "XfSVs1xjb0Q"
  },
  {
    title: "Ca c'est une talalavoca",
    description: "Comprenez ce que vous pouvez",
    fileName: "zas",
    video: "2H1fFwiJG_0"
  },
  {
    title: "Ca dépasserait l'entendement",
    description: "Mais enfin Jérôme !",
    fileName: "cadepasselentendement",
    video: "C8SkmKGkh5o"
  },
  {
    title: "Café?",
    fileName: "cafe",
    video: "g209Ab0R7EA"
  },
  {
    title: "Can't touch this",
    fileName: "canttouchthis",
    video: "otCpCn0l4Wo"
  },
  {
    title: "Cantina",
    description: "By Watto, dans Star Wars Racer",
    fileName: "wattocantina",
    video: "JQkFriEZAeE"
  },
  {
    title: "Careless Whisper",
    description: "Envie de sensualité?",
    fileName: "carelesswhisper",
    video: "izGwDsrQ1eQ"
  },
  {
    title: "Chanson du poireau",
    description: "Ievan äiti se kammarissa virsiä veisata huijjuutti...",
    fileName: "loituma",
    video: "qmf9JkedPR8"
  },
  {
    title: "Chapi chapo",
    fileName: "chapichapo",
    video: "f_oEovxpf8s"
  },
  {
    title: "Chewbacca",
    description: "Vas-y Chewie, mets la gomme !",
    fileName: "chewbacca",
    video: "iotyF3DQrVA"
  },
  {
    title: "Codec",
    description: "Snake? Snake? SNAAAAKE !",
    fileName: "codec",
    video: "cdOzb3lhEe4"
  },
  {
    title: "Coin",
    description: "Parce que c'est cool les bruits de canard",
    fileName: "cuek",
    video: "8sxRUjBryLc"
  },
  {
    title: "Comsi",
    description: "...Jnexistépa",
    fileName: "comsi",
    video: "RvK19xgAxSU"
  },
  {
    title: "Coucou",
    description: "Tu veux voir ma bite?",
    fileName: "coucou",
    video: "iNr8-xpK0YQ"
  },
  {
    title: "Crickets",
    description: "Gros blanc après une vanne",
    fileName: "crickets",
    video: "Evj_h6GJ6xo"
  },
  {
    title: "DROOOOGUE",
    fileName: "drogue",
    video: "EGL-sz1atnI"
  },
  {
    title: "Die potato",
    description: "NOOOOOOO",
    fileName: "diepotato",
    video: "U9KlSOIWJQc"
  },
  {
    title: "Do a barrel roll",
    description: "Fox McCloud l'a bien compris",
    fileName: "doabarrelroll",
    video: "wIkJvY96i8w"
  },
  {
    title: "Do it",
    description: "JUST DO IT",
    fileName: "justdoit",
    video: "5-sfG8BV8wU"
  },
  {
    title: "Doh",
    description: "Oh Homer !",
    fileName: "doh",
    video: "cnaeIAEp2pU"
  },
  {
    title: "Don't drop that durka durk",
    fileName: "durkadurk",
    video: "BFGAvTNEvdw"
  },
  {
    title: "Dramatic chipmunk",
    description: "TINTINTIIIIIIIIIIN!",
    fileName: "dramatic",
    video: "a1Y73sPHKxw"
  },
  {
    title: "Dring dring dring",
    description: "Eh oui, ça vient de Pokémon :D",
    fileName: "dringdringdring",
    video: "tLygyWsgmnc"
  },
  {
    title: "EA Sports",
    description: "Itseneuguém",
    fileName: "easports",
    video: "3QP7KOsKtDo"
  },
  {
    title: "Epic sax guy",
    description: "A écouter en boucle, sans en doûter",
    fileName: "epicsaxguy",
    video: "qIIOza9ZaXw"
  },
  {
    title: "Et on fait tourner les serviettes",
    description: "Pour vos mariages",
    fileName: "tournerlesserviettes",
    video: "kk2CzGfL7n4"
  },
  {
    title: "Everyday I'm shufflin",
    fileName: "shufflin",
    video: "f1zBrtr_KxA"
  },
  {
    title: "Eye of the tiger",
    description: "Pour vos battles de ping-pong enragées",
    fileName: "eyeofthetiger",
    video: "btPJPFnesV4"
  },
  {
    title: "Finish him",
    description: "Fatality",
    fileName: "finishhim",
    video: "2YxPFw7lfY0"
  },
  {
    title: "Gaayyyyy",
    description: "Ken Jeong > le reste des acteurs de Community",
    fileName: "gaaaay",
    video: "KRUZK01LffE"
  },
  {
    title: "Gameboy",
    fileName: "gameboy",
    video: "BsJqIiSuBnA"
  },
  {
    title: "Goodbye",
    description: "Se faire cuire à 4000° #tbt",
    fileName: "goodbye",
    video: "ihYVZFl-Ck0"
  },
  {
    title: "Guile",
    description: "Meilleur perso de Street",
    fileName: "guiletheme",
    video: "Iof5pRAIZmw"
  },
  {
    title: "Gurdil",
    description: "On creuse le jour, on boit la nuit",
    fileName: "gurdil",
    video: "UWPdBI9FlTg"
  },
  {
    title: "Ha-ha",
    description: "Nelson se fout de toi",
    fileName: "haha",
    video: "rX7wtNOkuHo"
  },
  {
    title: "Hadouken",
    description: "Quart de cercle + poing",
    fileName: "hadouken",
    video: "pHJKS3r_YUg"
  },
  {
    title: "Hard Corner",
    description: "Benzaaaaaaie !",
    fileName: "hardcorner",
    video: "nrKChueoLEs"
  },
  {
    title: "Harlem shake",
    description: "Pour vos soirées entre potes avec des poneys",
    fileName: "harlemshake",
    video: "8f7wj_RcqYk"
  },
  {
    title: "Hello darkness my old friend",
    description: "Pour les moments de solitude",
    fileName: "hellodarknessmyoldfriend",
    video: "u9Dg-g7t2l4"
  },
  {
    title: "Hey",
    description: "Listen !",
    fileName: "hey",
    video: "wOFVrjL-XBM"
  },
  {
    title: "Hi-hi",
    description: "MJ représente",
    fileName: "mjhihi",
    video: "tAuqYBoHv6M"
  },
  {
    title: "Hobbits",
    description: "A Isengard :/",
    fileName: "hobbits",
    video: "uE-1RPDqJAY"
  },
  {
    title: "Hymne de baseball",
    description: "HOOOOME RUUUUN !",
    fileName: "mlb",
    video: "PFR3S6jN0Ng"
  },
  {
    title: "I don't hate you",
    description: "Les tourelles vous aiment <3",
    fileName: "portalturret",
    video: "OUxM3XqZJ9c"
  },
  {
    title: "I like to move it",
    description: "Oui, Madagascar quoi",
    fileName: "madagascar",
    video: "s6tgGXXj0bc"
  },
  {
    title: "I'm sexy and I know it",
    description: "Tout est dans le titre",
    fileName: "sexyandknowit",
    video: "wyx6JDQCslE"
  },
  {
    title: "Imma firin'",
    description: "In my lazor",
    fileName: "lazor",
    video: "fyuNidSrVik"
  },
  {
    title: "Inspecteur Gadget",
    description: "Et là qui voilà?",
    fileName: "inspecteurgadget",
    video: "i0mlC026Wwk"
  },
  {
    title: "It's OK to be gay",
    fileName: "itsoktobegay",
    video: "3j4t185wl-0"
  },
  {
    title: "It's a trap !",
    description: "Akhbar l'avait dit !",
    fileName: "itsatrap",
    video: "4F4qzPbcFiA"
  },
  {
    title: "It's me Mario",
    fileName: "itsmemario",
    video: "ZhadLMDWcGA"
  },
  {
    title: "It's over 9000 !",
    description: "Bah au moins !",
    fileName: "over9000",
    video: "SiMHTK15Pik"
  },
  {
    title: "J'ai fait caca",
    description: "Ah mais oui mais non c'est vrai !",
    fileName: "jaifaitcaca",
    video: "0wCWtHxapW0"
  },
  {
    title: "J'danse comme un ouf",
    description: "CL4P-TP :D",
    fileName: "jdonnetout",
    video: "szaMhLB24A8"
  },
  {
    title: "J'vous aime putain",
    fileName: "jvousaimeputain",
    video: "cxAGEsDglO8"
  },
  {
    title: "K2000",
    description: "David Hasselhoff FTW",
    fileName: "k2000",
    video: "iN3rvvkHo1M"
  },
  {
    title: "Kamehameha",
    fileName: "kamehameha",
    video: "dHvcBga2ino"
  },
  {
    title: "Keuuuuuwah",
    description: "Exclamation tirée de la série 'Le coeur a ses raisons'",
    fileName: "keuuuuuwah",
    video: "DpjCPV8x4Io"
  },
  {
    title: "Keyboard cat",
    fileName: "keyboardcat",
    video: "J---aiyznGQ"
  },
  {
    title: "Kill Bill",
    description: "Ou la pub de la poste x)",
    fileName: "killbill",
    video: "E84OWq6z3IQ"
  },
  {
    title: "Kill Bill parano",
    description: "Imaginez les gros zooms de caméra",
    fileName: "killbill2",
    video: "hg6rqDX-1wQ"
  },
  {
    title: "Koh Lanta",
    description: "Cette sanction est irrévocable",
    fileName: "kohlanta",
    video: "5VAuOq1WiYg"
  },
  {
    title: "LEEEROOOOY",
    description: "JENNNKINS !",
    fileName: "leeeeroy",
    video: "EpzADbkIyXw"
  },
  {
    title: "La jungle des animaux",
    fileName: "lajungledesanimaux",
    video: "Uz1F89nlZUU"
  },
  {
    title: "Lalalalalalalala",
    description: "Lalalalalalalala",
    fileName: "lalalala",
    video: "i2winnYY2Pc"
  },
  {
    title: "Lapin crétin",
    description: "BWAAAAAAAAAAAH !",
    fileName: "rabbids",
    video: "AtRYcMw9Mww"
  },
  {
    title: "Laughing owl",
    description: "Une chouette qui rigole de manière bizarre ^^",
    fileName: "laughingowl",
    video: "M5p9JO9JgvU"
  },
  {
    title: "Le papa pingouin",
    fileName: "papapingouin",
    video: "DN59pKJoF34"
  },
  {
    title: "Le petit bonhomme en mousse",
    description: "Pour vos soirées beaufs",
    fileName: "lepetitbonhommeenmousse",
    video: "CcoPdIpYuhc"
  },
  {
    title: "Let the bodies",
    description: "Hit the flooooooor !",
    fileName: "letthebodies",
    video: "BfR5O2PXzfc"
  },
  {
    title: "Let's get to RUMBLE !",
    description: "Ca va chier",
    fileName: "rumble",
    video: "sUU5rMgSj_I"
  },
  {
    title: "Looney toons",
    description: "Le générique de notre enfance",
    fileName: "looneytoons",
    video: "0jTHNBKjMBU"
  },
  {
    title: "MEU",
    description: "MEU",
    fileName: "meu",
    video: "gH1ro89KlhU"
  },
  {
    title: "MSN",
    description: "Nous on s'aime, et ons'le dit sur MSN",
    fileName: "msn",
    video: "vJL2-WSow4c"
  },
  {
    title: "Magabons",
    description: "Vous n'êtes que des magabons !",
    fileName: "magabon",
    video: "ozCsQLR07vo"
  },
  {
    title: "Magnum",
    description: "Tom Selleck. Point.",
    fileName: "magnum",
    video: "LBIgXhiOpeQ"
  },
  {
    title: "Mais non mais non",
    description: "TUTUDULUDU",
    fileName: "muppets",
    video: "8N_tupPBtWQ"
  },
  {
    title: "Mario - Pièce",
    fileName: "mariocoin",
    video: "iPILIf7ru48"
  },
  {
    title: "McGyver",
    description: "Que de bons souvenirs :)",
    fileName: "mcgyver",
    video: "lc8RFPZUkiQ"
  },
  {
    title: "Merci vous",
    fileName: "mercivous"
  },
  {
    title: "Merguez Party",
    description: "Tant qu'y a d'la braise, c'est pas fini !",
    fileName: "lamerguezparty",
    video: "UTzFjw4U8eU"
  },
  {
    title: "Metal Gear",
    fileName: "metalgear",
    video: "lERvkGVXAiY"
  },
  {
    title: "Michel c'est le Brésil",
    description: "Tout ça pour des Velux !",
    fileName: "michelcestlebresil",
    video: "h5Vw9jncERY"
  },
  {
    title: "Moskau",
    description: "Un peu de Russie dans vos veines",
    fileName: "moskau",
    video: "7pTwE-lqRgQ"
  },
  {
    title: "Murloc",
    description: "Osez le faire aussi bien",
    fileName: "murloc",
    video: "37EU7tGtJmM"
  },
  {
    title: "Même que des fois...",
    fileName: "memequedesfoismoijevomis",
    video: "wTlYEnqrLDM"
  },
  {
    title: "NO !",
    description: "GOD PLEASE NO",
    fileName: "no",
    video: "31g0YE61PLQ"
  },
  {
    title: "NOOTNOOT",
    description: "Big up à Corentin ;)",
    fileName: "nootnoot",
    video: "a4VvRWTD3Ok"
  },
  {
    title: "Narwhals",
    description: "Inventors of the chiche kebab !",
    fileName: "narwhals",
    video: "ykwqXuMPsoc"
  },
  {
    title: "Nein",
    description: "ou nine?",
    fileName: "neinnein",
    video: "sLs19nIikwQ"
  },
  {
    title: "Nokia 3310",
    description: "Avec 3 mois de batterie",
    fileName: "nokia3310",
    video: "-2uadMVEsjc"
  },
  {
    title: "Nom de Zeus",
    description: "C'est vous l'doc, doc",
    fileName: "nomdezeus",
    video: "DYH4Q2AQxs4"
  },
  {
    title: "Non",
    description: "Mario l'a dit",
    fileName: "non",
    video: "caXgpo5Ezo4"
  },
  {
    title: "Nyan Cat",
    fileName: "nyancat",
    video: "QH2-TGUlwu4"
  },
  {
    title: "On est champions",
    description: "On est tous ensemble !",
    fileName: "tousensemble",
    video: "ATNRq90niUU"
  },
  {
    title: "On s'en bat les...",
    fileName: "onsenbatlescouilles",
    video: "XoDY9vFAaG8"
  },
  {
    title: "Oppa gangnam style",
    description: "Le succès à 2.6 milliard de vues (normal)",
    fileName: "gangnamstyle",
    video: "kf2GUx6xsgQ"
  },
  {
    title: "Ouaip",
    description: "C'est pas un Racaillou ça m'dame !",
    fileName: "ouaisouais",
    video: "QYeWLYATwPc"
  },
  {
    title: "Pacman dies",
    fileName: "pacmandeath",
    video: "r1mB9874c5s"
  },
  {
    title: "Papi fougasse l'énigme",
    fileName: "papifougasse",
    video: "pLVtpMqTUSI"
  },
  {
    title: "Papi fougasse solution",
    fileName: "papifougasse2",
    video: "pLVtpMqTUSI"
  },
  {
    title: "Parler italien",
    description: "Peter Griffin qui sait parler italien",
    fileName: "badadipoopi",
    video: "J6dFEtb06nw"
  },
  {
    title: "Penny",
    fileName: "penny",
    video: "tKV4XYD3xK4"
  },
  {
    title: "Pikachu",
    description: "'chuuu :3",
    fileName: "pikachu",
    video: "gENjTs8VskQ"
  },
  {
    title: "PoPiPo",
    description: "Hatsune Miku a tout dit !",
    fileName: "popipo",
    video: "GkVcgbvNoK0"
  },
  {
    title: "Pokémon",
    description: "Ca demande du courage !",
    fileName: "pokemon",
    video: "lQOEhxTZbz8"
  },
  {
    title: "Pouin pouin pouin pouiiiin !",
    description: "Blague vaseuse spotted",
    fileName: "sadtrombone",
    video: "yJxCdh1Ps48"
  },
  {
    title: "Power Rangers",
    description: "Gogo Power Rangers",
    fileName: "powerrangers",
    video: "7Wt6XlVob_E"
  },
  {
    title: "Psychose",
    fileName: "psycho",
    video: "qMTrVgpDwPk"
  },
  {
    title: "Puddi puddi",
    description: "Giga puddi !",
    fileName: "puddipuddi",
    video: "KLJ-jXJLPcU"
  },
  {
    title: "Quoiiii?",
    fileName: "quoiiii",
    video: "aGSka-KgJpw"
  },
  {
    title: "Ramoucho",
    description: "Jeu de mots Ramoucho !",
    fileName: "jeudemotsramoucho",
    video: ""
  },
  {
    title: "Roggan?",
    description: "Dogen !",
    fileName: "roggan",
    video: "eHv9U9V1X74"
  },
  {
    title: "Roulement de tambour",
    description: "Attention, il va faire un bide",
    fileName: "drumroll",
    video: "h0bArnwuhc8"
  },
  {
    title: "SEGA",
    description: "...En fait peut-être pas",
    fileName: "sega2",
    video: "rh5eis0sMHI"
  },
  {
    title: "SHUT UP !",
    fileName: "shutup",
    video: "CEgh8TUlpQc"
  },
  {
    title: "Sabre laser",
    description: "Etre un Jedi, c'est cool",
    fileName: "lightsaber",
    video: "faQO57Iwlo0"
  },
  {
    title: "Scatman",
    fileName: "scatman",
    video: "Hy8kmNEo1i8"
  },
  {
    title: "Sega",
    description: "C'est plus fort que toi",
    fileName: "sega",
    video: "MTJ-jtUg4rE"
  },
  {
    title: "Shake that ass",
    description: "Bitch and let me see what you got",
    fileName: "shakethatass",
    video: "NkRyWpgmV3Y"
  },
  {
    title: "Sing hallelujah",
    fileName: "singhallelujah",
    video: "CWCycC0P5AM"
  },
  {
    title: "Snoop Dogg",
    description: "Alors qu'est-ce qu'on attend?",
    fileName: "cesoirsnoopdogg",
    video: "sjHngbA4-a8"
  },
  {
    title: "Soft kitty",
    description: "Purr, purr, purr",
    fileName: "softkitty",
    video: "x9DdiZBnpoQ"
  },
  {
    title: "Spanish flea",
    description: "Je ne connaissais pas le titre !",
    fileName: "spanishflea",
    video: "4F01zynHX70"
  },
  {
    title: "Suit up",
    description: "Barney Stinson = Awesome",
    fileName: "suitup",
    video: "CiweaZQ8g5U"
  },
  {
    title: "Super Timor",
    description: "Paraît que c'est encore plus fort avec sa nouvelle formule",
    fileName: "supertimor",
    video: "59xYAKjCnIo"
  },
  {
    title: "Superman",
    fileName: "superman",
    video: "e9vrfEoc8_g"
  },
  {
    title: "Surprise",
    fileName: "surprise",
    video: "dQw4w9WgXcQ"
  },
  {
    title: "TAAAANK",
    description: "Left 4 Dead inside !",
    fileName: "tank",
    video: "7UZjgBvyheg"
  },
  {
    title: "THX",
    description: "Chuut, le filme commence !",
    fileName: "thx",
    video: "fLWacgcUMKw"
  },
  {
    title: "Tada",
    description: "Window XP users remembers",
    fileName: "tada",
    video: "nYEVvGapF20"
  },
  {
    title: "Tetris",
    fileName: "tetris",
    video: "xfaLulhrxZc"
  },
  {
    title: "The Internet is for porn",
    fileName: "inetisforporn",
    video: "zBDCq6Q8k2E"
  },
  {
    title: "The final countdown",
    fileName: "thefinalcountdown",
    video: "9jK-NcRmVcw"
  },
  {
    title: "This is SPARTA",
    fileName: "thisissparta",
    video: "rvYZRskNV3w"
  },
  {
    title: "Tin-tin-tin-tiiin",
    description: "Exclamation tirée du sublime film 'La cité de la peur'",
    fileName: "lacitedelapeur",
    video: "Dr7gOfOqc3Y"
  },
  {
    title: "Trololo",
    description: "RIP in peace",
    fileName: "trolololol",
    video: "oavMtUWDBTM"
  },
  {
    title: "Trop géniaaaale",
    description: "La peluuuche !",
    fileName: "tropgeniale",
    video: "Bq2YkdVoBoo"
  },
  {
    title: "Troy and Abed in the morning",
    description: "De la série 'Community' (que je vous recommande)",
    fileName: "troyandabed",
    video: "-nGBVea8Atw"
  },
  {
    title: "Tumbleweed",
    description: "Pour les gros vents",
    fileName: "tumbleweed",
    video: "iIIuR-HjFho"
  },
  {
    title: "Tunak tunak",
    fileName: "tunaktunak",
    video: "vTIIMJ9tUc8"
  },
  {
    title: "Victory",
    description: "Final Fantasy VII ;)",
    fileName: "victoryff",
    video: "QEmbOL3AAEs"
  },
  {
    title: "Viens boire un p'tit coup",
    description: "...à la maison",
    fileName: "viensboireunptitcoup",
    video: "XZAt-_gwvXY"
  },
  {
    title: "Vous êtes vraiment dégeulasse",
    description: "Mais ça m'plaît !",
    fileName: "degeulasse",
    video: "VowxelNhFNw"
  },
  {
    title: "WAZZAAAAA",
    description: "WEUZAAAAAAA",
    fileName: "wazzup",
    video: "MnCJatlzdHA"
  },
  {
    title: "WHAT THE F*CK",
    fileName: "wtfboom",
    video: "idm3J7I0qyQ"
  },
  {
    title: "Wall-E",
    description: "Eveuuuh",
    fileName: "walle",
    video: "QHH3iSeDBLo"
  },
  {
    title: "We are the champions",
    description: "Pour fêter ses succès !",
    fileName: "wearethechampions",
    video: "04854XqcfCY"
  },
  {
    title: "What The Cut Résumé",
    description: "Antoine Daniel <3",
    fileName: "whatthecut",
    video: "-B_yBNXTV3w"
  },
  {
    title: "What is love?",
    description: "Baby don't hurt me",
    fileName: "whatislove",
    video: "HEXWRTEbj1I"
  },
  {
    title: "What iz ze fuque?",
    description: "De 'Norman fait des vidéos'",
    fileName: "whatisthefuque",
    video: "tUS_YP3L_mE"
  },
  {
    title: "What what",
    description: "In the butt",
    fileName: "whatwhat",
    video: "u1kS4vOq2Y0"
  },
  {
    title: "Wheatley",
    description: "Avec cet accent british !",
    fileName: "wheatley",
    video: "afHt_1sVQ14"
  },
  {
    title: "Wheeeeeee",
    fileName: "whee",
    video: "o-6HA41F6Lg"
  },
  {
    title: "Who let the dogs out?",
    description: "Who who who who who",
    fileName: "wholetthedogsout",
    video: "Qkuu0Lwb5EM"
  },
  {
    title: "Who's your daddy?",
    fileName: "whosyourdaddy",
    video: "oRRPTzhfquQ"
  },
  {
    title: "Wilhelm",
    description: "Une cascade ratée? Pas de soucis !",
    fileName: "wilhelm",
    video: "Zf8aBFTVNEU"
  },
  {
    title: "Windows 95",
    description: "Souvenirs...",
    fileName: "windows95",
    video: "miZHa7ZC6Z0"
  },
  {
    title: "Wingardium leviosaaa",
    fileName: "leviosa",
    video: "reop2bXiNgk"
  },
  {
    title: "Wololo",
    description: "Et hop, changé de camp",
    fileName: "wololo",
    video: "tSZRAlSLQsk"
  },
  {
    title: "YEAAAAAAH !",
    description: "Les Experts",
    fileName: "yeahhh",
    video: "vS3dsT0QxWs"
  },
  {
    title: "Yabbadabadoo",
    fileName: "yabbadabbadoo",
    video: "HnZoED4jPok"
  },
  {
    title: "Yamete kudasai",
    fileName: "yametekudasai",
    video: "LB-oTkbapYw"
  },
  {
    title: "Yeah",
    description: "Yea !",
    fileName: "yeah",
    video: "rFTRmjimtCc"
  },
  {
    title: "You are a pirate",
    description: "Ahoy !",
    fileName: "youareapirate",
    video: "i8ju_10NkGY"
  },
  {
    title: "You shall not pass !",
    fileName: "youshallnotpass",
    video: "mJZZNHekEQw"
  },
  {
    title: "You touch my tralala",
    description: "Hum my ding ding dong",
    fileName: "youtouchmytralala",
    video: "iPrnduGtgmc"
  },
  {
    title: "Zelda - Un item",
    description: "Trouvé :D",
    fileName: "zeldaitem",
    video: "69AyYUJUBTg"
  },
  {
    title: "Zelda - Un passage secret",
    description: "Ouaaaah",
    fileName: "zeldasecret",
    video: "69AyYUJUBTg"
  },
  {
    title: "Ouais ouais ouais ouais",
    description: "Ouaaaah",
    fileName: "ouaisouaisouaisouais",
    video: "Re9eNv6T2UA"
  },
  {
    title: "Julien Lepers",
    fileName: "lalalalalala",
    video: "Re9eNv6T2UA"
  },
  {
    title: "Ah oui oui oui oui oui",
    fileName: "ahouiouiouiouioui",
    video: "Re9eNv6T2UA"
  },
  {
    title: "Je m'envole...",
    fileName: "jemenvole",
    video: "ZuoB1oz3eE8"
  },
  {
    title: "Modem",
    description: "Souvenirs...",
    fileName: "modem",
    video: "gsNaR6FRuO0"
  },
  {
    title: "JOHN CENA",
    fileName: "johncena",
    video: "TUQ3nVoN-ko"
  },
  {
    title: "C'est ma meuf",
    fileName: "cestmameuf",
    video: "wZroqa4tePs"
  },
  {
    title: "Dragon Ball Z",
    fileName: "dragonballz",
    video: "gQRFEeWeuRA"
  },
  {
    title: "La marmelade de ma grand-mère",
    description: "Une chanson poignante !",
    fileName: "lamarmelade",
    video: "X1GF69uN60M"
  },
  {
    title: "On a tous le droit",
    fileName: "onatousledroit",
    video: "LSfmY7TDhJA"
  },
  {
    title: "J'ai envie d'me suicider",
    description: "Ouais c'est trop cool",
    fileName: "jaienviedmesuicider",
    video: "NdZznTwgFEg"
  },
  {
    title: "T.E.X.T.O",
    description: "<3",
    fileName: "texto",
    video: "Wxio7XI2ZSU"
  },
  {
    title: "Move bitch",
    description: "Get out the way !",
    fileName: "movebitchgetouttheway",
    video: "VDWMYTP1kUA"
  },
  {
    title: "Motus",
    description: "Mot mot motus !",
    fileName: "motus",
    video: "JVdT9xC50lA"
  },
  {
    title: "Des chiffres et des lettres",
    fileName: "deschiffresetdeslettres",
    video: "Hx0jFIOaGRI"
  },
  {
    title: "Tnetennba",
    description: "Good morning, that's a nice TNETENNBA !",
    fileName: "tnetennba",
    video: "lsFAokXCxTI"
  },
  {
    title: "Fort Boyard",
    fileName: "fortboyard",
    video: "I39TFXIENqs"
  },
  {
    title: "Fort Boyard, mais lamasticot",
    fileName: "fortboyardlamasticot",
    video: "glxIR90pUrY"
  },
  {
    title: "Il ne peut plus rien nous arriver...",
    description: "d'affreux maintenant !",
    fileName: "ilnepeutplusriennousarriver",
    video: "MEKHaG9FxKY"
  },
  {
    title: "Bonjour !",
    fileName: "bonjour",
    video: "Vm7gj9vqBjY"
  },
  {
    title: "Genre des phrases choc",
    fileName: "genredesphraseschocs",
    video: "eisNsAPNq4A"
  },
  {
    title: "Moi je vote il bluffe",
    fileName: "moijevoteilbuffe",
    video: "TkepAXvRa-4"
  },
  {
    title: "Boîte à meuh",
    description: "MEUUUUUH !",
    fileName: "meuh",
    video: "UHdmqsnc_8g"
  },
  {
    title: "La colagiala",
    description: "Un gout de café !",
    fileName: "lacolegiala",
    video: "Bg3pFjbCag0"
  },
  {
    title: "Enfer et damnation !",
    fileName: "enferetdamnation",
    video: "Dd5k8Vicbzc"
  },
  {
    title: "Who's that Pokemon?",
    description: "IT'S PIKACHU !",
    fileName: "whosthatpokemon",
    video: "IfQumd_o0Gk"
  },
  {
    title: "Mais c'est d'la meeeerde !",
    description: "JP Coffe RIP in peace",
    fileName: "maiscestdlamerde",
    video: "ay_Hf5lJm1k"
  },
  {
    title: "Salut Youtube !",
    description: "CONNARD !",
    fileName: "salutyoutube",
    video: "w241Kh86nPQ"
  },
  {
    title: "PEGI 18",
    fileName: "pegi18",
    video: "YnaVvmhnCeQ"
  },
  {
    title: "CLAP CLAP CLAP CLAP",
    description: "Friends <3",
    fileName: "clapcalapclapclap",
    video: "Xs-HbHCcK58"
  },
  {
    title: "Yesss ! Yesss !",
    fileName: "yesyes",
    video: "jPmb0F00YPE"
  },
  {
    title: "HEYHEYHEY",
    description: "What's going on?",
    fileName: "heyheyhey",
    video: "ZZ5LpwO-An4"
  },
  {
    title: "Brain power",
    description:
      "O-oooooooooo AAAAE-A-A-I-A-U-JO-oooooooooooo AAE-O-A-A-U-U-A-E-eee-ee-eee AAAAE-A-E-I-E-A-JO-ooo-oo-oo-oo EEEEO-A-AAA-AAAAA﻿",
    fileName: "brainpower",
    video: "mj-v6zCnEaw"
  },
  {
    title: "Souffrir Ok?",
    description: "JE SUIS PAS VENUE ICI POUR SOUFFRIR, OK ?﻿",
    fileName: "souffrirok",
    video: "QglFGVDcuX8"
  },
  {
    title: "C'est génial",
    description: "Merci Link﻿",
    fileName: "cestgenial",
    video: "EBcTVQezd8o"
  },
  {
    title: "Qu'est-ce qu'on peut s'ennuyer",
    description: "Merci Link﻿",
    fileName: "ennuyerici",
    video: "EBcTVQezd8o"
  },
  {
    title: "Et flash ! Me voilà",
    description: "Merci Link﻿",
    fileName: "etflashmevoila",
    video: "EBcTVQezd8o"
  },
  {
    title: "Un petit baiser?",
    description: "Merci Link﻿",
    fileName: "etunpetitbaiser",
    video: "EBcTVQezd8o"
  },
  {
    title: "Il est écrit",
    description: "GANON﻿",
    fileName: "ilestecrit",
    video: "EBcTVQezd8o"
  },
  {
    title: "Mon petit",
    description: "C'est génial !﻿",
    fileName: "monpetit",
    video: "EBcTVQezd8o"
  },
  {
    title: "Squalala !",
    description: "Nous sommes partis !﻿",
    fileName: "squalala",
    video: "EBcTVQezd8o"
  },
  {
    title: "Notre projet",
    description: "Macron qui gueule, la base quoi﻿",
    fileName: "notreprojet",
    video: "rfuwy1jiJEQ"
  },
  {
    title: "Applaudissements",
    description: "Clap clap﻿",
    fileName: "applause"
  },
  {
    title: "Flim",
    description: "Ce flim n'est pas un flim sur le cyclimse﻿",
    fileName: "ceflim",
    video: "U7wR3_VQGUs"
  },
  {
    title: "Connasse",
    fileName: "connasse",
    video: "U7wR3_VQGUs"
  },
  {
    title: "Des chips !",
    fileName: "deschips",
    video: "U7wR3_VQGUs"
  },
  {
    title: "Fasciste de merde",
    fileName: "fascistedemerde",
    video: "U7wR3_VQGUs"
  },
  {
    title: "Georges",
    description: "enfin, politiquement﻿",
    fileName: "georgespolitiquement",
    video: "U7wR3_VQGUs"
  },
  {
    title: "Il en est mort",
    description: "Quel con﻿",
    fileName: "ilenestmort",
    video: "U7wR3_VQGUs"
  },
  {
    title: "iPhone",
    description: "Pour faire des blagues à vos collègues﻿",
    fileName: "iphone"
  },
  {
    title: "I play Pokemon Go",
    description: "E-VE-RY-DAY﻿",
    fileName: "iplaypokemongo",
    video: "vfc42Pb5RA8"
  },
  {
    title: "Is this real life",
    fileName: "isthisreallife",
    video: "txqiwrbYGrs"
  },
  {
    title: "A la ferme",
    fileName: "laferme",
    video: "U7wR3_VQGUs"
  },
  {
    title: "Me faire foutre?",
    description: "Ok, j'y vais﻿",
    fileName: "mefairefoutre",
    video: "U7wR3_VQGUs"
  },
  {
    title: "Pas de problème !",
    description: "Tu peux rester !﻿",
    fileName: "pasdeprobleme",
    video: "U7wR3_VQGUs"
  },
  {
    title: "Pitoyable",
    fileName: "pitoyable",
    video: "U7wR3_VQGUs"
  },
  {
    title: "Samsung",
    fileName: "samsung"
  },
  {
    title: "Everyday I'm...",
    fileName: "steppinonthebeach",
    video: "RcuzIJHJ7t8"
  },
  {
    title: "Monsieur n'est pas une tapette",
    description: "Monsieur est commissaire de police﻿",
    fileName: "tapettegeante",
    video: "ClWmF0eRvMM"
  },
  {
    title: "Par dessus la 3ème corde !",
    fileName: "troisiemecorde",
    video: "dKagEGavjZM"
  },
  {
    title: "Fouet",
    description: "Comme Indy !﻿",
    fileName: "whip"
  },
  {
    title: "Yaaaaaaay !",
    fileName: "yaaaaaaay"
  },
  {
    title: "Yep.",
    fileName: "yep",
    video: "U7wR3_VQGUs"
  },
  {
    title: "Mais t'es pas net",
    description: "Mais si, chui très net!",
    fileName: "maistespasnet",
    video: "bNTxvAnRC54"
  },
  {
    title: "Yeeeeees",
    description: "De Little Britain <3",
    fileName: "yeeeeees",
    video: "5rax50efCUk"
  },
  {
    title: "Super Green",
    fileName: "supergreen",
    video: "V4X2H9k2FCw"
  },
  {
    title: "Telepod 2000",
    fileName: "telepod2000",
    video: "GIVMqIoJWwc"
  },
  {
    title: "Je vous emmerde...",
    description: "Et je rentre à ma maison !",
    fileName: "emmerdemaison",
    video: "VzYMN7b7Tlc"
  },
  {
    title: "Saupiquet",
    description: "Le bon couscous qui nous plaît !",
    fileName: "saupiquet",
    video: "5UnM_hkcO0g"
  },
  {
    title: "DaRude - Sandstorm",
    fileName: "darude",
    video: "y6120QOlsfU"
  },
  {
    title: "Charal",
    fileName: "charal",
    video: "LzASfDaCYc8"
  },
  {
    title: "Juste Leblanc",
    fileName: "justeleblanc",
    video: "UYYwaFy05-U"
  },
  {
    title: "N'est-ce pas !",
    fileName: "nestcepas",
    video: "9Q4wvz5Uul8"
  },
  {
    title: "J'men bats les couilles",
    fileName: "jmenbatslescouilles",
    video: "tHGVH1AKe1Q"
  },
  {
    title: "Toujours debout",
    fileName: "toujoursdebout",
    video: "uv37yxc51bE"
  },
  {
    title: "Uncle F*cker",
    fileName: "unclefucker",
    video: "2iivGv58svY"
  },
  {
    title: "Et quand il pète...",
    fileName: "etquandilpeteiltrouesonslip",
    video: "jw5d_W-JPP4"
  },
  {
    title: "Oh Long Johnson",
    fileName: "ohlongjohnson",
    video: "kkwiQmGWK4c"
  },
  {
    title: "Cri",
    fileName: "cri"
  },
  {
    title: "Screaming goat",
    fileName: "screaminggoat",
    video: "SIaFtAKnqBU"
  },
  {
    title: "Too Many Cooks",
    fileName: "toomanycooks",
    video: "QrGrOK8oZG8"
  },
  {
    title: "7th Element",
    fileName: "7thelement",
    video: "DaCz_X_H0GI"
  },
  {
    title: "Ah !",
    fileName: "ah",
    video: "s5-nUCSXKac"
  },
  {
    title: "La mer noire",
    fileName: "lamernoire",
    video: "0SdcfsD_WVE"
  },
  {
    title: "Tequila Heineken",
    fileName: "tequilaheineken",
    video: "G1bkrbOFZxQ"
  },
  {
    title: "Champions",
    description: "We are the champions !",
    fileName: "champions",
    video: "_WE6q4mELjo"
  },
  {
    title: "Mon cucurbitacée",
    fileName: "cucurbitacee",
    video: "kzAZ0kR2B1Q"
  },
  {
    title: "The coconut nut",
    fileName: "coconut",
    video: "w0AOGeqOnFY"
  },
  {
    title: "Ingénieur informaticien",
    fileName: "ingenieur",
    video: "rlarCLhzfoU"
  },
  {
    title: "Jason le maçon",
    fileName: "jasonlemacon",
    video: "ejj7q5mqy34"
  },
  {
    title: "Dans ma petite voiture",
    fileName: "petitevoiture",
    video: "2bK5IboJKYs"
  },
  {
    title: "Michel forever tonight",
    fileName: "michelforevertonight",
    video: "yVzHAhtcDrk"
  }
];
