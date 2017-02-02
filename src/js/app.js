(function () {

    "use strict";

    global.$    = require("jquery");

    var howler  = require("howler");

    // console.log(howler);

    var YouTubeIframeLoader = require('youtube-iframe');

    var videoIds = {  movie           : 'XMM29e9X9Qc',
                      book            : '2rJZ4Tw8Ze4',
                      trailer         : 'OQUnH2m7Hbk',
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
                      scenes5         : 'TNUyJXkQjQA'
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
                      videoIds.scenes5
                  ];

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
        var value = (player.getCurrentTime() / player.getDuration()) * rangeMax;
        // Update the value of our progress bar accordingly.
        $('#progress-bar').val(value);

        // var maxHeight = $(window).height();
        // var tooltipHeight = $('#tooltip').height();

        // rangeMax = 5000
        // value ranges from 0 to 5000

        // min pixel value = (maxheight - tooltipHeight)
        // max pixel value = 0

        // 5000 / rangeMax = max pixel value

        // = min pixel value

        console.log(value, rangeMax);
        $('#tooltip').css({
          'top' : maxHeight - tooltipHeight
        })
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
          "margin-left" : 0
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
        videoId : videoIds.struggle1,
        startSeconds : menutime,
        loop : 1
      });
      player.mute();

      $('.choice').addClass('active').show();
      $('#controls').hide();
      $('#progress-bar').hide();

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
                  playlist : stream,
                  index    : Math.floor(Math.random() * stream.length)
                });
      } else {

        player.loadVideoById({
          videoId : videoIds[choice],
        });

      }

      $('.choice').removeClass('active').hide();
      $('#controls').show();
      $('#progress-bar').show();
      resizeVideo();
    })

}());
