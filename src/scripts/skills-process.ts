const journey = document.querySelector<HTMLElement>('[data-process-journey]');

if (journey) {
  const cards = Array.from(journey.querySelectorAll<HTMLElement>('.process-card'));
  const paths = Array.from(journey.querySelectorAll<SVGPathElement>('.process-connection'));
  const gradients = Array.from(journey.querySelectorAll<SVGLinearGradientElement>('linearGradient'));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const activeAnimations = new Set<Animation>();
  let started = false;
  let finished = false;

  const drawConnections = () => {
    paths.forEach((path, index) => {
      const from = cards[index];
      const to = cards[index + 1];
      // Layout offsets remain stable while the cards animate into place.
      const sameRow = Math.abs(from.offsetTop - to.offsetTop) < 48;
      const x1 = from.offsetLeft + from.offsetWidth / (sameRow ? 1 : 2);
      const y1 = from.offsetTop + from.offsetHeight / (sameRow ? 2 : 1);
      const x2 = to.offsetLeft + (sameRow ? 0 : to.offsetWidth / 2);
      const y2 = to.offsetTop + (sameRow ? to.offsetHeight / 2 : 0);
      Object.entries({ x1, y1, x2, y2 }).forEach(([name, value]) => gradients[index].setAttribute(name, String(value)));
      if (sameRow) {
        const bend = (x2 - x1) * .65;
        path.setAttribute('d', `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`);
      } else {
        const middleY = (y1 + y2) / 2;
        // A gentle S-curve joins stacked steps and the two-column row wrap.
        const bend = Math.abs(x1 - x2) < 1 ? 42 : 0;
        path.setAttribute('d', `M ${x1} ${y1} C ${x1 + bend} ${middleY}, ${x2 - bend} ${middleY}, ${x2} ${y2}`);
      }
    });
  };

  const revealAll = () => {
    finished = true;
    cards.forEach(card => card.classList.add('is-revealed'));
    paths.forEach(path => path.classList.add('is-drawn'));
    activeAnimations.forEach(animation => animation.cancel());
    activeAnimations.clear();
    journey.dataset.sequence = 'complete';
  };

  const animate = async (element: Element, frames: Keyframe[], duration: number, completeClass: string) => {
    if (finished) return;
    const animation = element.animate(frames, { duration, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards' });
    activeAnimations.add(animation);
    await animation.finished;
    element.classList.add(completeClass);
    activeAnimations.delete(animation);
    animation.cancel();
  };

  const play = async () => {
    if (started || finished) return;
    started = true;
    journey.dataset.sequence = 'running';
    try {
      for (let index = 0; index < cards.length && !finished; index++) {
        if (index > 0) {
          await animate(paths[index - 1], [
            { strokeDashoffset: '1', opacity: 1 },
            { strokeDashoffset: '0', opacity: 1 },
          ], 750, 'is-drawn');
        }
        await animate(cards[index], [
          { opacity: 0, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], 480, 'is-revealed');
      }
    } catch {
      // Cancellation or an unsupported animation must never hide the content.
    } finally {
      revealAll();
    }
  };

  drawConnections();
  if (typeof ResizeObserver !== 'undefined') {
    const resize = new ResizeObserver(drawConnections);
    resize.observe(journey);
    cards.forEach(card => resize.observe(card));
  } else {
    window.addEventListener('resize', drawConnections, { passive: true });
  }

  if (!motion.matches && 'IntersectionObserver' in window && typeof Element.prototype.animate === 'function') {
    journey.classList.add('is-sequenced');
    journey.dataset.sequence = 'ready';
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      void play();
    }, { threshold: .15 });
    observer.observe(cards[0]);
    motion.addEventListener('change', () => {
      if (motion.matches) {
        observer.disconnect();
        revealAll();
      }
    });
  } else {
    revealAll();
  }
}
