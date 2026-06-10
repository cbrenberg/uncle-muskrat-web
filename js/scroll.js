/* =================================================================
   Uncle Muskrat — rising-terrain scroll reveal
   Vanilla JS, no dependencies.

   On load the ridge headers (bg1/bg3/bg5) are stacked at the bottom
   of the pinned stage as a range. As the page scrolls, each layer is
   raised in turn — back (index 0) to front (index 2): its ridge lifts
   up and off the top while its content rises into view beneath it.
   Once a layer is raised its content fills the screen; the next layer
   then rises over it. A risen ridge is gone — only content remains.

   Disabled when prefers-reduced-motion (the CSS static fallback shows
   every section in normal flow instead).
   ================================================================= */
(function () {
  'use strict';

  var html = document.documentElement;
  if (!html.classList.contains('js-reveal')) {
    return; // reduced motion / no reveal — static fallback handles layout
  }

  var track = document.getElementById('reveal-track');
  var logo = document.querySelector('.stage__logo');
  var cue = document.querySelector('.scroll-cue');
  var layers = Array.prototype.slice.call(document.querySelectorAll('.layer'));
  var N = layers.length;
  if (!track || !N) { return; }

  // Visible height of each resting ridge at the bottom (fraction of the
  // viewport). Only the peaks show; the rest of the image hangs below the
  // fold. Back ridge peeks highest, front ridge lowest — a layered range.
  var PEEK = [0.33, 0.27, 0.22, 0.14];
  var RISE = 0.6; // fraction of a layer's scroll budget spent rising

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function ridgeHeight(layer) {
    if (!layer.__rh) {
      var img = layer.querySelector('.layer__ridge');
      layer.__rh = (img && img.offsetHeight) || 0;
    }
    return layer.__rh;
  }

  function setTrackHeight() {
    track.style.height = ((N + 1) * 100) + 'vh';
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }

  function update() {
    ticking = false;
    var H = window.innerHeight;
    var y = (window.pageYOffset || document.documentElement.scrollTop || 0) - track.offsetTop;
    var p = clamp(y / H, 0, N); // progress in "layers revealed"

    if (logo) {
      // Centered on load; stays put (behind the layers) so the first
      // content layer rises up and covers it. Gentle shrink + fade.
      var lp = clamp(p / 0.6, 0, 1);
      var scale = 1 - 0.2 * lp;
      logo.style.opacity = clamp(1 - p / 0.7, 0, 1);
      logo.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
    }
    if (cue) { cue.style.opacity = clamp(1 - p / 0.4, 0, 1); }

    for (var i = 0; i < N; i++) {
      var layer = layers[i];
      var hR = ridgeHeight(layer) || H * 0.25;
      var peek = (PEEK[i] != null ? PEEK[i] : 0) * H;
      var restY = H - peek;          // only the top `peek` of the ridge shows
      var endY = -hR - 2;            // ridge lifted fully off the top
      var ty;

      if (p <= i) {
        ty = restY;                  // not its turn yet — stacked at bottom
      } else if (p >= i + 1) {
        ty = endY;                   // already raised — content fills screen
      } else {
        var lp = p - i;              // 0..1 within this layer's turn
        if (lp <= RISE) {
          ty = restY + (endY - restY) * easeInOut(lp / RISE);
        } else {
          ty = endY;                 // hold for reading
        }
      }
      layer.style.transform = 'translateY(' + Math.round(ty) + 'px)';
    }
  }

  function refresh() {
    layers.forEach(function (l) { l.__rh = 0; });
    setTrackHeight();
    update();
  }

  setTrackHeight();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', refresh, { passive: true });
  window.addEventListener('load', refresh);
  update();
})();
