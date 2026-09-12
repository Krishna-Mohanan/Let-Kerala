/**
 * LET KERALA — "WHAT'S YOUR SPICE?"
 * Interactive Environmental Doorway Controller
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('whats-your-spice');
    if (!section) return;

    const cards = section.querySelectorAll('.wys-card');
    const portals = section.querySelector('.wys-portals');
    const envLayers = section.querySelectorAll('.env-layer');
    const clusters = section.querySelectorAll('.wys-cluster');

    let leaveTimeout = null;
    let isTouch = false;
    let activeTouchSpice = null;

    // Detect touch device
    window.addEventListener('touchstart', function onFirstTouch() {
      isTouch = true;
      window.removeEventListener('touchstart', onFirstTouch);
    }, { passive: true });

    // State transition handler
    function setSpiceState(spice) {
      if (leaveTimeout) {
        clearTimeout(leaveTimeout);
        leaveTimeout = null;
      }
      if (spice === 'pepper') {
        section.classList.remove('state-cardamom');
        section.classList.add('state-pepper');
      } else if (spice === 'cardamom') {
        section.classList.remove('state-pepper');
        section.classList.add('state-cardamom');
      } else {
        section.classList.remove('state-pepper', 'state-cardamom');
      }
    }

    function clearSpiceState(delay = 180) {
      if (leaveTimeout) clearTimeout(leaveTimeout);
      leaveTimeout = setTimeout(() => {
        section.classList.remove('state-pepper', 'state-cardamom');
      }, delay);
    }

    // Scroll smoothly to target product
    function navigateToProduct(spice) {
      const targetId = spice === 'pepper' ? 'product-pepper' : 'product-cardamom';
      let targetEl = document.getElementById(targetId);

      // Fallback to #products if individual card isn't found
      if (!targetEl) {
        targetEl = document.getElementById('products');
      }

      if (targetEl) {
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Add subtle focus / highlight feedback to product card
        setTimeout(() => {
          targetEl.classList.add('product-target-highlight');
          setTimeout(() => {
            targetEl.classList.remove('product-target-highlight');
          }, 1800);
        }, 450);
      }
    }

    // Attach desktop hover & focus events
    cards.forEach(card => {
      const spice = card.dataset.spice;

      card.addEventListener('mouseenter', () => {
        if (!isTouch) setSpiceState(spice);
      });

      card.addEventListener('focus', () => {
        setSpiceState(spice);
      });

      card.addEventListener('blur', () => {
        clearSpiceState(100);
      });

      // Click / Tap Handling
      card.addEventListener('click', (e) => {
        // If clicking CTA specifically
        if (e.target.closest('.wys-cta')) {
          e.preventDefault();
          navigateToProduct(spice);
          return;
        }

        // On touch screens: first tap transforms environment, second tap navigates
        if (isTouch) {
          if (activeTouchSpice === spice) {
            navigateToProduct(spice);
          } else {
            activeTouchSpice = spice;
            setSpiceState(spice);
          }
          return;
        }

        // Desktop click on card directly navigates
        e.preventDefault();
        navigateToProduct(spice);
      });

      // Keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigateToProduct(spice);
        }
      });
    });

    if (portals) {
      portals.addEventListener('mouseleave', () => {
        if (!isTouch) clearSpiceState(220);
      });
    }

    // Touch outside to reset
    document.addEventListener('touchstart', (e) => {
      if (isTouch && activeTouchSpice && !section.contains(e.target)) {
        activeTouchSpice = null;
        clearSpiceState(50);
      }
    }, { passive: true });

    // Subtle 3D mouse parallax on desktop
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isMouseInside = false;

    section.addEventListener('mouseenter', () => {
      if (!isTouch) isMouseInside = true;
    });

    section.addEventListener('mouseleave', () => {
      isMouseInside = false;
      mouseX = 0;
      mouseY = 0;
    });

    section.addEventListener('mousemove', (e) => {
      if (isTouch) return;
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 26; // max px offset
      mouseY = y * 18;
    });

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function renderParallax() {
      if (!hasFinePointer) return;

      if (isMouseInside || Math.abs(mouseX - currentX) > 0.05 || Math.abs(mouseY - currentY) > 0.05) {
        currentX += (mouseX - currentX) * 0.06;
        currentY += (mouseY - currentY) * 0.06;

        envLayers.forEach(layer => {
          layer.style.transform = `scale(1.04) translate3d(${-currentX * 0.4}px, ${-currentY * 0.4}px, 0)`;
        });

        clusters.forEach(cluster => {
          cluster.style.transform = `translate3d(${currentX * 0.6}px, ${currentY * 0.6}px, 0)`;
        });
      }
      requestAnimationFrame(renderParallax);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && hasFinePointer) {
      requestAnimationFrame(renderParallax);
    }
  });
})();

