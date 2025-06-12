'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// If you see type errors for gsap or lenis, run:
// npm install --save-dev @types/gsap
// or ignore if not available, as gsap works fine in JS/TS

export default function Home() {
  // Audio refs
  const startClickSoundRef = useRef<HTMLAudioElement>(null);
  const preloaderSoundRef = useRef<HTMLAudioElement>(null);
  const scrollSound1Ref = useRef<HTMLAudioElement>(null);
  const scrollSound2Ref = useRef<HTMLAudioElement>(null);
  const scrollSound3Ref = useRef<HTMLAudioElement>(null);
  const hoverSoundRef = useRef<HTMLAudioElement>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement>(null);

  // UI state
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [preloading, setPreloading] = useState(false);
  const [counter, setCounter] = useState(0);

  // SVG refs
  const gridLinesRef = useRef<SVGGElement>(null);
  const circlesOutlineRef = useRef<SVGGElement>(null);
  const circlesFilledGroupRef = useRef<SVGGElement>(null);
  const glowCircleRef = useRef<HTMLDivElement>(null);

  // Debug text refs
  const debugLine1Ref = useRef<SVGTextElement>(null);
  const debugLine2Ref = useRef<SVGTextElement>(null);
  const debugLine3Ref = useRef<SVGTextElement>(null);
  const debugLine4Ref = useRef<SVGTextElement>(null);

  // Section scroll sounds
  const [currentSection, setCurrentSection] = useState(1);

  // Circle transitions for SVG
  type CircleTransition = {
    initial: { cx: number; cy: number; r: number };
    final: { cx: number; cy: number; r: number };
    outlineCircle?: SVGCircleElement;
    filledCircle?: SVGCircleElement;
  };
  const circleTransitions = useRef<CircleTransition[]>([]);

  // Handle audio enable button
  const handleEnableAudio = () => {
    document.body.classList.add('loading-active');
    setAudioEnabled(true);
    setPreloading(true);

    startClickSoundRef.current?.play().catch(() => {});
    preloaderSoundRef.current?.play().catch(() => {});

    // Show preloader and start counter
    let count = 0;
    setCounter(0);
    const timer = setInterval(() => {
      count++;
      setCounter(count);
      if (count >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          preloaderSoundRef.current?.pause();
          if (preloaderSoundRef.current) preloaderSoundRef.current.currentTime = 0;
          document.body.classList.remove('loading-active');
          setPreloading(false);
          if (backgroundMusicRef.current) backgroundMusicRef.current.volume = 0.5;
          backgroundMusicRef.current?.play().catch(() => {});
        }, 500);
      }
    }, 50);
  };

  // Setup geometric background SVG
  useEffect(() => {
    if (!audioEnabled || preloading) return;

    // Clear previous SVG children
    gridLinesRef.current?.replaceChildren();
    circlesOutlineRef.current?.replaceChildren();
    circlesFilledGroupRef.current?.replaceChildren();

    // Grid lines
    const gridSpacing = 48;
    for (let i = 0; i <= 40; i++) {
      const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      vLine.setAttribute('class', 'grid-line');
      vLine.setAttribute('x1', (i * gridSpacing).toString());
      vLine.setAttribute('y1', '0');
      vLine.setAttribute('x2', (i * gridSpacing).toString());
      vLine.setAttribute('y2', '1080');
      gridLinesRef.current?.appendChild(vLine);
      if (i <= 22) {
        const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hLine.setAttribute('class', 'grid-line');
        hLine.setAttribute('x1', '0');
        hLine.setAttribute('y1', (i * gridSpacing).toString());
        hLine.setAttribute('x2', '1920');
        hLine.setAttribute('y2', (i * gridSpacing).toString());
        gridLinesRef.current?.appendChild(hLine);
      }
    }

    // Circles
    const d = 80;
    const centerX = 960;
    const centerY = 540;
    const transitions = [
      { initial: { cx: centerX - 3 * d, cy: centerY, r: d * 0.8 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
      { initial: { cx: centerX + 3 * d, cy: centerY, r: d * 0.8 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
      { initial: { cx: centerX, cy: centerY - 3 * d, r: d * 0.8 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
      { initial: { cx: centerX, cy: centerY + 3 * d, r: d * 0.8 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
      { initial: { cx: centerX - 2 * d, cy: centerY - 2 * d, r: d * 0.6 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
      { initial: { cx: centerX + 2 * d, cy: centerY - 2 * d, r: d * 0.6 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
      { initial: { cx: centerX - 2 * d, cy: centerY + 2 * d, r: d * 0.6 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
      { initial: { cx: centerX + 2 * d, cy: centerY + 2 * d, r: d * 0.6 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
      { initial: { cx: centerX - 4 * d, cy: centerY, r: d * 0.4 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
      { initial: { cx: centerX + 4 * d, cy: centerY, r: d * 0.4 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
      { initial: { cx: centerX, cy: centerY - 4 * d, r: d * 0.4 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
      { initial: { cx: centerX, cy: centerY + 4 * d, r: d * 0.4 }, final: { cx: centerX, cy: centerY, r: 4 * d } },
      { initial: { cx: centerX, cy: centerY, r: d * 0.3 }, final: { cx: centerX, cy: centerY, r: 4 * d } }
    ];
    circleTransitions.current = transitions;

    transitions.forEach((transition) => {
      const circleOutline = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleOutline.setAttribute('class', 'circle-outline');
      circleOutline.setAttribute('cx', transition.initial.cx.toString());
      circleOutline.setAttribute('cy', transition.initial.cy.toString());
      circleOutline.setAttribute('r', transition.initial.r.toString());
      circlesOutlineRef.current?.appendChild(circleOutline);

      const circleFilled = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circleFilled.setAttribute('class', 'circle-filled');
      circleFilled.setAttribute('cx', transition.initial.cx.toString());
      circleFilled.setAttribute('cy', transition.initial.cy.toString());
      circleFilled.setAttribute('r', transition.initial.r.toString());
      circlesFilledGroupRef.current?.appendChild(circleFilled);

      (transition as any).outlineCircle = circleOutline;
      (transition as any).filledCircle = circleFilled;
    });
  }, [audioEnabled, preloading]);

  // Section scroll sounds
  useEffect(() => {
    if (!audioEnabled || preloading) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;
    const getCurrentSection = () => {
      const scrollY = window.scrollY;
      const sectionHeight = window.innerHeight * 2;
      if (scrollY < sectionHeight) return 1;
      else if (scrollY < sectionHeight * 2) return 2;
      else return 3;
    };
    const stopAllScrollSounds = () => {
      [scrollSound1Ref, scrollSound2Ref, scrollSound3Ref].forEach((ref) => {
        if (ref.current && !ref.current.paused) {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      });
    };
    const onScroll = () => {
      const newSection = getCurrentSection();
      if (newSection !== currentSection) {
        stopAllScrollSounds();
        setCurrentSection(newSection);
      }
      const currentScrollSound = [scrollSound1Ref, scrollSound2Ref, scrollSound3Ref][newSection - 1];
      if (currentScrollSound?.current && currentScrollSound.current.paused) {
        currentScrollSound.current.currentTime = 0;
        currentScrollSound.current.play().catch(() => {});
      }
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        stopAllScrollSounds();
      }, 150);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [audioEnabled, preloading, currentSection]);

  // GSAP and Lenis animations
  useEffect(() => {
    if (!audioEnabled || preloading) return;
    gsap.registerPlugin(ScrollTrigger);

    // Nav hover sound and animation
    document.querySelectorAll('.main-nav li').forEach((navItem) => {
      const square = navItem.querySelector('.nav-hover-square');
      navItem.addEventListener('mouseenter', () => {
        gsap.to(square, { scaleX: 1, duration: 0.3, ease: 'power2.out' });
        if (hoverSoundRef.current) {
          hoverSoundRef.current.currentTime = 0;
          hoverSoundRef.current.volume = 0.3;
          hoverSoundRef.current.play().catch(() => {});
        }
      });
      navItem.addEventListener('mouseleave', () => {
        gsap.to(square, { scaleX: 0, duration: 0.2, ease: 'power2.in' });
      });
    });

    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Preloader and gradient reveal
    gsap.to('.gradient-reveal', {
      y: '-500vh',
      duration: 2,
      ease: 'power2.inOut',
      delay: 0.25
    });
    gsap.to('.preloader', {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      delay: 1.0,
      onComplete: () => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.style.display = 'none';
      }
    });

    // Parallax background for sections
    gsap.utils.toArray('.section').forEach((section) => {
      const sec = section as HTMLElement;
      gsap.to(sec, {
        backgroundPositionY: '50%',
        ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    // Animation frame for geometric background and debug text
    let animationFrame: number;
    function updateAnimations() {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);

      // Fade out geometric text near footer
      const footer = document.querySelector('.site-footer') as HTMLElement | null;
      if (footer) {
        const footerStart = footer.offsetTop - window.innerHeight;
        const footerProgress = Math.max(0, (scrollY - footerStart) / (window.innerHeight * 0.5));
        const textOpacity = Math.max(0, 1 - footerProgress * 2);
        document.querySelectorAll('.geometric-text').forEach((text) => {
          (text as HTMLElement).style.opacity = textOpacity.toString();
        });
      }

      // Debug text
      const freq1 = (432 + progress * 108).toFixed(1);
      const freq2 = (528 - progress * 156).toFixed(1);
      const energy = (progress * 99.9).toFixed(1);
      const presence = ((1 - progress) * 100).toFixed(1);

      let awarenessState, becomingState, energyState, presenceState;
      if (progress <= 0.1) {
        awarenessState = `[${freq1}] AWARENESS: SILENCE`;
        becomingState = `.${freq2} STATE: VOID`;
        energyState = `{${energy}} ENERGY: DORMANT`;
      } else if (progress <= 0.25) {
        awarenessState = `[${freq1}] AWARENESS: STIRRING`;
        becomingState = `.${freq2} STATE: EMERGING`;
        energyState = `{${energy}} ENERGY: AWAKENING`;
      } else if (progress <= 0.5) {
        awarenessState = `[${freq1}] AWARENESS: FLOWING`;
        becomingState = `.${freq2} STATE: EXPANDING`;
        energyState = `{${energy}} ENERGY: BUILDING`;
      } else if (progress <= 0.75) {
        awarenessState = `[${freq1}] AWARENESS: ASCENDING`;
        becomingState = `.${freq2} STATE: DISSOLVING`;
        energyState = `{${energy}} ENERGY: RADIATING`;
      } else if (progress <= 0.9) {
        awarenessState = `[${freq1}] AWARENESS: TRANSCENDING`;
        becomingState = `.${freq2} STATE: INFINITE`;
        energyState = `{${energy}} ENERGY: OVERFLOWING`;
      } else {
        awarenessState = `[${freq1}] AWARENESS: UNITY`;
        becomingState = `.${freq2} STATE: ETERNAL`;
        energyState = `{${energy}} ENERGY: PURE`;
      }

      const presenceIntensity = Math.max(0, 1 - progress);
      if (presenceIntensity > 0.8) {
        presenceState = `.${presence} PRESENCE: SOLID`;
      } else if (presenceIntensity > 0.6) {
        presenceState = `.${presence} PRESENCE: SOFTENING`;
      } else if (presenceIntensity > 0.4) {
        presenceState = `.${presence} PRESENCE: TRANSLUCENT`;
      } else if (presenceIntensity > 0.2) {
        presenceState = `.${presence} PRESENCE: ETHEREAL`;
      } else {
        presenceState = `.${presence} PRESENCE: VOID`;
      }

      if (debugLine1Ref.current) debugLine1Ref.current.textContent = awarenessState;
      if (debugLine2Ref.current) debugLine2Ref.current.textContent = becomingState;
      if (debugLine3Ref.current) debugLine3Ref.current.textContent = energyState;
      if (debugLine4Ref.current) debugLine4Ref.current.textContent = presenceState;

      // Glowing circle animation
      if (glowCircleRef.current) {
        const scale = 1 + progress * 1.8;
        const shadowSize = progress * 150;
        const shadowSpread = progress * 35;
        const shadowOpacity = progress;
        glowCircleRef.current.style.transform = `scale(${scale})`;
        glowCircleRef.current.style.transformOrigin = 'center center';
        glowCircleRef.current.style.boxShadow = `0 0 ${shadowSize}px ${shadowSpread}px rgba(255, 255, 0, ${shadowOpacity})`;
      }

      // Grid opacity
      const gridOpacity = Math.max(0, 0.3 * (1 - progress * 1.5));
      document.querySelectorAll('.grid-line').forEach((line) => {
        (line as SVGLineElement).setAttribute('stroke-opacity', gridOpacity.toString());
      });

      // Animate circles
      circleTransitions.current.forEach((transition, index) => {
        const currentCx = transition.initial.cx + (transition.final.cx - transition.initial.cx) * progress;
        const currentCy = transition.initial.cy + (transition.final.cy - transition.initial.cy) * progress;
        const currentR = transition.initial.r + (transition.final.r - transition.initial.r) * progress;
        const rotation = progress * 360 * (index % 2 === 0 ? 1 : -1);
        const opacity = Math.max(0.1, 1 - progress * 0.7);

        if ((transition as any).outlineCircle) {
          ((transition as any).outlineCircle as SVGCircleElement).setAttribute('cx', currentCx.toString());
          ((transition as any).outlineCircle as SVGCircleElement).setAttribute('cy', currentCy.toString());
          ((transition as any).outlineCircle as SVGCircleElement).setAttribute('r', currentR.toString());
          ((transition as any).outlineCircle as SVGCircleElement).setAttribute('transform', `rotate(${rotation} ${currentCx} ${currentCy})`);
          ((transition as any).outlineCircle as SVGCircleElement).setAttribute('stroke-opacity', opacity.toString());
        }
        if ((transition as any).filledCircle) {
          ((transition as any).filledCircle as SVGCircleElement).setAttribute('cx', currentCx.toString());
          ((transition as any).filledCircle as SVGCircleElement).setAttribute('cy', currentCy.toString());
          ((transition as any).filledCircle as SVGCircleElement).setAttribute('r', currentR.toString());
          ((transition as any).filledCircle as SVGCircleElement).setAttribute('transform', `rotate(${rotation} ${currentCx} ${currentCy})`);
          ((transition as any).filledCircle as SVGCircleElement).setAttribute('fill-opacity', (opacity * 0.05).toString());
        }
      });
    }

    window.addEventListener('scroll', () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateAnimations);
    });
    updateAnimations();

    return () => {
      window.removeEventListener('scroll', updateAnimations);
      gsap.killTweensOf('.gradient-reveal');
      gsap.killTweensOf('.preloader');
      gsap.utils.toArray('.section').forEach((section) => {
        const sec = section as HTMLElement;
        gsap.killTweensOf(sec);
      });
    };
  }, [audioEnabled, preloading]);

  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <div className="header-container">
          <div className="logo-container">
            <div className="logo-circles">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
            </div>
          </div>
          <nav className="main-nav">
            <ul>
              <li>
                <a href="#" className="active">CREATIVE JOURNEY</a>
                <div className="nav-hover-square"></div>
              </li>
              <li>
                <a href="#">ABOUT</a>
                <div className="nav-hover-square"></div>
              </li>
              <li>
                <a href="#">SOUND</a>
                <div className="nav-hover-square"></div>
              </li>
            </ul>
          </nav>
          <div className="contact-link">
            <a href="https://x.com/filipz">+CONNECT</a>
          </div>
        </div>
      </header>

      {/* GRADIENT REVEAL */}
      <div className="gradient-reveal"></div>

      {/* AUDIO ENABLE MODAL */}
      {!audioEnabled && (
        <div className="audio-enable">
          <p>ENTER EXPERIENCE<br />WITH AUDIO</p>
          <button className="enable-button" onClick={handleEnableAudio}>START</button>
        </div>
      )}

      {/* PRELOADER */}
      {preloading && (
        <div className="preloader" id="preloader" style={{ display: 'flex' }}>
          <span id="counter">[{counter.toString().padStart(3, '0')}]</span>
        </div>
      )}

      {/* GEOMETRIC BACKGROUND */}
      <div className="geometric-background">
        <svg className="geometric-svg" viewBox="0 0 1920 1080">
          <g id="grid-lines" ref={gridLinesRef}></g>
          <g id="circles-outline" ref={circlesOutlineRef}></g>
          <g id="circles-filled">
            <clipPath id="right-half">
              <rect x="960" y="0" width="960" height="1080" />
            </clipPath>
            <g clipPath="url(#right-half)" ref={circlesFilledGroupRef}></g>
          </g>
          <text className="geometric-text" x="100" y="100">THE CREATIVE</text>
          <text className="geometric-text" x="100" y="115">PROCESS</text>
          <text className="geometric-text" x="1720" y="100">THE ESSENCE</text>
          <text className="geometric-text" x="1720" y="115">OF SOUND</text>
          <text className="geometric-text" x="100" y="980" ref={debugLine1Ref}>AWARENESS: SILENCE</text>
          <text className="geometric-text" x="100" y="995" ref={debugLine2Ref}>STATE: VOID</text>
          <text className="geometric-text" x="100" y="1010" ref={debugLine3Ref}>ENERGY: DORMANT</text>
          <text className="geometric-text" x="100" y="1025" ref={debugLine4Ref}>PRESENCE: SOLID</text>
          <text className="geometric-text" x="1620" y="980">BETWEEN THE</text>
          <text className="geometric-text" x="1620" y="995">HEARTBEATS</text>
        </svg>
      </div>

      {/* AUDIO ELEMENTS */}
      <audio ref={startClickSoundRef} preload="auto">
        <source src="https://assets.codepen.io/7558/preloader-2s-001.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={preloaderSoundRef} preload="auto">
        <source src="https://assets.codepen.io/7558/preloader-5s-001.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={scrollSound1Ref} loop preload="auto">
        <source src="https://assets.codepen.io/7558/glitch-fx-001.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={scrollSound2Ref} loop preload="auto">
        <source src="https://assets.codepen.io/7558/glitch-fx-001.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={scrollSound3Ref} loop preload="auto">
        <source src="https://assets.codepen.io/7558/glitch-fx-001.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={hoverSoundRef} preload="auto">
        <source src="https://assets.codepen.io/7558/preloader-2s-001.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={backgroundMusicRef} loop preload="auto">
        <source src="https://assets.codepen.io/7558/lxstnght-night-angel.mp3" type="audio/mpeg" />
      </audio>

      {/* CENTER CIRCLE */}
      <div className="center-circle">
        <div className="circle-container">
          <div className="glowing-circle" ref={glowCircleRef}></div>
        </div>
      </div>

      {/* SECTIONS */}
      <section className="section section-1">
        <div className="section-content"></div>
      </section>
      <section className="section section-2">
        <div className="section-content"></div>
      </section>
      <section className="section section-3">
        <div className="section-content"></div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-content-section">
          <div className="footer-content">
            <div className="footer-left">
              <p>THE DARKNESS</p>
              <p>IS WHERE</p>
              <p>LIGHT IS BORN</p>
              <p>EMPTINESS</p>
              <p>CREATES SPACE</p>
              <p>FOR HEALING</p>
            </div>
            <div className="footer-right">
              <p>CREATIVITY FLOWS THROUGH</p>
              <p>INFINITE PATHWAYS</p>
              <p>CONSCIOUSNESS EXPANDS</p>
              <p>INTO BOUNDLESS REALMS</p>
              <p>OF LIGHT AND POSSIBILITY</p>
              <p>WHERE HEALING BECOMES ART</p>
            </div>
          </div>
          <div className="footer-credits">
            <p>
              Sound Design & Music by{' '}
              <a href="https://open.spotify.com/artist/6YXgRMajnjib8j6Cxzcryp?si=iiLnt59BRp6QgKGizkG5Zg" target="_blank" rel="noopener noreferrer">
                @LXSTNGHT
              </a>
            </p>
          </div>
        </div>
        <div className="footer-svg-section">
          <img className="footer-svg" src="https://assets.codepen.io/7558/arrival-text.svg" alt="" />
        </div>
      </footer>
    </>
  );
}
