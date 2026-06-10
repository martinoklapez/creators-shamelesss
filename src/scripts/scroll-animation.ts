const MOBILE_MEDIA = "(max-width: 900px), ((max-width: 1100px) and (orientation: portrait))";

function isMobileLayout(): boolean {
  return window.matchMedia(MOBILE_MEDIA).matches;
}

function applyMobileScrollState(home: HTMLElement, booking: HTMLElement | null): void {
  home.style.setProperty("--scroll-progress", "1");
  if (booking) {
    booking.classList.add("is-interactive");
  }
}

export function initScrollAnimation(): void {
  const hero = document.getElementById("brand-hero");
  const home = document.getElementById("brand-home");
  const booking = document.getElementById("booking-panel");
  if (!hero || !home) return;

  const mobileQuery = window.matchMedia(MOBILE_MEDIA);

  if (isMobileLayout()) {
    applyMobileScrollState(home, booking);
    return;
  }

  const supportsScrollTimeline = CSS.supports("animation-timeline", "scroll()");

  const update = () => {
    const scrollDistance = hero.offsetHeight - window.innerHeight;
    if (scrollDistance <= 0) {
      home.style.setProperty("--scroll-progress", "1");
      return;
    }

    const progress = Math.min(1, Math.max(0, window.scrollY / scrollDistance));
    home.style.setProperty("--scroll-progress", progress.toFixed(4));

    if (booking && supportsScrollTimeline) {
      booking.classList.toggle("is-interactive", progress > 0.5);
    }
  };

  const setInteractive = (progress: number) => {
    if (booking) {
      booking.classList.toggle("is-interactive", progress > 0.5);
    }
  };

  if (!supportsScrollTimeline) {
    const updateWithInteraction = () => {
      update();
      const progress = parseFloat(home.style.getPropertyValue("--scroll-progress") || "0");
      setInteractive(progress);
    };
    window.addEventListener("scroll", updateWithInteraction, { passive: true });
    window.addEventListener("resize", updateWithInteraction);
    updateWithInteraction();
  } else {
    const onScroll = () => {
      const scrollDistance = hero.offsetHeight - window.innerHeight;
      const progress = scrollDistance > 0 ? Math.min(1, window.scrollY / scrollDistance) : 1;
      setInteractive(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  mobileQuery.addEventListener("change", (event) => {
    if (event.matches) {
      applyMobileScrollState(home, booking);
    }
  });
}
