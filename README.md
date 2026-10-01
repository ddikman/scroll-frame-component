# ScrollFrame

ScrollFrame turns a tall website screenshot into an animated walkthrough inside a phone, tablet, or laptop frame. It moves down in smooth, slightly varied swipes, pauses between them, and returns quickly to the top. It uses React, CSS, and browser APIs without an animation library.

## Try the example

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The example includes three tall SVG sample pages and controls for device, pace, step distance, autoplay, and looping. Run `npm run build` to type-check and build the library and example.

On desktop widths, the example fits within the viewport height. On narrower layouts, the page flows vertically.

## Use the component

This repository is a private package intended for local use. Build it with `npm run build`, then install its directory from another React project (`npm install /path/to/this/repository`). The package exports JavaScript, TypeScript declarations, and a separate stylesheet.

```tsx
import { ScrollFrame } from 'scroll-frame-react';
import 'scroll-frame-react/style.css';

export function Preview() {
  return (
    <ScrollFrame
      src="/screenshots/mobile-homepage.png"
      alt="Full mobile homepage"
      device="phone"
      settings={{ scrollStep: 0.72, loop: true }}
    />
  );
}
```

Supply one long image captured at the layout width you want to show. The image is scaled to the frame's screen width and clipped vertically. For the best result, use a portrait mobile capture for `phone`, a portrait tablet capture for `tablet`, and a desktop capture for `desktop`.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `src` | `string` | URL of the tall screenshot. |
| `alt` | `string` | Accessible description of the screenshot. |
| `device` | `'phone' \| 'tablet' \| 'desktop'` | Mockup frame and screen shape. |
| `settings` | `Partial<ScrollFrameSettings>` | Override any playback default below. |
| `className` | `string` | Optional outer frame class. |
| `style` | `React.CSSProperties` | Optional outer frame style. |

| Setting | Default | Meaning |
| --- | ---: | --- |
| `scrollStep` | `0.72` | Distance per step as a fraction of visible screen height. |
| `distanceVariation` | `0.20` | Maximum variation in swipe distance (±20% by default); set to `0` for fixed distances. |
| `timingVariation` | `0.18` | Maximum variation in swipe and between-swipe pause durations (±18% by default). |
| `dragMs` | `700` | Main portion of swipe duration in milliseconds. |
| `glideMs` | `250` | Additional settling time; combined with `dragMs` into one continuous eased swipe. |
| `pauseMs` | `700` | Average pause between swipes. |
| `bottomPauseMs` | `1100` | Pause at the bottom. |
| `returnMs` | `500` | Quick trip back to the top. |
| `topPauseMs` | `900` | Pause at the top before a new cycle or stopping. |
| `autoplay` | `true` | Start playback automatically. When false, show the top of the image. |
| `loop` | `true` | Repeat after returning to the top. When false, play one cycle and stop there. |

The frame is responsive up to its preset width. Override `--sf-width` in a custom class if you need a different maximum width. Animation pauses while the frame is outside the viewport or the tab is hidden. If the user prefers reduced motion, the image stays at the top. Images shorter than the screen do not move.

## License

MIT © 2026 David Dikman. See [LICENSE](LICENSE).

## Project layout

- `src/ScrollFrame.tsx` — component and playback logic
- `src/ScrollFrame.css` — device frames
- `example/` — interactive demo and local sample artwork
- `scripts/generate_samples.py` — regenerate the demo artwork with Python's standard library
- `AGENTS.md` — instructions for coding agents working in this repository
