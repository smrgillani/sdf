$(document).ready(function() {
  $(document).on('touchstart', '.spreadsheetcomponent', function(e) {
    console.log('touchstart excel... disable scroll');
    $("body").disableScroll();
    e.stopPropagation();
  });

  $(document).on('touchstart', '.container-fluid', function(e) {
    console.log('touch outside excel... enable scroll');
    $("body").enableScroll();
  });

  $.fn.disableScroll = function() {
    window.oldScrollPos = $(window).scrollTop();

    $(window).on('scroll.scrolldisabler',function ( event ) {
      $(window).scrollTop( window.oldScrollPos );
      event.preventDefault();
    });
  };

  $.fn.enableScroll = function() {
    $(window).off('scroll.scrolldisabler');
  };

  /**
   * Forum > Events
   * This is a quick solution. I will update this and convert to pure angular in the future
   * as I got limited knowledge for now.
   */

  var navBarMenu = $('#navbar-menu');
  var employeeMenuItems = $('#employee-menuitems');
  var blueTheme = $('#blue-theme');
  var forumContent = $('#forum-content');
  var menuIcon = navBarMenu.find('i');
  
  function expandMenu() {
    menuIcon.html('expand_less');
      employeeMenuItems.removeClass('hide');
      blueTheme.removeClass('push-up');
      forumContent.removeClass('expand');
  }

  function collapseMenu() {
      menuIcon.html('menu');
      employeeMenuItems.addClass('hide');
      blueTheme.addClass('push-up');
      forumContent.addClass('expand');
  }

  $(document).on('click', '#navbar-menu', function() {
    if (menuIcon.html() == 'menu') {
      expandMenu();
    } else {
      collapseMenu();
    }
  });

  var position = $('#forum-content').scrollTop(); 

  // should start at 0

  $('#forum-content').scroll(function() {
      if (!$(navBarMenu).is(':visible')) return;

      var scroll = $(this).scrollTop();

      if(scroll > position) {
          console.log('scrollDown');
          menuIcon.html('menu');

          collapseMenu();
      } else {
          console.log('scrollUp');
      }

      position = scroll;
  });
});

// document.addEventListener('DOMContentLoaded', function() {
//   if (!Notification) {
//    alert('Desktop notifications not available in your browser. Try Chromium.');
//    return;
//   }
 
//   if (Notification.permission !== 'granted')
//    Notification.requestPermission();
//  });
 
 
//  function notifyMe() {
//   console.log('Notification:', Notification.requestPermission());
//   if (Notification.permission !== 'granted')
//    Notification.requestPermission();
//   else {
//    var notification = new Notification('Notification title', {
//     icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
//     body: 'Hey there! You\'ve been notified!',
//    });
//    notification.onclick = function() {
//     window.open('http://stackoverflow.com/a/13328397/1269037');
//    };
//   }
//  }