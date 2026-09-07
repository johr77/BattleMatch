/* Load Battle Match scripts as soon as the HUD HTML exists — do not wait for React. */
(function bootBattleMatch() {
  if (window.__BM_BOOTING) return;
  window.__BM_BOOTING = true;
  var srcs = [
    "/js/config.js",
    "/js/sprites.js",
    "/js/vehicles.js",
    "/js/camp.js",
    "/js/depot.js",
    "/js/airport.js",
    "/three.min.js",
    "/js/game.js"
  ];
  var i = 0;
  function next() {
    if (i >= srcs.length) {
      if (typeof window.startGame === "function") window.startGame();
      return;
    }
    var s = document.createElement("script");
    s.src = srcs[i++];
    s.onload = next;
    s.onerror = function () {
      var el = document.getElementById("status");
      if (el) el.textContent = "Could not load " + s.src;
    };
    document.head.appendChild(s);
  }
  next();
})();
