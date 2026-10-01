import React from 'react';
import ReactDOM from 'react-dom/client';
import { ScrollFrame } from '../../src';
import type { ScrollFrameDevice, ScrollFrameSettings } from '../../src';
import './style.css';

const devices: { id: ScrollFrameDevice; label: string; description: string }[] = [
  { id: 'phone', label: 'Phone', description: 'Portrait · 9:19.5' },
  { id: 'tablet', label: 'Tablet', description: 'Portrait · 3:4' },
  { id: 'desktop', label: 'Desktop', description: 'Laptop · 16:10' },
];

function App() {
  const [device, setDevice] = React.useState<ScrollFrameDevice>('phone');
  const [autoplay, setAutoplay] = React.useState(true);
  const [loop, setLoop] = React.useState(true);
  const [pace, setPace] = React.useState(1);
  const [scrollStep, setScrollStep] = React.useState(0.72);

  const timing = (milliseconds: number) => Math.round(milliseconds / pace);
  const settings: Partial<ScrollFrameSettings> = {
    autoplay,
    loop,
    scrollStep,
    dragMs: timing(700),
    glideMs: timing(250),
    pauseMs: timing(700),
    bottomPauseMs: timing(1100),
    returnMs: timing(500),
    topPauseMs: timing(900),
  };

  return (
    <main className="demo">
      <header className="demo-header">
        <div className="brand"><span className="brand-mark">S</span><span>SCROLLFRAME</span></div>
        <span className="header-note">A React component for telling the whole story.</span>
        <a className="github-link" href="https://github.com/ddikman/scroll-frame-component">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
          GITHUB
        </a>
      </header>

      <section className="intro">
        <div className="eyebrow"><span className="eyebrow-line" /> THE COMPONENT</div>
        <h1>Give your screenshots<br /><em>some motion.</em></h1>
        <p>Turn a long page capture into a lifelike walkthrough. Choose a device, set the rhythm, and let the page unfold.</p>
      </section>

      <section className="playground" aria-label="ScrollFrame example">
        <div className="preview">
          <div className="preview-label">LIVE PREVIEW <span>01 / 03</span></div>
          <ScrollFrame
            src={`samples/${device}.svg`}
            alt={`Sample editorial website in a ${device} layout`}
            device={device}
            settings={settings}
          />
          <div className="preview-caption"><span>FOLIO — SAMPLE WEBSITE</span><span>AUTO SCROLLING ↓</span></div>
        </div>

        <aside className="controls">
          <div className="controls-heading"><span className="controls-index">01 / SETTINGS</span><h2>Make it yours.</h2><p>Every screenshot has its own pace. Start with the defaults, then tune the motion.</p></div>
          <div className="control-group">
            <h3>Device frame</h3>
            <div className="device-options">
              {devices.map((option) => (
                <button key={option.id} className={`device-option ${device === option.id ? 'selected' : ''}`} type="button" onClick={() => setDevice(option.id)} aria-pressed={device === option.id}>
                  <span className={`device-icon device-icon--${option.id}`} aria-hidden="true" />
                  <span><strong>{option.label}</strong><small>{option.description}</small></span>
                  <span className="option-dot" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
          <div className="control-group slider-group">
            <div className="control-title"><h3>Pace</h3><output>{pace.toFixed(1)}×</output></div>
            <input aria-label="Pace" type="range" min="0.5" max="2" step="0.1" value={pace} onChange={(event) => setPace(Number(event.target.value))} />
            <div className="range-labels"><span>RELAXED</span><span>BRISK</span></div>
          </div>
          <div className="control-group slider-group">
            <div className="control-title"><h3>Scroll distance</h3><output>~{Math.round(scrollStep * 100)}%</output></div>
            <input aria-label="Scroll distance" type="range" min="0.3" max="1.2" step="0.02" value={scrollStep} onChange={(event) => setScrollStep(Number(event.target.value))} />
            <div className="range-labels"><span>SHORT STEPS</span><span>LONG STEPS</span></div>
          </div>
          <div className="control-group toggles">
            <label className="toggle-row"><span><strong>Autoplay</strong><small>Start when visible</small></span><input type="checkbox" checked={autoplay} onChange={(event) => setAutoplay(event.target.checked)} /><span className="switch" aria-hidden="true" /></label>
            <label className="toggle-row"><span><strong>Loop playback</strong><small>Start again after returning</small></span><input type="checkbox" checked={loop} onChange={(event) => setLoop(event.target.checked)} /><span className="switch" aria-hidden="true" /></label>
          </div>
          <p className="controls-footnote">Swipe distance and timing vary slightly. Motion pauses offscreen and respects reduced motion settings.</p>
        </aside>
      </section>
      <footer><span>SCROLLFRAME / REACT</span><span>ONE IMAGE. THE WHOLE PAGE.</span></footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
