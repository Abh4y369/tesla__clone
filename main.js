// Shared helpers for both carousels
function initScrollCarousel({ scrollId, indicatorsId, options }) {
  const scrollBox = document.getElementById(scrollId);
  if (!scrollBox) return;

  const slides = Array.from(scrollBox.querySelectorAll('a'));
  const indicatorsContainer = document.getElementById(indicatorsId);
  if (!indicatorsContainer) return;

  // Determine type: anchors inside indicators (A1) or indicator elements (A2)
  const anchorIndicators = Array.from(indicatorsContainer.querySelectorAll('a'));
  const spanIndicators = Array.from(indicatorsContainer.querySelectorAll('span.indicator'));

  const autoUpdate = !!(options && options.autoUpdate);

  // If anchor indicators exist — attach smooth scroll on click and preserve anchor markup (A1 behavior).
  if (anchorIndicators.length > 0) {
    anchorIndicators.forEach((a, idx) => {
      a.addEventListener('click', (e) => {
        // prevent default jump, use smooth scrolling
        e.preventDefault();
        if (slides[idx]) {
          slides[idx].scrollIntoView({ behavior: 'smooth', inline: 'start' });
        }
      });
    });

    // If requested, optionally auto-update active state for anchorIndicators (but per A1 we keep FALSE)
    if (autoUpdate) {
      // mark first as active
      anchorIndicators.forEach((a) => a.classList.remove('active'));
      if (anchorIndicators[0]) anchorIndicators[0].classList.add('active');

      scrollBox.addEventListener('scroll', () => {
        let closest = 0;
        let minDist = Infinity;
        const scrollLeft = scrollBox.scrollLeft;
        slides.forEach((slide, i) => {
          const dist = Math.abs(slide.offsetLeft - scrollLeft);
          if (dist < minDist) { minDist = dist; closest = i; }
        });
        anchorIndicators.forEach((a, i) => {
          a.classList.toggle('active', i === closest);
        });
      });
    }
    return;
  }

  // If span indicators (A2 - auto updating):
  if (spanIndicators.length > 0) {
    // initialize first active
    spanIndicators.forEach((sp) => sp.classList.remove('active'));
    if (spanIndicators[0]) spanIndicators[0].classList.add('active');

    // click to scroll
    spanIndicators.forEach((sp, idx) => {
      sp.addEventListener('click', () => {
        if (slides[idx]) slides[idx].scrollIntoView({ behavior: 'smooth', inline: 'start' });
      });
    });

    // update on scroll
    if (autoUpdate) {
      scrollBox.addEventListener('scroll', () => {
        let closest = 0;
        let minDist = Infinity;
        const scrollLeft = scrollBox.scrollLeft;
        slides.forEach((slide, i) => {
          const dist = Math.abs(slide.offsetLeft - scrollLeft);
          if (dist < minDist) { minDist = dist; closest = i; }
        });
        spanIndicators.forEach((sp, i) => sp.classList.toggle('active', i === closest));
      });
    }
    return;
  }
}

// Instantiate for both carousels:
// Carousel 1: original anchor-indicator behavior (A1) -> autoUpdate: false
initScrollCarousel({ scrollId: 'caroScroll1', indicatorsId: 'caroIndicators1', options: { autoUpdate: false } });

// Carousel 2: span indicators with auto update (A2) -> autoUpdate: true
initScrollCarousel({ scrollId: 'caroScroll2', indicatorsId: 'caroIndicators2', options: { autoUpdate: true } });


// Video toggle (unchanged behavior)
function toggleVideo(id, btn) {
  const vid = document.getElementById(id);
  if (!vid) return;
  if (vid.paused) {
    vid.play();
    btn.innerHTML = "❚❚";
  } else {
    vid.pause();
    btn.innerHTML = "►";
  }
}
