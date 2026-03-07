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
const INTERACTIVE_CURSOR_SELECTOR = [
  'a',
  'button',
  '[role="button"]',
  'input',
  'textarea',
  'select',
  'label',
  '[data-cursor-glow]'
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
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const cursorAura = hasFinePointer ? document.createElement('div') : null;
    const cursorCore = hasFinePointer ? document.createElement('div') : null;

    const isDarkThemeEnabled = () => {
      const root = document.documentElement;
      const body = document.body;
      return (
        root.classList.contains('dark') ||
        body.classList.contains('dark') ||
        root.getAttribute('data-theme') === 'dark' ||
        body.getAttribute('data-theme') === 'dark'
      );
    };

    const syncCursorAuraVisibility = () => {
      if (!cursorAura || !cursorCore) return;
      if (isDarkThemeEnabled()) {
        document.body.classList.add('cursor-glow-theme-active');
        cursorAura.classList.add('is-visible');
        cursorCore.classList.add('is-visible');
        return;
      }
      document.body.classList.remove('cursor-glow-theme-active');
      cursorAura.classList.remove('is-visible', 'is-active');
      cursorCore.classList.remove('is-visible', 'is-active');
    };

    if (cursorAura && cursorCore) {
      cursorAura.className = 'global-cursor-glow';
      cursorCore.className = 'global-cursor-core';
      document.body.appendChild(cursorAura);
      document.body.appendChild(cursorCore);
      syncCursorAuraVisibility();
    }

    const observer = new MutationObserver((mutations) => {
      try {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((added) => {
            if (!(added instanceof Element)) return;
            if (added.matches(AUTO_TARGET_SELECTOR)) {
              added.classList.add(GLOW_TARGET_CLASS);
            }
            markGlowTargets(added);
          });
        });
      } catch (err) {
        console.error('CursorGlow MutationObserver error:', err);
      }
    });

    try {
      observer.observe(document.body, { childList: true, subtree: true });
    } catch (err) {
      console.error('Failed to observe document.body:', err);
    }

    const themeObserver = new MutationObserver(() => {
      try {
        syncCursorAuraVisibility();
      } catch (err) {
        console.error('CursorGlow themeObserver sync error:', err);
      }
    });

    try {
      // Only observe documentElement, since that is where the 'dark' and 'data-theme'
      // attributes are toggled by useTheme.js. Observing body causes an infinite loop
      // when syncCursorAuraVisibility adds 'cursor-glow-theme-active' to the body classList.
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    } catch (err) {
      console.error('Failed to observe theme changes:', err);
    }

    const handlePointerMove = (event) => {
      try {
        if (cursorAura && cursorCore && isDarkThemeEnabled()) {
          const auraHalfSize = 72;
          const coreHalfSize = 7;
          cursorAura.style.transform = `translate3d(${event.clientX - auraHalfSize}px, ${event.clientY - auraHalfSize}px, 0)`;
          cursorCore.style.transform = `translate3d(${event.clientX - coreHalfSize}px, ${event.clientY - coreHalfSize}px, 0)`;
          cursorAura.classList.add('is-active');
          cursorCore.classList.add('is-active');

          const isInteractiveTarget = event.target instanceof Element
            && event.target.closest(INTERACTIVE_CURSOR_SELECTOR);
          cursorAura.classList.toggle('is-hover-intent', Boolean(isInteractiveTarget));
          cursorCore.classList.toggle('is-hover-intent', Boolean(isInteractiveTarget));
        }

        const target = getGlowTarget(event.target);
        if (!target) return;
        const rect = target.getBoundingClientRect();
        target.style.setProperty('--cursor-glow-x', `${event.clientX - rect.left}px`);
        target.style.setProperty('--cursor-glow-y', `${event.clientY - rect.top}px`);
      } catch (err) {
        // Silently catch to not spam the console on rapid pointer moves, but you can log if needed:
        // console.error('CursorGlow handlePointerMove error:', err);
      }
    };

    const handlePointerOut = (event) => {
      try {
        if (cursorAura && cursorCore && !event.relatedTarget) {
          cursorAura.classList.remove('is-active', 'is-hover-intent', 'is-pressed');
          cursorCore.classList.remove('is-active', 'is-hover-intent', 'is-pressed');
        }

        const target = getGlowTarget(event.target);
        if (!target) return;
        const next = event.relatedTarget;
        if (next instanceof Node && target.contains(next)) return;
        target.style.removeProperty('--cursor-glow-x');
        target.style.removeProperty('--cursor-glow-y');
      } catch (err) {
        // Ignore
      }
    };

    const handlePointerDown = () => {
      try {
        if (!cursorAura || !cursorCore || !isDarkThemeEnabled()) return;
        cursorAura.classList.add('is-pressed');
        cursorCore.classList.add('is-pressed');
      } catch (err) {
        // Ignore
      }
    };

    const handlePointerUp = () => {
      try {
        if (!cursorAura || !cursorCore) return;
        cursorAura.classList.remove('is-pressed');
        cursorCore.classList.remove('is-pressed');
      } catch (err) {
        // Ignore
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });

    return () => {
      try {
        observer.disconnect();
        themeObserver.disconnect();
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerout', handlePointerOut);
        window.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
        document.body.classList.remove('cursor-glow-theme-active');
        cursorAura?.remove();
        cursorCore?.remove();
      } catch (err) {
        console.error('CursorGlow cleanup error:', err);
      }
    };
  }, []);
}
