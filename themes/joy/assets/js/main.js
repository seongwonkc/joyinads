(function () {
  var root = document.documentElement;

  // Theme toggle: follows the system until the reader picks one.
  var toggle = document.querySelector("[data-theme-toggle]");
  function isDark() {
    var t = root.dataset.theme;
    if (t === "dark") return true;
    if (t === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function syncToggle() {
    if (toggle) toggle.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
  }
  if (toggle) {
    syncToggle();
    toggle.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncToggle();
    });
  }

  // YouTube serves a 120px placeholder (sometimes with a 404) when maxresdefault doesn't exist.
  // If hqdefault is missing too, the video has been removed: drop the image (cards show their
  // type tile underneath) and hide the embed instead of offering a dead player.
  function useFallback(img) {
    var fb = img.getAttribute("data-fallback");
    if (fb && img.src !== fb) { img.src = fb; return; }
    var video = img.closest(".video");
    if (video) video.hidden = true;
    img.remove();
  }
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    function check() { if (img.naturalWidth && img.naturalWidth <= 120) useFallback(img); }
    img.addEventListener("error", function () { useFallback(img); });
    img.addEventListener("load", check);
    if (img.complete) { if (img.naturalWidth === 0 && img.currentSrc) useFallback(img); else check(); }
  });

  // Click-to-play video.
  document.querySelectorAll(".video-facade").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-yt");
      if (!id) return;
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0&modestbranding=1";
      iframe.title = btn.getAttribute("data-title") || "YouTube video";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      btn.closest(".video").classList.add("is-playing");
      btn.replaceWith(iframe);
      iframe.focus();
    });
  });

  // Header border + reading progress.
  var header = document.querySelector("[data-header]");
  var bar = document.querySelector("[data-progress]");
  var prose = document.querySelector(".prose");
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (bar && prose) {
      var r = prose.getBoundingClientRect();
      var total = r.height - window.innerHeight * 0.6;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      bar.style.transform = "scaleX(" + p + ")";
    }
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // Gentle reveal for cards as they enter.
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var items = document.querySelectorAll(".grid .card, .feature, .index-list li, .archive-year");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) return; // already visible: don't animate
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();
