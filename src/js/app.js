(function () {

    "use strict";

    global.$    = require("jquery");
                  // require("jquery-ui-dist");

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
                      afsluitdijk     : 'Vwg9OamdZJk'
              }

    console.log(videoIds.movie);

    var player;
    var chapterPlayer;
    var time_update_interval;

    var videoWidth;
    var progressBarWidth = 25;

    var rangeMax = 5000;

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

    $('#volume-input').on('change', function () {
      player.setVolume($(this).val());

    });

    $(window).on('resize' , function(){
      resizeVideo();
    });

    function resizeVideo () {
      videoWidth = $(window).width() - progressBarWidth;

      console.log('fire in the hole');

      player.setSize( videoWidth , videoWidth * 9 / 16 );

      $('#player').css({
        "margin-top" : ($(window).height() - (videoWidth * 9 / 16) ) / 2,
        "margin-left" : progressBarWidth
      });
    }


    function onPlayerStateChange(event) {
      var state = player.getPlayerState();
      console.log(state);
      if(state === 0) {
        $('.choice').show();
      }
    }


    $('.choice > p').on('click' , function () {

      var choice = $(this).attr('id');

      if( choiche) {
        console.log(choice);
        player.loadVideoById({
          videoId : videoIds.vamos,
        });
      } else if (choiche === 'ch-2') {
        player.loadVideoById({
          videoId : videoIds.stevin,
        });
      } else if (choiche === 'ch-3') {
        player.loadVideoById({
          videoId : videoIds.mapsHouse,
        });
      }

      $('.choice').hide();
    })

}());
