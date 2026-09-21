const root = document.documentElement;
const hero = document.querySelector('.hero');
let ticking = false;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (value) => value * value * (3 - 2 * value);

function updateHero() {
  const rect = hero.getBoundingClientRect();
  const distance = hero.offsetHeight - window.innerHeight;
  const progress = clamp(-rect.top / Math.max(distance, 1));
  const lightProgress = smoothstep(clamp((progress - 0.12) / 0.76));

  root.style.setProperty('--progress', progress.toFixed(4));
  root.style.setProperty('--light-mix', lightProgress.toFixed(4));
  ticking = false;
}

function requestUpdate() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateHero);
  }
}

updateHero();
addEventListener('scroll', requestUpdate, { passive: true });
addEventListener('resize', requestUpdate);
