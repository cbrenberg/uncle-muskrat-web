(function ($) {

  new WOW().init();

  jQuery(window).load(function () {
    jQuery("#preloader").delay(25).fadeOut("slow");
    jQuery("#load").delay(25).fadeOut("slow");
    // Get the modal
    var modal = document.getElementById("myModal");
    // When the page loads, open the modal 
    modal.style.display = "block";

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("modal-close")[0];
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      //if (event.target == modal) {
        modal.style.display = "none";
      //}
    }
  });

})(jQuery);
