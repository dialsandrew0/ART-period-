import { gsap } from "gsap";

// ------------------------------------------------------------------
// Centralized GSAP presets for ArtPeriod.
// Keep all timing/easing decisions here so motion stays consistent
// across the app instead of being reinvented per-component.
// ------------------------------------------------------------------

export const EASE = {
  standard: "power2.out",
  entrance: "power3.out",
  soft: "sine.inOut",
};

// Hover lift for artwork cards
export function hoverLift(el: Element) {
  const tl = gsap.timeline({ paused: true });
  tl.to(el, {
    y: -6,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
    duration: 0.25,
    ease: EASE.standard,
  });
  return tl;
}

// Staggered grid entrance for discovery feed / collection grids
export function gridStaggerIn(els: Element[] | NodeListOf<Element>) {
  return gsap.fromTo(
    els,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: EASE.entrance,
      stagger: 0.05,
    }
  );
}

// Modal / detail panel open
export function modalOpen(el: Element) {
  return gsap.fromTo(
    el,
    { opacity: 0, scale: 0.96 },
    { opacity: 1, scale: 1, duration: 0.3, ease: EASE.entrance }
  );
}

export function modalClose(el: Element, onComplete?: () => void) {
  return gsap.to(el, {
    opacity: 0,
    scale: 0.96,
    duration: 0.2,
    ease: EASE.standard,
    onComplete,
  });
}

// Filter panel expand/collapse
export function panelToggle(el: Element, open: boolean) {
  return gsap.to(el, {
    height: open ? "auto" : 0,
    opacity: open ? 1 : 0,
    duration: 0.3,
    ease: EASE.soft,
  });
}

// Fade-in for skeleton -> content swap
export function fadeIn(el: Element, delay = 0) {
  return gsap.fromTo(
    el,
    { opacity: 0 },
    { opacity: 1, duration: 0.4, ease: EASE.standard, delay }
  );
}
