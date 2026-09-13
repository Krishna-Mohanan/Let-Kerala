/**
 * LET KERALA — Centralized Global Interaction & Animation System
 * Engineered for 60 FPS performance, subtle organic depth, and natural responsiveness.
 */

(function () {
  'use strict';

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768);

  // ---------------------------------------------------------------------------
  // 1. Centralized Mouse Tracking System
  // ---------------------------------------------------------------------------
  const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetNormX: 0,
    targetNormY: 0,
    smoothNormX: 0,
    smoothNormY: 0,
    isInsideHero: false,
    heroRelX: 0,
    heroRelY: 0
  };

  const lerp = (start, end, factor) => start + (end - start) * factor;

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;

    mouse.targetNormX = (e.clientX - halfW) / halfW;
    mouse.targetNormY = (e.clientY - halfH) / halfH;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.targetNormX = 0;
    mouse.targetNormY = 0;
    mouse.isInsideHero = false;
  });

  // ---------------------------------------------------------------------------
  // 2. DOM Elements Cache
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('hero');
    const heroBg = hero ? hero.querySelector('.hero-bg-layer') : null;
    const heroSunlight = hero ? document.getElementById('hero-sunlight') : null;
    const heroCopy = hero ? (hero.querySelector('.stage-content-wrap') || hero.querySelector('.hero-copy')) : null;
    const heroBtn = hero ? hero.querySelector('.button') : null;
    const heroBtnArrow = heroBtn ? heroBtn.querySelector('.btn-arrow') : null;
    const heroFoliageTR = hero ? hero.querySelector('.hero-foliage-tr') : null;
    const heroFoliageBL = hero ? hero.querySelector('.hero-foliage-bl') : null;
    const heroDrops = hero ? Array.from(hero.querySelectorAll('.hero-spice-drift .drop')) : [];

    const productsSection = document.getElementById('products');
    const productCards = productsSection ? Array.from(productsSection.querySelectorAll('.product')) : [];
    const contactSection = document.getElementById('contact');

    // -------------------------------------------------------------------------
    // 3. Hero Particles Physics Initialization (8 Elegant Spice Particles)
    // -------------------------------------------------------------------------
    const particles = heroDrops.map((el, i) => {
      const depth = parseFloat(el.getAttribute('data-depth')) || (0.5 + (i % 4) * 0.12);
      return {
        el,
        depth,
        // Idle organic float parameters
        speed: 0.18 + (i % 3) * 0.08,
        offset: (i * 1.4) % (Math.PI * 2),
        // Repulsion physics states
        repelX: 0,
        repelY: 0,
        targetRepelX: 0,
        targetRepelY: 0,
        rotation: (i * 35) % 360,
        rotSpeed: (i % 2 === 0 ? 1 : -1) * (0.12 + (i % 3) * 0.05),
        rotOffset: 0
      };
    });

    // -------------------------------------------------------------------------
    // 4. Hero Magnetic Button State
    // -------------------------------------------------------------------------
    const magneticBtn = {
      currX: 0,
      currY: 0,
      targetX: 0,
      targetY: 0,
      arrowCurrX: 0,
      arrowTargetX: 0
    };

    // -------------------------------------------------------------------------
    // 5. Product Image Parallax Cache
    // -------------------------------------------------------------------------
    const productData = productCards.map((card) => {
      const img = card.querySelector('.product-image img');
      const light = card.querySelector('.product-image-light');
      return {
        card,
        img,
        light,
        isHovered: false,
        currX: 0,
        currY: 0,
        targetX: 0,
        targetY: 0
      };
    });

    productData.forEach((item) => {
      item.card.addEventListener('mouseenter', () => {
        item.isHovered = true;
      });

      item.card.addEventListener('mousemove', (e) => {
        if (isTouch) return;
        const rect = item.card.getBoundingClientRect();
        // Normalized inside the card (-1 to 1)
        const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        item.targetX = -relX * 6; // Image shifts inverse to cursor (3–8px)
        item.targetY = -relY * 5;

        // Position soft highlight
        if (item.light) {
          const lx = e.clientX - rect.left;
          const ly = e.clientY - rect.top;
          item.light.style.transform = `translate3d(${lx}px, ${ly}px, 0) translate(-50%, -50%)`;
        }
      });

      item.card.addEventListener('mouseleave', () => {
        item.isHovered = false;
        item.targetX = 0;
        item.targetY = 0;
      });
    });

    // -------------------------------------------------------------------------
    // 6. Global Scroll Reveal System (IntersectionObserver)
    // -------------------------------------------------------------------------
    // Mark target items for revelation
    const introSection = document.querySelector('.intro');
    if (introSection) {
      const introHeadingCol = introSection.children[0];
      const introBodyCol = introSection.children[1];

      if (introHeadingCol) {
        Array.from(introHeadingCol.children).forEach((child, i) => {
          child.classList.add('reveal-item', `stagger-${i + 1}`);
        });
      }

      if (introBodyCol) {
        const p = introBodyCol.querySelector('p');
        if (p) p.classList.add('reveal-item', 'stagger-2');

        const facts = introBodyCol.querySelectorAll('.fact');
        facts.forEach((fact, i) => {
          fact.classList.add('reveal-item', `stagger-${i + 3}`);
        });
      }
    }

    if (productsSection) {
      const head = productsSection.querySelector('.section-head');
      if (head) head.classList.add('reveal-item');
      productCards.forEach((card, i) => {
        card.classList.add('reveal-item', `stagger-${i + 2}`);
      });
    }

    const revealItems = document.querySelectorAll('.reveal-item');
    if ('IntersectionObserver' in window && revealItems.length > 0) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.14,
        rootMargin: '0px 0px -40px 0px'
      });

      revealItems.forEach((el) => revealObserver.observe(el));

      // Also observe dynamically injected journey section if present
      setTimeout(() => {
        const journeySteps = document.querySelectorAll('.journey-step');
        journeySteps.forEach((step, i) => {
          step.classList.add('reveal-item', `stagger-${(i % 3) + 1}`);
          revealObserver.observe(step);
        });
      }, 120);
    } else {
      revealItems.forEach((el) => el.classList.add('is-revealed'));
    }

    // -------------------------------------------------------------------------
    // 7. Centralized Animation Loop (60 FPS requestAnimationFrame)
    // -------------------------------------------------------------------------
    let time = 0;

    function renderFrame() {
      if (isTouch) return;

      time += 0.016; // Stable time progression

      // Smooth mouse coordinates
      mouse.smoothNormX = lerp(mouse.smoothNormX, mouse.targetNormX, 0.055);
      mouse.smoothNormY = lerp(mouse.smoothNormY, mouse.targetNormY, 0.055);

      // --- HERO SECTION UPDATES ---
      if (hero) {
        const heroRect = hero.getBoundingClientRect();
        const isInViewport = heroRect.top < window.innerHeight && heroRect.bottom > 0;

        if (isInViewport) {
          // 1. Background layer: moves 2–4px
          if (heroBg) {
            const bgMoveX = mouse.smoothNormX * -3.5;
            const bgMoveY = mouse.smoothNormY * -2.8;
            heroBg.style.transform = `translate3d(${bgMoveX.toFixed(2)}px, ${bgMoveY.toFixed(2)}px, 0)`;
          }

          // 2. Foreground foliage: moves 10–20px (stronger parallax)
          if (heroFoliageTR) {
            const folX = mouse.smoothNormX * 14;
            const folY = mouse.smoothNormY * 11;
            heroFoliageTR.style.transform = `translate3d(${folX.toFixed(2)}px, ${folY.toFixed(2)}px, 0)`;
          }
          if (heroFoliageBL) {
            const folX = mouse.smoothNormX * 16;
            const folY = mouse.smoothNormY * 13;
            heroFoliageBL.style.transform = `translate3d(${folX.toFixed(2)}px, ${folY.toFixed(2)}px, 0)`;
          }

          // 3. Hero text subtle depth: moves 1–3px
          if (heroCopy) {
            const textMoveX = mouse.smoothNormX * -1.6;
            const textMoveY = mouse.smoothNormY * -1.2;
            heroCopy.style.transform = `translate3d(${textMoveX.toFixed(2)}px, ${textMoveY.toFixed(2)}px, 0)`;
          }

          // 4. Hero Sunlight: smooth cursor illumination
          if (heroSunlight && !isTouch) {
            const relHeroX = mouse.x - heroRect.left;
            const relHeroY = mouse.y - heroRect.top;
            heroSunlight.style.transform = `translate3d(${relHeroX.toFixed(1)}px, ${relHeroY.toFixed(1)}px, 0) translate(-50%, -50%)`;
          }

          // 5. Hero 8 Spice Particles: natural wind float + cursor repulsion physics
          particles.forEach((p) => {
            // Base continuous Kerala breeze drift (sine waves)
            const floatY = Math.sin(time * p.speed + p.offset) * 8.5 * p.depth;
            const floatX = Math.cos(time * p.speed * 0.75 + p.offset) * 5 * p.depth;

            // Background parallax based on depth
            const parallaxX = mouse.smoothNormX * p.depth * -8;
            const parallaxY = mouse.smoothNormY * p.depth * -6;

            // Cursor proximity repulsion
            if (!isTouch) {
              const pRect = p.el.getBoundingClientRect();
              const pCenterX = pRect.left + pRect.width / 2;
              const pCenterY = pRect.top + pRect.height / 2;

              const dx = pCenterX - mouse.x;
              const dy = pCenterY - mouse.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const repelRadius = 135; // 100–150px proximity radius

              if (dist < repelRadius && dist > 0) {
                // Spring-like force: stronger near center, smooth drop-off
                const force = Math.pow((repelRadius - dist) / repelRadius, 1.6);
                p.targetRepelX = (dx / dist) * force * 30 * p.depth;
                p.targetRepelY = (dy / dist) * force * 30 * p.depth;
                p.rotOffset = force * 15 * (dx > 0 ? 1 : -1);
              } else {
                p.targetRepelX = 0;
                p.targetRepelY = 0;
                p.rotOffset = 0;
              }
            }

            // Spring interpolation back to equilibrium
            p.repelX = lerp(p.repelX, p.targetRepelX, 0.07);
            p.repelY = lerp(p.repelY, p.targetRepelY, 0.07);

            p.rotation += p.rotSpeed;
            const totalRot = p.rotation + p.rotOffset;
            const totalX = (parallaxX + floatX + p.repelX).toFixed(2);
            const totalY = (parallaxY + floatY + p.repelY).toFixed(2);

            p.el.style.transform = `translate3d(${totalX}px, ${totalY}px, 0) rotate(${totalRot.toFixed(1)}deg)`;
          });

          // 6. Magnetic CTA Button interaction (2–6px pull)
          if (heroBtn && !isTouch) {
            const btnRect = heroBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            const bdx = mouse.x - btnCenterX;
            const bdy = mouse.y - btnCenterY;
            const bDist = Math.sqrt(bdx * bdx + bdy * bdy);
            const magnetRadius = 90;

            if (bDist < magnetRadius) {
              const pull = (magnetRadius - bDist) / magnetRadius;
              magneticBtn.targetX = (bdx / bDist) * pull * 5.5;
              magneticBtn.targetY = (bdy / bDist) * pull * 4.5;
              magneticBtn.arrowTargetX = pull * 3.5;
            } else {
              magneticBtn.targetX = 0;
              magneticBtn.targetY = 0;
              magneticBtn.arrowTargetX = 0;
            }

            magneticBtn.currX = lerp(magneticBtn.currX, magneticBtn.targetX, 0.12);
            magneticBtn.currY = lerp(magneticBtn.currY, magneticBtn.targetY, 0.12);
            magneticBtn.arrowCurrX = lerp(magneticBtn.arrowCurrX, magneticBtn.arrowTargetX, 0.14);

            heroBtn.style.transform = `translate3d(${magneticBtn.currX.toFixed(2)}px, ${magneticBtn.currY.toFixed(2)}px, 0)`;
            if (heroBtnArrow) {
              heroBtnArrow.style.transform = `translateX(${magneticBtn.arrowCurrX.toFixed(2)}px)`;
            }
          }
        }
      }

      // --- PRODUCT SECTION UPDATES ---
      if (productsSection) {
        const prodRect = productsSection.getBoundingClientRect();
        if (prodRect.top < window.innerHeight && prodRect.bottom > 0) {
          // Subtle scroll depth: images move 5–12px relative to scroll
          const scrollProgress = (window.innerHeight - prodRect.top) / (window.innerHeight + prodRect.height);
          const scrollShiftY = (scrollProgress - 0.5) * 8; // approx 8px total range

          productData.forEach((item) => {
            // Smooth mouse parallax shift inside image (3–8px)
            item.currX = lerp(item.currX, item.targetX, 0.08);
            item.currY = lerp(item.currY, item.targetY, 0.08);

            if (item.img) {
              const combinedY = item.currY + scrollShiftY;
              item.img.style.setProperty('--img-shift-x', `${item.currX.toFixed(2)}px`);
              item.img.style.setProperty('--img-shift-y', `${combinedY.toFixed(2)}px`);
            }
          });
        }
      }

      // --- CONTACT SECTION UPDATES (Subtle Ambiance) ---
      if (contactSection && !isTouch) {
        const cRect = contactSection.getBoundingClientRect();
        if (cRect.top < window.innerHeight && cRect.bottom > 0) {
          const cxPercent = ((mouse.x - cRect.left) / cRect.width) * 100;
          const cyPercent = ((mouse.y - cRect.top) / cRect.height) * 100;
          contactSection.style.setProperty('--mouse-contact-x', `${cxPercent.toFixed(1)}%`);
          contactSection.style.setProperty('--mouse-contact-y', `${cyPercent.toFixed(1)}%`);
        }
      }

      requestAnimationFrame(renderFrame);
    }

    // Launch RAF loop only on desktop / non-touch devices
    if (!isTouch) {
      requestAnimationFrame(renderFrame);
    }

    // ==========================================================================
    // ENQUIRY FORM (DIRECT BACKGROUND SEND)
    // ==========================================================================
    const enquiryForm = document.getElementById('enquiry-form');
    const enquirySuccess = document.getElementById('enquiry-success');
    const nameInput = document.getElementById('enquiry-name');
    const emailInput = document.getElementById('enquiry-email');
    const phoneInput = document.getElementById('enquiry-phone');
    const messageInput = document.getElementById('enquiry-message');
    const newEnquiryBtn = document.getElementById('new-enquiry-btn');
    const submitBtn = document.getElementById('enquiry-submit-btn');

    if (enquiryForm) {
      // Clear error states on user typing
      [nameInput, emailInput, messageInput].forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => {
          const group = input.closest('.form-group');
          if (group) group.classList.remove('has-error');
        });
      });

      enquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let hasError = false;
        const nameVal = nameInput ? nameInput.value.trim() : '';
        const emailVal = emailInput ? emailInput.value.trim() : '';
        const phoneVal = phoneInput ? phoneInput.value.trim() : '';
        const messageVal = messageInput ? messageInput.value.trim() : '';

        // Validate Name (required)
        if (!nameVal) {
          if (nameInput) nameInput.closest('.form-group').classList.add('has-error');
          hasError = true;
        }

        // Validate Email (required + format)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal || !emailRegex.test(emailVal)) {
          if (emailInput) emailInput.closest('.form-group').classList.add('has-error');
          hasError = true;
        }

        // Phone is OPTIONAL - not mandatory

        // Validate Enquiry Message (required)
        if (!messageVal) {
          if (messageInput) messageInput.closest('.form-group').classList.add('has-error');
          hasError = true;
        }

        if (hasError) {
          const firstError = enquiryForm.querySelector('.has-error input, .has-error textarea');
          if (firstError) firstError.focus();
          return;
        }

        const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="btn-text">Sending Enquiry...</span>';
        }

        const subject = `Enquiry from Website - ${nameVal} | Let Keralam Foods & Spices`;
        const timestamp = new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'Asia/Kolkata'
        }) + ' (IST)';

        try {
          // Send directly via AJAX in the background to customercare@letkerala.in
          const response = await fetch('https://formsubmit.co/ajax/customercare@letkerala.in', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              _subject: subject,
              _template: 'table',
              _captcha: 'false',
              'Name': nameVal,
              'Email ID': emailVal,
              'Phone Number': phoneVal || 'Not provided',
              'Enquiry Details': messageVal,
              'Submitted At': timestamp
            })
          });

          if (response.ok) {
            enquiryForm.style.display = 'none';
            if (enquirySuccess) {
              enquirySuccess.style.display = 'block';
              enquirySuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else {
            throw new Error('Server error');
          }
        } catch (err) {
          // Graceful fallback to standard mailto directly without displaying any template boxes
          const bodyFallback = 
`Name: ${nameVal}
Email ID: ${emailVal}
Phone: ${phoneVal || 'Not provided'}

Enquiry Details:
${messageVal}`;
          window.location.href = `mailto:customercare@letkerala.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyFallback)}`;
          enquiryForm.style.display = 'none';
          if (enquirySuccess) {
            enquirySuccess.style.display = 'block';
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
          }
        }
      });

      // Reset / Write another enquiry
      if (newEnquiryBtn) {
        newEnquiryBtn.addEventListener('click', () => {
          enquiryForm.reset();
          enquiryForm.style.display = 'block';
          if (enquirySuccess) enquirySuccess.style.display = 'none';
          enquiryForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  });
})();

