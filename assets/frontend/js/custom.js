/*
	Template Name: Digiqole - News Magazine Newspaper HTML5 Template
	Author: Tripples
	Author URI: https://themeforest.net/user/tripples
	Description: Digiqole - News Magazine Newspaper HTML5 Template
	Version: 1.1
	1. Main slideshow
	2. Site search
	3. Owl Carousel
	4. Video popup
	5. Contact form
	6. Back to top
  
*/
jQuery(function ($) {
  "use strict";
  /* ----------------------------------------------------------- */

  /*  Mobile Menu
  /* ----------------------------------------------------------- */

  // $('.navbar-nav .menu-dropdown').on('click', function (event) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   $(this).siblings().slideToggle();
  // });
  // $('.nav-tabs[data-toggle="tab-hover"] > li > a').hover(function () {
  //   $(this).tab('show');
  // });
  /**-------------------------------------------------
      *Fixed HEader
      *----------------------------------------------------**/

  // $(window).on('scroll', function () {
  //   /**Fixed header**/
  //   if ($(window).scrollTop() > 250) {
  //     $('.is-ts-sticky').addClass('sticky fade_down_effect');
  //   } else {
  //     $('.is-ts-sticky').removeClass('sticky fade_down_effect');
  //   }
  // });
  /*==========================================================
  				search popup
  ======================================================================*/

  // if ($('.xs-modal-popup').length > 0) {
  //   $('.xs-modal-popup').magnificPopup({
  //     type: 'inline',
  //     fixedContentPos: false,
  //     fixedBgPos: true,
  //     overflowY: 'auto',
  //     closeBtnInside: false,
  //     callbacks: {
  //       beforeOpen: function beforeOpen() {
  //         this.st.mainClass = "my-mfp-slide-bottom xs-promo-popup";
  //       }
  //     }
  //   });
  // }
  /* ----------------------------------------------------------- */

  /*  Owl Carousel
  /* ----------------------------------------------------------- */
  //Trending slide


  // $(".trending-slide").owlCarousel({
  //   loop: true,
  //   animateIn: 'fadeIn',
  //   autoplay: true,
  //   autoplayTimeout: 3000,
  //   autoplayHoverPause: true,
  //   nav: true,
  //   margin: 30,
  //   dots: false,
  //   mouseDrag: false,
  //   slideSpeed: 500,
  //   navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
  //   items: 1,
  //   responsive: {
  //     0: {
  //       items: 1
  //     },
  //     600: {
  //       items: 1
  //     }
  //   }
  // });
  // $(".transing-slide-style2").owlCarousel({
  //   loop: true,
  //   autoplay: true,
  //   autoplayTimeout: 3000,
  //   autoplayHoverPause: true,
  //   nav: true,
  //   loop: true,
  //   margin: 10,
  //   dots: false,
  //   mouseDrag: false,
  //   slideSpeed: 500,
  //   navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
  //   items: 1,
  //   responsive: {
  //     0: {
  //       items: 1
  //     },
  //     480: {
  //       items: 2
  //     },
  //     768: {
  //       items: 3,
  //       mouseDrag: true
  //     }
  //   }
  // }); //Featured slide

  // $(".featured-slider").owlCarousel({
  //   loop: true,
  //   autoplay: false,
  //   autoplayHoverPause: true,
  //   nav: false,
  //   margin: 0,
  //   loop: false,
  //   dots: true,
  //   mouseDrag: true,
  //   touchDrag: true,
  //   slideSpeed: 500,
  //   navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
  //   items: 1,
  //   responsive: {
  //     0: {
  //       items: 1
  //     },
  //     600: {
  //       items: 1
  //     }
  //   }
  // });
  // /*======================== 
  //        trending topics 
  //   ==========================*/

  // if ($('#trending-slider,#post-block-slider').length > 0) {
  //   $('#trending-slider,#post-block-slider').owlCarousel({
  //     nav: false,
  //     items: 4,
  //     margin: 30,
  //     reponsiveClass: true,
  //     dots: true,
  //     autoplayHoverPause: true,
  //     loop: true,
  //     responsive: {
  //       // breakpoint from 0 up
  //       0: {
  //         items: 1
  //       },
  //       // breakpoint from 480 up
  //       480: {
  //         items: 2
  //       },
  //       // breakpoint from 768 up
  //       768: {
  //         items: 2
  //       },
  //       // breakpoint from 768 up
  //       1200: {
  //         items: 4
  //       }
  //     }
  //   });
  // }
  // /*======================== 
  // 	trending topics 
  // ==========================*/


  // if ($('#fullbox-slider').length > 0) {
  //   $('#fullbox-slider').owlCarousel({
  //     nav: false,
  //     items: 4,
  //     margin: 0,
  //     reponsiveClass: true,
  //     dots: false,
  //     autoplayHoverPause: true,
  //     loop: true,
  //     responsive: {
  //       // breakpoint from 0 up
  //       0: {
  //         items: 1
  //       },
  //       // breakpoint from 480 up
  //       480: {
  //         items: 2
  //       },
  //       // breakpoint from 768 up
  //       768: {
  //         items: 2
  //       },
  //       // breakpoint from 768 up
  //       1200: {
  //         items: 4
  //       }
  //     }
  //   });
  // } //Latest news slide


  // $(".latest-news-slide").owlCarousel({
  //   loop: false,
  //   animateIn: 'fadeInLeft',
  //   autoplay: false,
  //   autoplayHoverPause: true,
  //   nav: true,
  //   margin: 30,
  //   dots: false,
  //   mouseDrag: false,
  //   slideSpeed: 500,
  //   navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
  //   items: 3,
  //   responsive: {
  //     0: {
  //       items: 1
  //     },
  //     600: {
  //       items: 3
  //     }
  //   }
  // });
  /* ----------------------------------------------------------- */

  /*  Popup
  /* ----------------------------------------------------------- */

  // $(document).ready(function () {
  //   $(".gallery-popup").colorbox({
  //     rel: 'gallery-popup',
  //     transition: "fade",
  //     innerHeight: "500"
  //   });
  //   $(".popup").colorbox({
  //     iframe: true,
  //     innerWidth: 600,
  //     innerHeight: 400
  //   });
  // });
  /* ----------------------------------------------------------- */

  /*  Contact form
  /* ----------------------------------------------------------- */

  // $('#contact-form').submit(function () {
  //   var $form = $(this),
  //       $error = $form.find('.error-container'),
  //       action = $form.attr('action');
  //   $error.slideUp(750, function () {
  //     $error.hide();
  //     var $name = $form.find('.form-control-name'),
  //         $email = $form.find('.form-control-email'),
  //         $subject = $form.find('.form-control-subject'),
  //         $message = $form.find('.form-control-message');
  //     $.post(action, {
  //       name: $name.val(),
  //       email: $email.val(),
  //       subject: $subject.val(),
  //       message: $message.val()
  //     }, function (data) {
  //       $error.html(data);
  //       $error.slideDown('slow');

  //       if (data.match('success') != null) {
  //         $name.val('');
  //         $email.val('');
  //         $subject.val('');
  //         $message.val('');
  //       }
  //     });
  //   });
  //   return false;
  // });
/* ----------------------------------------------------------- */
  

  
  
  /** Revolution Slider */
  var revapi4;
  $(document).ready(function () {
    if ($("#rev_slider").revolution == undefined) {
      revslider_showDoubleJqueryError("#rev_slider");
    } else {
      revapi4 = $("#rev_slider").show().revolution({
        sliderType: "standard",
        jsFileLocation: "/vendors/revolution-slider/js/",
        sliderLayout: "auto",
        dottedOverlay: "none",
        delay: 9000,
        navigation: {
          keyboardNavigation: "off",
          keyboard_direction: "horizontal",
          mouseScrollNavigation: "off",
          onHoverStop: "off",
          arrows: {
            style: "uranus",
            enable: true,
            hide_onmobile: false,
            hide_under: 100,
            hide_onleave: true,
            hide_delay: 200,
            hide_delay_mobile: 1200,
            tmp: '',
            left: {
              h_align: "left",
              v_align: "center",
              h_offset: 80,
              v_offset: 0
            },
            right: {
              h_align: "right",
              v_align: "center",
              h_offset: 80,
              v_offset: 0
            }
          },
          touch: {
            touchenabled: "on",
            swipe_threshold: 75,
            swipe_min_touches: 1,
            swipe_direction: "horizontal",
            drag_block_vertical: false
          },
        },
        viewPort: {
          enable: true,
          outof: "pause",
          visible_area: "80%"
        },

        responsiveLevels: [1240, 1024, 778, 480],
        gridwidth: [1240, 1024, 778, 480],
        gridheight: [870, 730, 600, 550],
        lazyType: "smart",
        parallax: {
          type: "mouse",
          origo: "slidercenter",
          speed: 2000,
          levels: [2, 3, 4, 5, 6, 7, 12, 16, 10, 50],
        },
        shadow: 0,
        spinner: "off",
        stopLoop: "off",
        stopAfterLoops: -1,
        stopAtSlide: -1,
        shuffle: "off",
        autoHeight: "off",
        hideThumbsOnMobile: "off",
        hideSliderAtLimit: 0,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        disableProgressBar: "on",
        debugMode: false,
        fallbacks: {
          simplifyAll: "off",
          nextSlideOnWindowFocus: "off",
          disableFocusListener: false,
        }
      });
    }
  });	/*ready*/

  /** Loader */
  $(window).on('load', function () {
    setTimeout(function () {
      $('.loader-live').fadeOut();
    }, 1000);
  })

  /*  Back to top
  /* ----------------------------------------------------------- */

  /*scroll to top*/
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.scrollup').fadeIn();
    } else {
      $('.scrollup').fadeOut();
    }
  });

  $('.scrollup').on("click",function() {
    $("html, body").animate({
      scrollTop: 0
    }, 500);
    return false;
  });
});