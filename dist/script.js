const root = document.documentElement;
const hero = document.querySelector('.hero');
const mediaFrames = [...document.querySelectorAll('.tile')];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let targetProgress = 0;
let renderedProgress = 0;
let frame = 0;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (value) => value * value * (3 - 2 * value);

function readProgress() {
  const rect = hero.getBoundingClientRect();
  const sectionEntry = Math.max(hero.offsetHeight - window.innerHeight, window.innerHeight * 0.38);
  const distance = sectionEntry * 0.86;
  targetProgress = clamp(-rect.top / Math.max(distance, 1));
}

function renderHero() {
  const delta = targetProgress - renderedProgress;
  renderedProgress += reduceMotion ? delta : delta * 0.11;
  if (Math.abs(delta) < 0.0005) renderedProgress = targetProgress;

  const progress = smoothstep(renderedProgress);
  const lightProgress = smoothstep(clamp((progress - 0.12) / 0.76));
  const pulse = Math.sin(progress * Math.PI);

  root.style.setProperty('--progress', progress.toFixed(4));
  root.style.setProperty('--light-mix', lightProgress.toFixed(4));
  root.style.setProperty('--scene-lift', `${((1 - progress) * 36 - pulse * 12).toFixed(2)}px`);
  root.style.setProperty('--scene-sway', `${(-0.65 + progress * 1.1).toFixed(3)}deg`);

  if (!reduceMotion) {
    const viewportCenter = innerHeight * 0.5;
    mediaFrames.forEach((frameElement) => {
      const rect = frameElement.getBoundingClientRect();
      const frameCenter = rect.top + rect.height * 0.5;
      const range = innerHeight * 0.5 + rect.height * 0.5;
      const parallax = clamp((viewportCenter - frameCenter) / Math.max(range, 1), -1, 1) * 10;
      const reveal = smoothstep(clamp((innerHeight - rect.top) / Math.max(innerHeight * 0.32, 1)));

      frameElement.style.setProperty('--frame-y', `${((1 - reveal) * 42 + parallax).toFixed(2)}px`);
      frameElement.style.setProperty('--frame-scale', (0.975 + reveal * 0.025).toFixed(4));
      frameElement.style.setProperty('--frame-opacity', (0.28 + reveal * 0.72).toFixed(4));
    });
  }

  frame = Math.abs(targetProgress - renderedProgress) > 0.0005
    ? requestAnimationFrame(renderHero)
    : 0;
}

function requestUpdate() {
  readProgress();
  if (!frame) frame = requestAnimationFrame(renderHero);
}

readProgress();
renderedProgress = targetProgress;
renderHero();
addEventListener('scroll', requestUpdate, { passive: true });
addEventListener('resize', requestUpdate);
