(function () {

    "use strict";

    var howler  = require("howler");

    var YouTubeIframeLoader = require('youtube-iframe');

    var videoIds = {  movie           : 'XMM29e9X9Qc',
                      book            : '2rJZ4Tw8Ze4',
                      trailer         : 'OQUnH2m7Hbk',
                      credits         : 'jH5vL3v3nm8',
                      maps            : 'ZvMt-RM2x8w',
                      maps1           : '8ccRcyy7Jco',
                      maps2           : 'Z3InHJ7VU9E',
                      struggle1       : 'U5VG0NvcKNI',
                      struggle2       : 'jpVxYbuuaio',
                      hero            : 'EmK58gR58rw',
                      welcome         : 'vBykWs3s3Rg',
                      welcome2        : '8IlFMzbeXTc',
                      y2037           : 'y4zQpCmq2rg',
                      hague           : 'SRRw8uA0EYs',
                      vamos           : 'mWyIgNd5Z0M',
                      water           : 'nnd9AsbAhVc',
                      finger          : 'WDlHel9fMFY',
                      underwater      : 'Gp_2teRctEg',
                      ark             : 'sog9BTOums4',
                      scenes1         : 'Ka5Lhk3g2LE',
                      scenes2         : 'uNU4a6HBAds',
                      scenes3         : 'n_n4IaQYYIU',
                      scenes4         : 'AOmtkg4NyMM',
                      scenes5         : 'TNUyJXkQjQA',
                      scenes6         : 'DCX3-LeNurU',
                      scenes7         : 'c_gGPrVzYuE',
                      scenes8         : 'EVKCksIfTyI',
                      scenes9         : 'CEFW1yONrYg',
                      scenes10        : 'tVfxNwPVFMQ',
                      scenes11        : 'tieJvVRUa_o',
                      scenes12        : 'dTqqT_yWSg4',
                      scenes13        : 'klrSJi1fe9k',
                      scenes14        : 'srT5ShkdJYY',
                      scenes15        : 'OW0ogQPbKsM',
                      scenes16        : 'PrX2tgd0Txo',
                      scenes17        : 'umHs-OaqCHQ',
                      scenes18        : 'BC503_okeCg',
                      scenes19        : 'E3LfWAWii_w',
                      scenes20        : '47uGqQfTfoE',
                      scenes21        : 'Lnjsau3wdvo',
                      scenes22        : 'hWed1Hv9Bvk',
                      scenes23        : 'FBkKUBB-tZM',
                      scenes24        : 'A-hiHpzHmdM',
                      scenes25        : '7qFbGwJwHT0',
                      scenes26        : 'bBUMPiol-4w',
                      scenes27        : 'AyXkeSQACV8',
                      scenes28        : 'vn3lBRFX-n0'
              }

    var stream = [    videoIds.maps,
                      videoIds.maps1,
                      videoIds.maps2,
                      videoIds.struggle1,
                      videoIds.struggle2,
                      videoIds.hero,
                      videoIds.welcome,
                      videoIds.welcome2,
                      videoIds.y2037,
                      videoIds.hague,
                      videoIds.vamos,
                      videoIds.water,
                      videoIds.finger,
                      videoIds.underwater,
                      videoIds.ark,
                      videoIds.scenes1,
                      videoIds.scenes2,
                      videoIds.scenes3,
                      videoIds.scenes4,
                      videoIds.scenes5,
                      videoIds.scenes6,
                      videoIds.scenes7,
                      videoIds.scenes8,
                      videoIds.scenes9,
                      videoIds.scenes10,
                      videoIds.scenes11,
                      videoIds.scenes12,
                      videoIds.scenes13,
                      videoIds.scenes14,
                      videoIds.scenes15,
                      videoIds.scenes16,
                      videoIds.scenes17,
                      videoIds.scenes18,
                      videoIds.scenes19,
                      videoIds.scenes20,
                      videoIds.scenes21,
                      videoIds.scenes22,
                      videoIds.scenes23,
                      videoIds.scenes24,
                      videoIds.scenes25,
                      videoIds.scenes26,
                      videoIds.scenes27,
                      videoIds.scenes28
                  ];

    var player;
    var chapterPlayer;
    var time_update_interval;
    var menutime;

    var videoWidth;
    var progressBarWidth = 25;

    var rangeMax = 5000;

    var check;
    var thisRandom = Math.floor(Math.random() * stream.length);
    var pastRandom = [];

    var showIt;

    var water = ["audio/01.mp3","audio/02.mp3","audio/03.mp3","audio/04.mp3","audio/05.mp3","audio/06.mp3","audio/07.mp3","audio/08.mp3","audio/09.mp3","audio/10.mp3","audio/11.mp3","audio/12.mp3","audio/13.mp3","audio/14.mp3"];

    var streaming = false,
        choice = false;

    YouTubeIframeLoader.load(function(YT) {

        videoWidth = $(window).width() - progressBarWidth;

        player = new YT.Player('player', {
          height: videoWidth * 9 / 16 ,
          width: videoWidth,
          videoId: videoIds.movie,
          playerVars: {
            'color' : 'white',
            'controls' : 0,
            'showinfo' : 0,
            'rel' : 0
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });

      });

    function onPlayerReady(event) {
      $('#initial').fadeOut(500);

      event.target.playVideo();
      // event.target.mute();

      // Update the controls on load
      updateTimerDisplay();
      updateProgressBar();
      resizeVideo();

      // Clear any old interval.
      clearInterval(time_update_interval);

      // Start interval to update elapsed time display and
      // the elapsed part of the progress bar every second.
      time_update_interval = setInterval(function () {
          updateTimerDisplay();
          updateProgressBar();
      }, 100);

    }

    // This function is called by initialize()
    function updateTimerDisplay(){
        // Update current time text display.
        $('#current-time').text(formatTime( player.getCurrentTime() ));
        $('#duration').text(formatTime( player.getDuration() ));
    }

    function formatTime(time){
        time = Math.round(time);

        var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        return minutes + ":" + seconds;
    }

    function displayTitle () {
      console.log('show title');

      // display current
      var current = player.getVideoData().title;
      current = current.split('Drenthe aan Zee |');

      document.title = "Drenthe aan Zee" + current;

      $('#title > #current').empty();
      $('#title > #current').append(current);
      $('#title').fadeIn(300).css("display","inline-block");

      showIt = setTimeout(function() { $('#title').fadeOut(500); }, 5000);
    }

    function hideTitle() {
      clearTimeout(showIt);
      console.log(showIt);
      $('#title').fadeOut(500);
    }

    // This function is called by initialize()
    function updateProgressBar(){
        var value = (player.getCurrentTime() / player.getDuration()) * rangeMax;
        // Update the value of our progress bar accordingly.
        $('#progress-bar').val(value);

        var range = $("input[type='range']");

        var height = range.height();
        var newPoint = (range.val() - range.attr("min")) / (range.attr("max") - range.attr("min"));
        var offset = 0;
        var newPlace;

        if (newPoint < 0) { newPlace = 0; }
        else if (newPoint > 1) { newPlace = height; }
        else { newPlace = height * newPoint + offset; offset -= newPoint; }

        $('#progress > img').css({
          "top" : height - newPlace
        });
    }


    //
    // Buttons
    //

    $('#play-toggle').on('click', function () {

      var button = $(this);

      if(player.getPlayerState() === 1) {
          player.pauseVideo();
          button.addClass('active');
      } else if (player.getPlayerState() === 2 || player.getPlayerState() === 0 ){
          player.playVideo();
          button.removeClass('active');
      }

    });

    $('#mute-toggle').on('click', function() {
        toggleMute();
    });

    function newRandom() {
      // make new random number
      var tempRandom = Math.floor(Math.random() * stream.length);

      return tempRandom;
    }

    function selectRandom() {
      var tryRandom = newRandom();

      if( jQuery.inArray( tryRandom, pastRandom ) >= 0 ) {

        console.log('fail : ' + tryRandom );

        // try again, but not if all elements have been done already
        if(pastRandom.length === stream.length ) {

          pastRandom = [];
          selectRandom();


        } else {
          selectRandom();
        }

      } else {
        thisRandom = tryRandom;
        console.log('succes : ' + thisRandom );
        return;
      }
    }

    function nextVideo() {

      check = jQuery.inArray(thisRandom, pastRandom);

      if(pastRandom.length === stream.length ) {
        // all videos played now. Clear array
        console.log('all videos played');

        pastRandom = [];

      } else {
        // not all videos played
        console.log('not all videos played');

        // if a new random number has been drawn
        if( !(check >= 0) ) {
          // play
          player.playVideoAt(thisRandom);

          // add past video indexes to array
          pastRandom.push(thisRandom);
          console.log('played: ' + pastRandom );

          // make new random value
          selectRandom();

        }
        // else {
        //   // if the number has occurred before
        //   console.log('been there before: ' +  thisRandom );
        //   thisRandom = Math.floor(Math.random() * stream.length);
        // }

      }

    }

    $('#next-video').on('click' , function() {
      nextVideo();
    });

    $(window).on('resize' , function(){
      resizeVideo();
    });

    //
    // Fullscreen
    //

    var playerElement = document.getElementById('wrap');
    var full = false;

    $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
        //do something;
        if (full === false) {
          $('#fullscreen').addClass('active');
          full = true;
        } else {
          $('#fullscreen').removeClass('active');
          full = false;
        }
    });

    function toggleFullScreen() {
      if ((document.fullScreenElement && document.fullScreenElement !== null) ||
       (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }

      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }

      }
    }

    $('#fullscreen').on('click', function(){
      console.log('clicked');
      toggleFullScreen();

    });


    //
    // Resizing
    //

    function resizeVideo () {

      videoWidth = $(window).width();

      if($('.choice').hasClass('active')) {

        player.setSize( ($(window).height() * 16 ) / 9 , $(window).height() );

        $('#player').css({
          "margin-top" : 0,
          "margin-left" : 0
        });

      }
      if( !$('.choice').hasClass('active') ) {

        player.setSize( videoWidth , videoWidth * 9 / 16 );

        $('#player').css({
          "margin-top" : ($(window).height() - (videoWidth * 9 / 16) ) / 2,
        });
      }
    }

    //
    // Choice menu
    //

    var mute = false;

    function muteStuff() {
      $('#mute-toggle').addClass('active');
      player.mute();
      mute = true;
    }

    function unMuteStuff() {
      $('#mute-toggle').removeClass('active');
      player.unMute();
      mute = false;
    }

    function toggleMute() {
      console.log('fired' + player.isMuted() );
      if (mute === false && !player.isMuted() ) {
        muteStuff();
      } else {
        unMuteStuff();
      }
    }

    function playWater() {
      var sound = new Howl({
        src: [ '' +water[Math.floor(Math.random() * water.length)]+ '' ]
      });

      sound.play();
    }

    function randomInterval (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function openChoices() {

      player.loadVideoById({
        videoId : videoIds.struggle1,
        startSeconds : menutime,
        loop : 1
      });

      muteStuff();

      $('#menu, #controls, #title').hide();
      $('.choice').addClass('active').show();

      resizeVideo();

    }

    //
    // States
    //

    function onPlayerStateChange(event) {
      var state = player.getPlayerState();
      // console.log(state);
      if(state === 0 || state === 5 ) {
        // stopped
        if(!streaming) {
          openChoices();
        } else {
          nextVideo();
        }
      }
      if(state === 1) {
        // playing
        hideTitle();
        $('#play-toggle').removeClass('active');
        $('#loading').fadeOut(500);
        $('#progress > img').removeClass('loading');
        if( !$('.choice').hasClass('active') ) {
            $('#progress, #menu').show();
            displayTitle();
        }
        if( $('.choice').hasClass('active') ) {
            $('#progress, #menu').hide();
        }
      }
      if(state === 2) {
        // paused
        $('#play-toggle').addClass('active');
        hideTitle();
      }
      if(state === 3 ) {
        if( !$('.choice').hasClass('active') ) {
          $('#loading').fadeIn(500);
          $('#progress > img').addClass('loading');
        }
        if( $('.choice').hasClass('active') ) {
            $('#progress, #menu').hide();
        }
      hideTitle();
      }
    }

    $('#menu').on('click', function() {
      streaming = false;
      player.stopVideo();
    });

    $('.choice p > span').on('mouseenter', function() {
      playWater();
    });

    $('.choice p > span').on('click' , function () {

      unMuteStuff();

      menutime = player.getCurrentTime();
      console.log(menutime);

      choice = $(this).attr('id');

      var randomVideo = Math.floor(Math.random() * stream.length);

      if (choice === 'stream') {
        streaming = true;
        player.loadPlaylist({
                  playlist : stream,
                  index    : randomVideo
                });
        $('#next-video').css({ 'display' : 'inline-block' });
      }

      else {

      streaming = false;
      $('#next-video').css({ 'display' : 'none' });

      player.loadVideoById({
        videoId : videoIds[choice],
      });

      player.unMute();
      $('mute-toggle').removeClass('active');
      }

      $('.choice').removeClass('active').hide();
      $('#controls').show();
      $('#progress-bar').show();
      resizeVideo();
    });

//
// Not using?
//

$('#progress-bar').on('mouseup touchend', function (e) {

  // Calculate the new time for the video.
  // new time in seconds = total duration in seconds * ( value of range input / 100 )
  var newTime = player.getDuration() * (e.target.value / rangeMax);

  // Skip video to new time.
  player.seekTo(newTime);

});



}());
