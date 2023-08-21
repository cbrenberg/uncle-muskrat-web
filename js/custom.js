(function ($) {

  new WOW().init();

  jQuery(window).load(function () {
    jQuery("#preloader").delay(100).fadeOut("slow");
    jQuery("#load").delay(100).fadeOut("slow");

    // fixes issue with variable viewport height on mobile
    $(function(){ $('body').css('height',$(window).height()); })
  });

})(jQuery);
