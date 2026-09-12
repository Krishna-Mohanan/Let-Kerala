/**
 * LET KERALA — Apple-Style Cinematic Scroll Engine
 * 60 FPS bidirectional scroll storytelling controller.
 */

(function () {
  'use strict';

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('hero-track');
    const viewport = document.getElementById('hero');
    if (!track || !viewport) return;

    // Visual Layers
    const sceneKerala = viewport.querySelector('.scene-kerala');
    const scenePlantation = viewport.querySelector('.scene-plantation');
    const scenePepperMacro = viewport.querySelector('.scene-pepper-macro');
    const sceneMist = viewport.querySelector('.scene-mist-transition');
    const sceneCardamomMacro = viewport.querySelector('.scene-cardamom-macro');
    const sceneBrandFinish = viewport.querySelector('.scene-brand-finish');

    // Narrative Stages
    const stage1 = viewport.querySelector('.stage-1-intro');
    const stage2 = viewport.querySelector('.stage-2-canopy');
    const stage3 = viewport.querySelector('.stage-3-pepper');
    const stage4 = viewport.querySelector('.stage-4-cardamom');
    const stage5 = viewport.querySelector('.stage-5-brand');
    const scrollHint = viewport.querySelector('.cinematic-scroll-hint');

    let rawProgress = 0;
    let smoothProgress = 0;
    let isHeroInView = true;
    let isLoopRunning = false;
    let lastRenderedProgress = -1;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    // Helper to calculate smooth 0-1 opacity curve within a range
    function getRangeCurve(progress, start, peakStart, peakEnd, end) {
      if (progress < start || progress > end) return 0;
      if (progress >= peakStart && progress <= peakEnd) return 1;
      if (progress < peakStart) {
        return (progress - start) / (peakStart - start);
      }
      return 1 - (progress - peakEnd) / (end - peakEnd);
    }

    function startRenderLoop() {
      if (!isLoopRunning && isHeroInView) {
        isLoopRunning = true;
        requestAnimationFrame(render);
      }
    }

    // Scroll listener calculates normalized 0.0 -> 1.0 progress
    function updateScrollProgress() {
      const trackRect = track.getBoundingClientRect();
      const totalScrollable = track.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) {
        rawProgress = 0;
        startRenderLoop();
        return;
      }

      const scrolled = -trackRect.top;
      rawProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      startRenderLoop();
    }

    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        isHeroInView = entries[0].isIntersecting;
        if (isHeroInView) {
          startRenderLoop();
        }
      }, { threshold: 0.01 });
      heroObserver.observe(track);
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // -------------------------------------------------------------------------
    // Main 60 FPS Render Loop (Pauses when settled or off-screen)
    // -------------------------------------------------------------------------
    function render() {
      if (!isHeroInView) {
        isLoopRunning = false;
        return;
      }

      const diff = rawProgress - smoothProgress;
      if (Math.abs(diff) < 0.0008) {
        smoothProgress = rawProgress;
      } else {
        smoothProgress = lerp(smoothProgress, rawProgress, 0.082);
      }

      const p = smoothProgress;

      // -----------------------------------------------------------------------
      // 1. Scene Visuals Camera Staging (Depth, Scale & Crossfades)
      // -----------------------------------------------------------------------

      // Scene 1: Kerala Landscape (0% -> 24%)
      if (sceneKerala) {
        const keralaScale = 1.0 + p * 0.75; // Forward camera dolly into the valley
        const keralaOpacity = p < 0.18 ? 1 : Math.max(0, 1 - (p - 0.18) / 0.10);
        sceneKerala.style.transform = `scale(${keralaScale.toFixed(3)}) translate3d(0, 0, 0)`;
        sceneKerala.style.opacity = keralaOpacity.toFixed(3);
      }

      // Scene 2: Spice Plantation Canopy (18% -> 44%)
      if (scenePlantation) {
        const plantationOpacity = getRangeCurve(p, 0.18, 0.25, 0.36, 0.44);
        const plantationScale = 1.04 + (p - 0.18) * 0.65;
        scenePlantation.style.transform = `scale(${plantationScale.toFixed(3)}) translate3d(0, 0, 0)`;
        scenePlantation.style.opacity = plantationOpacity.toFixed(3);
      }

      // Scene 3: Black Pepper Macro Cluster (38% -> 62%)
      if (scenePepperMacro) {
        const pepperOpacity = getRangeCurve(p, 0.38, 0.44, 0.54, 0.62);
        const pepperScale = 1.02 + (p - 0.38) * 0.5;
        scenePepperMacro.style.transform = `scale(${pepperScale.toFixed(3)}) translate3d(0, 0, 0)`;
        scenePepperMacro.style.opacity = pepperOpacity.toFixed(3);
      }

      // Scene 4: Mist & Green Foliage Flight (52% -> 74%)
      if (sceneMist) {
        const mistOpacity = getRangeCurve(p, 0.52, 0.60, 0.66, 0.74) * 0.85;
        sceneMist.style.opacity = mistOpacity.toFixed(3);
      }

      // Scene 5: Green Cardamom Macro (68% -> 92%)
      if (sceneCardamomMacro) {
        const cardamomOpacity = getRangeCurve(p, 0.68, 0.75, 0.85, 0.92);
        const cardamomScale = 1.02 + (p - 0.68) * 0.45;
        sceneCardamomMacro.style.transform = `scale(${cardamomScale.toFixed(3)}) translate3d(0, 0, 0)`;
        sceneCardamomMacro.style.opacity = cardamomOpacity.toFixed(3);
      }

      // Scene 6: Brand Reveal & Return to Sunlight (86% -> 100%)
      if (sceneBrandFinish) {
        const brandOpacity = p < 0.86 ? 0 : Math.min(1, (p - 0.86) / 0.08);
        const brandScale = 1.14 - (p - 0.86) * 0.5; // Slow pullback to reveal brand
        sceneBrandFinish.style.transform = `scale(${Math.max(1, brandScale).toFixed(3)}) translate3d(0, 0, 0)`;
        sceneBrandFinish.style.opacity = brandOpacity.toFixed(3);
      }

      // -----------------------------------------------------------------------
      // 2. Narrative Stage Text Staging
      // -----------------------------------------------------------------------

      // Stage 1: Hero Initial Intro
      if (stage1) {
        const s1Opacity = p < 0.12 ? 1 : Math.max(0, 1 - (p - 0.12) / 0.08);
        const s1TranslateY = (p * -40).toFixed(1);
        stage1.style.opacity = s1Opacity.toFixed(3);
        stage1.style.transform = `translate3d(0, ${s1TranslateY}px, 0)`;
        stage1.classList.toggle('stage-active', s1Opacity > 0.15);
      }

      // Scroll hint fades out early
      if (scrollHint) {
        const hintOp = Math.max(0, 1 - p / 0.08);
        viewport.style.setProperty('--hint-opacity', hintOp.toFixed(3));
      }

      // Stage 2: Born in the Spice Hills
      if (stage2) {
        const s2Opacity = getRangeCurve(p, 0.20, 0.26, 0.34, 0.40);
        const s2TranslateY = ((0.30 - p) * 35).toFixed(1);
        stage2.style.opacity = s2Opacity.toFixed(3);
        stage2.style.transform = `translate3d(0, ${s2TranslateY}px, 0)`;
        stage2.classList.toggle('stage-active', s2Opacity > 0.15);
      }

      // Stage 3: Black Pepper Editorial
      if (stage3) {
        const s3Opacity = getRangeCurve(p, 0.40, 0.45, 0.53, 0.59);
        const s3TranslateY = ((0.48 - p) * 35).toFixed(1);
        stage3.style.opacity = s3Opacity.toFixed(3);
        stage3.style.transform = `translate3d(0, ${s3TranslateY}px, 0)`;
        stage3.classList.toggle('stage-active', s3Opacity > 0.15);
      }

      // Stage 4: Green Cardamom Editorial
      if (stage4) {
        const s4Opacity = getRangeCurve(p, 0.72, 0.77, 0.86, 0.91);
        const s4TranslateY = ((0.81 - p) * 35).toFixed(1);
        stage4.style.opacity = s4Opacity.toFixed(3);
        stage4.style.transform = `translate3d(0, ${s4TranslateY}px, 0)`;
        stage4.classList.toggle('stage-active', s4Opacity > 0.15);
      }

      // Stage 5: LET KERALA Final Brand Reveal
      if (stage5) {
        const s5Opacity = p < 0.90 ? 0 : Math.min(1, (p - 0.90) / 0.06);
        const s5TranslateY = ((1 - p) * 20).toFixed(1);
        stage5.style.opacity = s5Opacity.toFixed(3);
        stage5.style.transform = `translate3d(0, ${s5TranslateY}px, 0)`;
        stage5.classList.toggle('stage-active', s5Opacity > 0.15);
      }

      // Smooth warm cream bottom fade as we approach intro section
      const exitCreamOp = p < 0.91 ? 0 : Math.min(1, (p - 0.91) / 0.08);
      viewport.style.setProperty('--exit-cream-opacity', exitCreamOp.toFixed(3));

      // Only schedule next frame if progress is still settling
      if (Math.abs(rawProgress - smoothProgress) < 0.0005) {
        isLoopRunning = false;
        return;
      }

      requestAnimationFrame(render);
    }

    startRenderLoop();
  });
})();

