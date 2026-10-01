import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

export type ScrollFrameDevice = 'phone' | 'tablet' | 'desktop';

export interface ScrollFrameSettings {
  /** Average swipe distance, as a fraction of the visible screen height. */
  scrollStep: number;
  /** Maximum proportional variation applied to each swipe distance. */
  distanceVariation: number;
  /** Maximum proportional variation applied to swipe and pause durations. */
  timingVariation: number;
  /** Together, dragMs and glideMs set the duration of one continuous eased swipe. */
  dragMs: number;
  glideMs: number;
  pauseMs: number;
  bottomPauseMs: number;
  returnMs: number;
  topPauseMs: number;
  autoplay: boolean;
  loop: boolean;
}

export interface ScrollFrameProps {
  src: string;
  alt: string;
  device: ScrollFrameDevice;
  settings?: Partial<ScrollFrameSettings>;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_SETTINGS: ScrollFrameSettings = {
  scrollStep: 0.72,
  distanceVariation: 0.2,
  timingVariation: 0.18,
  dragMs: 700,
  glideMs: 250,
  pauseMs: 700,
  bottomPauseMs: 1100,
  returnMs: 500,
  topPauseMs: 900,
  autoplay: true,
  loop: true,
};

type Phase = 'idle' | 'swipe' | 'pause' | 'bottomPause' | 'return' | 'topPause';

const easeInOut = (progress: number) =>
  progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
// Accelerate quickly, then settle gradually, with no velocity jump at either end.
const easeSwipe = (progress: number) => progress ** 2 * (6 - 8 * progress + 3 * progress ** 2);

function finiteNonNegative(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

export function ScrollFrame({
  src,
  alt,
  device,
  settings,
  className,
  style,
}: ScrollFrameProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageVersion, setImageVersion] = useState(0);

  const scrollStep = finiteNonNegative(settings?.scrollStep, DEFAULT_SETTINGS.scrollStep) || DEFAULT_SETTINGS.scrollStep;
  const distanceVariation = Math.min(0.5, finiteNonNegative(settings?.distanceVariation, DEFAULT_SETTINGS.distanceVariation));
  const timingVariation = Math.min(0.5, finiteNonNegative(settings?.timingVariation, DEFAULT_SETTINGS.timingVariation));
  const dragMs = finiteNonNegative(settings?.dragMs, DEFAULT_SETTINGS.dragMs);
  const glideMs = finiteNonNegative(settings?.glideMs, DEFAULT_SETTINGS.glideMs);
  const pauseMs = finiteNonNegative(settings?.pauseMs, DEFAULT_SETTINGS.pauseMs);
  const bottomPauseMs = finiteNonNegative(settings?.bottomPauseMs, DEFAULT_SETTINGS.bottomPauseMs);
  const returnMs = finiteNonNegative(settings?.returnMs, DEFAULT_SETTINGS.returnMs);
  const topPauseMs = finiteNonNegative(settings?.topPauseMs, DEFAULT_SETTINGS.topPauseMs);
  const autoplay = settings?.autoplay ?? DEFAULT_SETTINGS.autoplay;
  const loop = settings?.loop ?? DEFAULT_SETTINGS.loop;

  useEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const image = imageRef.current;
    if (!root || !viewport || !image) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionPreference.matches;
    let inView = true;
    let tabVisible = document.visibilityState !== 'hidden';
    let raf = 0;
    let lastTime: number | null = null;
    let phase: Phase = 'idle';
    let elapsed = 0;
    let offset = 0;
    let maxOffset = 0;
    let from = 0;
    let to = 0;
    let swipeDuration = dragMs + glideMs;
    let pauseDuration = pauseMs;

    const variedDuration = (duration: number) =>
      duration * (1 + (Math.random() * 2 - 1) * timingVariation);

    const paint = () => {
      image.style.transform = `translate3d(0, ${-offset}px, 0)`;
    };

    const beginStep = () => {
      if (maxOffset <= 0) {
        phase = 'idle';
        return;
      }
      const variation = 1 + (Math.random() * 2 - 1) * distanceVariation;
      const target = Math.min(maxOffset, offset + viewport.clientHeight * scrollStep * variation);
      if (target <= offset + 0.5) {
        offset = maxOffset;
        paint();
        phase = 'bottomPause';
      } else {
        from = offset;
        to = target;
        swipeDuration = variedDuration(dragMs + glideMs);
        phase = 'swipe';
      }
      elapsed = 0;
    };

    const advance = () => {
      elapsed = 0;
      switch (phase) {
        case 'swipe':
          phase = offset >= maxOffset - 0.5 ? 'bottomPause' : 'pause';
          if (phase === 'pause') pauseDuration = variedDuration(pauseMs);
          break;
        case 'pause':
          beginStep();
          break;
        case 'bottomPause':
          from = offset;
          to = 0;
          phase = 'return';
          break;
        case 'return':
          offset = 0;
          paint();
          phase = 'topPause';
          break;
        case 'topPause':
          if (loop) beginStep();
          else phase = 'idle';
          break;
        default:
          break;
      }
    };

    const tick = (now: number) => {
      raf = 0;
      if (lastTime === null) lastTime = now;
      elapsed += Math.min(now - lastTime, 64);
      lastTime = now;

      const duration = phase === 'swipe' ? swipeDuration
        : phase === 'pause' ? pauseDuration
            : phase === 'bottomPause' ? bottomPauseMs
              : phase === 'return' ? returnMs : topPauseMs;

      if (phase === 'swipe' || phase === 'return') {
        const progress = duration === 0 ? 1 : Math.min(1, elapsed / duration);
        offset = from + (to - from) * (phase === 'swipe' ? easeSwipe(progress) : easeInOut(progress));
        paint();
      }

      if (elapsed >= duration) {
        if (phase === 'swipe' || phase === 'return') {
          offset = to;
          paint();
        }
        advance();
      }
      schedule();
    };

    const schedule = () => {
      if (!raf && autoplay && !reducedMotion && inView && tabVisible && phase !== 'idle') {
        raf = window.requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      lastTime = null;
    };

    const measure = () => {
      if (!image.complete || image.naturalWidth === 0) return;
      const nextMax = Math.max(0, image.getBoundingClientRect().height - viewport.clientHeight);
      if (Math.abs(nextMax - maxOffset) < 0.5) return;
      maxOffset = nextMax;
      offset = Math.min(offset, maxOffset);
      paint();
      stop();
      if (autoplay && !reducedMotion && maxOffset > 0) beginStep();
      else phase = 'idle';
      schedule();
    };

    const onMotionChange = () => {
      reducedMotion = motionPreference.matches;
      stop();
      offset = 0;
      paint();
      if (autoplay && !reducedMotion && maxOffset > 0) beginStep();
      else phase = 'idle';
      schedule();
    };

    const onVisibilityChange = () => {
      tabVisible = document.visibilityState !== 'hidden';
      if (tabVisible) schedule();
      else stop();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    resizeObserver.observe(image);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) schedule();
      else stop();
    });
    intersectionObserver.observe(root);
    motionPreference.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    offset = 0;
    paint();
    measure();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionPreference.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [src, device, imageVersion, scrollStep, distanceVariation, timingVariation, dragMs, glideMs, pauseMs, bottomPauseMs, returnMs, topPauseMs, autoplay, loop]);

  const screen = (
    <div className="sf-screen" ref={viewportRef}>
      <img
        ref={imageRef}
        className="sf-image"
        src={src}
        alt={alt}
        draggable={false}
        onLoad={() => setImageVersion((value) => value + 1)}
      />
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={`sf-frame sf-frame--${device}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {device === 'desktop' ? (
        <>
          <div className="sf-laptop-lid">
            <span className="sf-laptop-camera" aria-hidden="true" />
            {screen}
          </div>
          <div className="sf-laptop-base" aria-hidden="true"><span className="sf-laptop-notch" /></div>
        </>
      ) : (
        <div className="sf-device-body">
          {device === 'phone' ? <span className="sf-phone-notch" aria-hidden="true" /> : <span className="sf-tablet-camera" aria-hidden="true" />}
          {screen}
        </div>
      )}
    </div>
  );
}
