(function () {

    "use strict";

    global.$    = require("jquery");

    var howler  = require("howler");

    // console.log(howler);

    var YouTubeIframeLoader = require('youtube-iframe');

    var videoIds = {  movie           : 'XMM29e9X9Qc',
                      vamos           : 'kZHu9l4nrK8',
                      ark             : 'dyYwz4ygmQs',
                      couch           : 'n_n4IaQYYIU',
                      pasfoto         : '5akDcxBU2Ws',
                      stevin          : 'EV2vlQgX6A0',
                      mapsOverview    : 'ZvMt-RM2x8w',
                      mapsHouse       : '8ccRcyy7Jco',
                      mapsStreet      : 'Z3InHJ7VU9E',
                      hague           : 'SRRw8uA0EYs',
                      trailer         : 'OQUnH2m7Hbk',
                      afsluitdijk     : 'Vwg9OamdZJk',
                      struggle        : 'U5VG0NvcKNI'
              }

    var stream = [ videoIds.movie, videoIds.mapsStreet, videoIds.hague, videoIds.trailer ];

    console.log(videoIds.movie);

    var player;
    var chapterPlayer;
    var time_update_interval;
    var menutime;

    var choice;

    var videoWidth;
    var progressBarWidth = 25;

    var rangeMax = 5000;

    var water = ["audio/01.mp3","audio/02.mp3","audio/03.mp3","audio/04.mp3","audio/05.mp3","audio/06.mp3","audio/07.mp3","audio/08.mp3","audio/09.mp3","audio/10.mp3","audio/11.mp3","audio/12.mp3","audio/13.mp3","audio/14.mp3"];

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

    $('#progress-bar').on('mouseup touchend', function (e) {

      // Calculate the new time for the video.
      // new time in seconds = total duration in seconds * ( value of range input / 100 )
      var newTime = player.getDuration() * (e.target.value / rangeMax);

      // Skip video to new time.
      player.seekTo(newTime);

    });

    // This function is called by initialize()
    function updateProgressBar(){
        // Update the value of our progress bar accordingly.
        $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * rangeMax);
    }

    $('#play-toggle').on('click', function () {

      var button = $(this);

      if(player.getPlayerState() === 1) {
          player.pauseVideo();
          button.text('play');
      } else if (player.getPlayerState() === 2 || player.getPlayerState() === 0 ){
          player.playVideo();
          button.text('pause');
      }

    });

    $('#mute-toggle').on('click', function() {
        var mute_toggle = $(this);

        if(player.isMuted()){
            player.unMute();
            mute_toggle.text('mute');
        }
        else{
            player.mute();
            mute_toggle.text('unmute');
        }
    });

    $('#next-video').on('click' , function() {
      player.nextVideo();
      console.log('next');
    });

    $('#volume-input').on('change', function () {
      player.setVolume($(this).val());

    });

    $(window).on('resize' , function(){
      resizeVideo();
    });

    function resizeVideo () {

      videoWidth = $(window).width() - progressBarWidth;

      if($('.choice').hasClass('active')) {
        console.log('menu');

        player.setSize( ($(window).height() * 16 ) / 9 , $(window).height() );

        $('#player').css({
          "margin-top" : 0,
          "margin-left" : progressBarWidth
        });

      }
      if( !$('.choice').hasClass('active') ) {

        console.log('fire in the hole');

        player.setSize( videoWidth , videoWidth * 9 / 16 );

        $('#player').css({
          "margin-top" : ($(window).height() - (videoWidth * 9 / 16) ) / 2,
          "margin-left" : progressBarWidth
        });
      }
    }

    function playWater() {
      console.log('water');

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
        videoId : videoIds.struggle,
        startSeconds : menutime,
        loop : 1
      });
      player.mute();

      $('.choice').addClass('active').show();

      resizeVideo();

      window.setInterval( function(){
        playWater()
      }, randomInterval(1000, 4000) );

    }

    function onPlayerStateChange(event) {
      var state = player.getPlayerState();
      console.log(state);
      if(state === 0 || state === 5 ) {
        openChoices();
      }
    }

    $('#skip-video').on('click', function() {
      console.log('yo');
      player.stopVideo();
    });


    $('.choice > p').on('click' , function () {

      menutime = player.getCurrentTime();
      console.log(menutime);

      choice = $(this).attr('id');

      if (choice === 'stream') {
        player.loadPlaylist({
                  playlist: stream
                });
      } else {
        player.loadVideoById({
          videoId : videoIds[choice],
        });
      }

      $('.choice').removeClass('active').hide();
    })

}());
