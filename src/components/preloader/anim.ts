export const opacity = {
  initial: {
    opacity: 0
  },
  enter: {
    opacity: 0.75,
    transition: { duration: 1, delay: 0.2 }
  }
};

export const slideUp = {
  initial: {
    top: 0
  },
  // pointerEvents isn't numerically tweenable, so Framer Motion applies it the
  // instant the exit transition starts rather than at the end — this keeps the
  // fixed, full-viewport overlay from blocking clicks on the real page for the
  // ~1s slide-up animation (or longer, if that animation is ever delayed by a
  // busy main thread, a backgrounded tab, or third-party scripts).
  exit: {
    top: '-100dvh',
    pointerEvents: 'none' as const,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const, delay: 0.2 }
  }
};
