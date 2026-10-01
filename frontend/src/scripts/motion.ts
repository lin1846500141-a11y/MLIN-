/**
 * MLINStudio 动效引擎
 * Lenis 顺滑滚动 + GSAP ScrollTrigger 编排。
 * 通过 astro:page-load / astro:before-swap 与 ClientRouter 协同，
 * 每次页面切换后重建，保证无泄漏、无重复绑定。
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'expo.out';
let lenis: Lenis | null = null;

function teardown() {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
  gsap.ticker.remove(tick);
  ScrollTrigger.getAll().forEach((t) => t.kill());
  gsap.globalTimeline.clear();
}

function tick(time: number) {
  lenis?.raf(time * 1000);
}

function initSmoothScroll() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  lenis = new Lenis({
    duration: 1.1,
    lerp: 0.09,
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.05,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

/** 页眉滚动固化 */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('is-solid', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/** 通用揭示：[data-reveal] 元素进入视口时上浮淡入 */
function initReveals() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  if (reduce || els.length === 0) {
    els.forEach((el) => { el.style.opacity = '1'; });
    return;
  }
  els.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      },
    );
  });
}

/** 首页 hero 入场编排 */
function initHero() {
  const hero = document.querySelector('.tri-hero');
  if (!hero) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const tl = gsap.timeline({ defaults: { ease: EASE } });
  tl.from('.tri-panel', { yPercent: 12, autoAlpha: 0, duration: 1.2, stagger: 0.12 }, 0)
    .from('.tri-name', { x: -26, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.25)
    .from('.tri-title > *', { y: 80, autoAlpha: 0, duration: 1.1, stagger: 0.12 }, 0.35);
}

/** 宣言逐行揭示 */
function initManifesto() {
  const lines = gsap.utils.toArray<HTMLElement>('.manifesto .line > span');
  if (lines.length === 0) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  gsap.from(lines, {
    yPercent: 115,
    duration: 1.15,
    stagger: 0.12,
    ease: EASE,
    scrollTrigger: { trigger: '.manifesto', start: 'top 72%' },
  });
}

/** 宽幅间奏视差 */
function initParallax() {
  const imgs = gsap.utils.toArray<HTMLElement>('[data-parallax]');
  if (imgs.length === 0) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  imgs.forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}

function init() {
  teardown();
  window.scrollTo(0, 0);
  initSmoothScroll();
  initHeader();
  initHero();
  initReveals();
  initManifesto();
  initParallax();
  ScrollTrigger.refresh();
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', teardown);
