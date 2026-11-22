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

// Horizontal pair sliders (one Base vs JointREPA pair per slide): arrows, dots, counter, native swipe / scroll-snap.
// Leaving a slide pauses its clips.
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.pair-slider').forEach(function(sl) {
    var track = sl.querySelector('.pair-track');
    var slides = track.children;
    var dots = sl.querySelectorAll('.slider-dot');
    var count = sl.querySelector('.slider-count');
    var n = slides.length;
    var cur = 0;
    function index() { return Math.round(track.scrollLeft / Math.max(1, track.clientWidth)); }
    function setActive(i) {
      i = Math.min(n - 1, Math.max(0, i));
      cur = i;
      dots.forEach(function(d, k) { d.classList.toggle('is-active', k === i); });
      if (count) count.textContent = (i + 1) + ' / ' + n;
      Array.prototype.forEach.call(slides, function(s, k) {
        if (k !== i) s.querySelectorAll('video').forEach(function(v) { if (!v.paused) v.pause(); });
      });
    }
    function go(i) {
      i = ((i % n) + n) % n;
      setActive(i);                     // counter / dots follow the button at once, not only the scroll events
      var target = i * track.clientWidth;
      track.scrollTo({ left: target, behavior: 'smooth' });
      // where smooth scrolling does not run (old browsers, some embedded views) land on the slide anyway
      setTimeout(function() {
        if (cur === i && Math.abs(track.scrollLeft - target) > 2) track.scrollTo({ left: target, behavior: 'instant' });
      }, 700);
    }
    function update() { setActive(index()); }
    sl.querySelector('.slider-prev').addEventListener('click', function() { go(cur - 1); });
    sl.querySelector('.slider-next').addEventListener('click', function() { go(cur + 1); });
    dots.forEach(function(d, k) { d.addEventListener('click', function() { go(k); }); });
    var t = null;
    track.addEventListener('scroll', function() { clearTimeout(t); t = setTimeout(update, 80); });
    // every slide reserves the height of the longest prompt, so the clips start at the same place on every slide
    function equalize() {
      var ps = sl.querySelectorAll('.pair-prompt');
      ps.forEach(function(p) { p.style.minHeight = ''; });
      var h = 0;
      ps.forEach(function(p) { h = Math.max(h, p.getBoundingClientRect().height); });
      ps.forEach(function(p) { p.style.minHeight = Math.ceil(h) + 'px'; });
    }
    equalize();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(equalize);
    window.addEventListener('load', equalize);
    window.addEventListener('resize', function() { equalize(); track.scrollLeft = cur * track.clientWidth; });
  });
});

// KaTeX for the method section (inline \( \) and display \[ \]); called by the auto-render script's onload.
function renderMath() {
  var el = document.getElementById('method');
  if (el && window.renderMathInElement) {
    renderMathInElement(el, {
      delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
      throwOnError: false
    });
  }
}
