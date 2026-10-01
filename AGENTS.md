# Agent instructions

This repository contains a small React component library (`src/`) and a Vite example (`example/`). The example imports the source directly so local edits appear immediately.

## Working on the component

- Keep the runtime dependency limited to React. Use browser APIs and CSS for animation and device frames.
- Preserve the public exports in `src/index.ts`: `ScrollFrame`, `ScrollFrameProps`, `ScrollFrameSettings`, and `ScrollFrameDevice`.
- Keep screenshot movement based on the rendered image and viewport sizes. A short image must stay still; a long image must stop at the exact bottom before returning.
- Keep each downward swipe as one continuous eased motion. Sample bounded distance and timing variation per swipe, and clamp the last swipe to the bottom.
- Respect reduced motion, pause playback offscreen, and clean up animation frames and observers.
- Treat `dist/` and `dist-example/` as generated output. Edit `src/` and `example/` instead.

## Verification

Run `npm install` when dependencies change, then `npm run build`. The build checks TypeScript and produces both the library and example. Check phone, tablet, and desktop in the example when browser access is available. Keep sample artwork local in `example/public/samples/`; regenerate it with `python3 scripts/generate_samples.py` when needed.
