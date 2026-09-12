(function () {
  const root = document.querySelector("[data-shot-carousel]");
  if (!root) return;

  const track = root.querySelector(".shot-track");
  const slides = Array.from(root.querySelectorAll(".shot-slide"));
  const preview = root.closest(".screenshot-carousel") || root.parentElement;
  const dots = Array.from(preview.querySelectorAll(".shot-dots button"));
  const prev = root.querySelector(".shot-prev");
  const next = root.querySelector(".shot-next");
  if (!track || slides.length === 0) return;

  let index = 0;
  let timer = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function centerOffset(slide) {
    const slideRect = slide.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const delta = slideRect.left + slideRect.width / 2 - (trackRect.left + trackRect.width / 2);
    return track.scrollLeft + delta;
  }

  function go(n, smooth) {
    index = (n + slides.length) % slides.length;
    track.scrollTo({
      left: Math.max(0, centerOffset(slides[index])),
      behavior: smooth === false || reduceMotion ? "auto" : "smooth",
    });
    update();
  }

  function update() {
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function nearestIndex() {
    const trackRect = track.getBoundingClientRect();
    const mid = trackRect.left + trackRect.width / 2;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const rect = slide.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  }

  function startAutoplay() {
    if (reduceMotion || slides.length < 2) return;
    stopAutoplay();
    timer = window.setInterval(() => go(index + 1), 4500);
  }

  function stopAutoplay() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  prev && prev.addEventListener("click", () => go(index - 1));
  next && next.addEventListener("click", () => go(index + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => go(i)));

  track.addEventListener("scroll", () => {
    const nextIndex = nearestIndex();
    if (nextIndex !== index) {
      index = nextIndex;
      update();
    }
  }, { passive: true });

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", startAutoplay);

  document.addEventListener("keydown", (event) => {
    if (!root.matches(":hover") && document.activeElement && !root.contains(document.activeElement)) return;
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "ArrowRight") go(index + 1);
  });

  window.addEventListener("load", () => go(0, false));
  update();
  startAutoplay();
})();
