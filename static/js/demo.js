// Nerfies index.js without the interpolation slider, plus "one clip with sound at a time".
window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
    });

    var options = {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000,
    }

    // Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    bulmaSlider.attach();
});

// Starting a clip with sound pauses every other clip that is playing with sound.
document.addEventListener('play', function(e) {
  var v = e.target;
  if (!(v instanceof HTMLVideoElement) || v.muted) return;
  document.querySelectorAll('video').forEach(function(o) {
    if (o !== v && !o.paused && !o.muted) o.pause();
  });
}, true);
// Unmuting a carousel clip counts as starting it with sound.
document.addEventListener('volumechange', function(e) {
  var v = e.target;
  if (!(v instanceof HTMLVideoElement) || v.muted || v.paused) return;
  document.querySelectorAll('video').forEach(function(o) {
    if (o !== v && !o.paused && !o.muted) o.pause();
  });
}, true);
