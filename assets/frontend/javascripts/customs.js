    (function ($) {
  'use strict'; 
  
  $(window).ready(function () {
    // slide for list doctor
    // $('.category-doctor').slick({
    //   dots: false,
    //   arrows: true,
    //   infinite: false,
    //   speed: 300,
    //   autoplay: false
    // });

    // popover
    $("[data-toggle=popover]").popover({
      html : true,
      trigger: 'hover',
      placement: function (context, source) {
        var position = $(source).position();
        if (position.left > 515) {
          return "left";
        }
        if (position.left < 515) {
          return "right";
        }
        if (position.top < 110){
          return "bottom";
        }
        return "top";
      },
      content: function() {
        var content = $(this).attr("data-popover-content");
        return $(content).children(".popover-body").html();
      }
    });
    
    // Show less/more article
    var showChar = 200;
    // var ellipsestext = "...";
    var moretext = "Show more";
    var lesstext = "Show less";
    
    $('.collapsed-content').each(function() {
      var content = $(this).html();
      if(content.length > showChar) {
        var c = content.substr(0, showChar);
        var h = content.substr(showChar, content.length - showChar);
        var html = c + '<span class="more-ellipses">' + '&nbsp;</span><div class="more-content"><span>' + h + '</span><div class="more-erea"><a href="" class="more">' + moretext + '</a></div></div>';
        $(this).html(html);
      }
    });
 
    $(".more").click(function(){
      if($(this).hasClass("less")) {
        $(this).removeClass("less");
        $(this).html(moretext);
      } else {
        $(this).addClass("less");
        $(this).html(lesstext);
      }
      $(this).parent().prev().toggle();
      $(this).prev().toggle();
      return false;
    });
    
    // slide for teacher
    $(".teachers").slick({
      dots: false,
      arrows: true,
      infinite: true,
      speed: 500,
      autoplay: false,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          }
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          }
        }
      ]
    });

    $(window).scroll(function() {
      var $header = $('#header'),
        headerHeight = $header.height();
      var $mainNav = $('#nav-kindie'),
        mainNavOffsetTop = $mainNav.offset().top;
      // if ($(window).width() <= 768) {  
      //   $('#main-content').css({'paddingTop' : headerHeight});
      // }
      // else if ($(window).width() > 768 && $(this).scrollTop() > 0) {
      //   $header.addClass('fixed-nav');
      //   $('#main-content').css({'paddingTop' : headerHeight});    
      // } else {
      //   $header.removeClass('fixed-nav');
      //   $('#main-content').css({'paddingTop' : 0}); 
      // }
      if ($(this).scrollTop() > 0) {
        $header.addClass('fixed-nav');
        $('#main-content').css({'paddingTop' : headerHeight});    
      } else {
        $header.removeClass('fixed-nav');
        $('#main-content').css({'paddingTop' : 0}); 
      }
    });
  });

  // **********************************************************************//
  // ! Window resize
  // **********************************************************************//
  $(window).on('resize', function () {
    var $header = $('#header'),
      headerHeight = $header.height();
    var $mainNav = $('#nav-kindie'),
      mainNavOffsetTop = $mainNav.offset().top;
    if ($(this).scrollTop() > 0) {
      $header.addClass('fixed-nav');
      $('#main-content').css({'paddingTop' : headerHeight});    
    } else {
      $header.removeClass('fixed-nav');
      $('#main-content').css({'paddingTop' : 0}); 
    }
  });

})(jQuery);