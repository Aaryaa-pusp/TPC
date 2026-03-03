import { useEffect } from 'react';

const GLOW_TARGET_CLASS = 'cursor-glow-target';
const AUTO_TARGET_SELECTOR = [
  'button',
  '[role="button"]',
  '[data-cursor-glow]',
  '[data-cursor-glow-card]',
  '.moving-border-card',
  '.cursor-glow-target',
  'div[class*="rounded"][class*="shadow"]',
  'section[class*="rounded"][class*="shadow"]',
  'article[class*="rounded"][class*="shadow"]'
].join(',');

const markGlowTargets = (root) => {
  if (!root || typeof root.querySelectorAll !== 'function') return;
  root.querySelectorAll(AUTO_TARGET_SELECTOR).forEach((node) => {
    if (node instanceof HTMLElement) {
      node.classList.add(GLOW_TARGET_CLASS);
    }
  });
};

const getGlowTarget = (node) => {
  if (!(node instanceof Element)) return null;
  const target = node.closest(`.${GLOW_TARGET_CLASS}`);
  return target instanceof HTMLElement ? target : null;
};

export default function useCursorGlow() {
  useEffect(() => {
    markGlowTargets(document);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((added) => {
          if (!(added instanceof Element)) return;
          if (added.matches(AUTO_TARGET_SELECTOR)) {
            added.classList.add(GLOW_TARGET_CLASS);
          }
          markGlowTargets(added);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const handlePointerMove = (event) => {
      const target = getGlowTarget(event.target);
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--cursor-glow-x', `${event.clientX - rect.left}px`);
      target.style.setProperty('--cursor-glow-y', `${event.clientY - rect.top}px`);
    };

    const handlePointerOut = (event) => {
      const target = getGlowTarget(event.target);
      if (!target) return;
      const next = event.relatedTarget;
      if (next instanceof Node && target.contains(next)) return;
      target.style.removeProperty('--cursor-glow-x');
      target.style.removeProperty('--cursor-glow-y');
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerOut);
    };
  }, []);
}
