<div align="center">

https://github.com/user-attachments/assets/0a664dbf-2a37-4ef6-bbf6-2e4d39af0aff

</div>

<div align="center">

# Mode &nbsp;*&*&nbsp; Passion

### A scroll-driven fashion experience

*A minimalist single-page interaction where a fashion sequence plays frame by frame as you scroll, ending with a Vogue-style magazine cover reveal.*

[**Live Demo**](#) · [**LinkedIn**](https://www.linkedin.com/in/kellydev/)

</div>

---

## About

**Mode & Passion** is an awwwards-style React project exploring scroll-driven storytelling. A model walks toward the camera frame by frame as the user scrolls. Near the end, the navigation fades, a "MODE & PASSION" masthead composes itself in front of the model, paparazzi flashes burst across the scene, and coverlines + a cover story title fade in to recreate the look of a fashion magazine cover.

Built as a learning project to practice canvas-based scroll animations, frame extraction, layered overlays, and minimalist editorial design.

## Features

- Smooth frame-by-frame video scrubbing tied to scroll position
- All-keyframe encoding for instant per-frame seeking
- Multi-phase reveal: title, walk, magazine masthead, paparazzi flash, coverlines
- Background-removed model cutout layered in front of the masthead (Vogue effect)
- Awwwards-style staggered text reveal with blur-out + slide + scale animations
- Camera flash sequence (paired pulses simulating real flash photography)
- Fixed minimalist navigation that fades out as the magazine cover assembles
- Fully responsive (mobile-aware shrink + layout)

## Tech Stack

- **React 19**
- **Vite 8**
- **Tailwind CSS v4**
- Canvas 2D + WebP frame extraction
- **Playfair Display** (Google Fonts)

## How it works

The whole experience is a single sticky section whose scroll progress drives every effect:

| Progress | Effect |
|----------|--------|
| 0% – 3% | Centered title "Mode & Passion" + scroll indicator |
| 3% – 21% | Title fades out as the user starts scrolling |
| 21% – 65% | Pure frame-by-frame video playback |
| 62% – 77% | Navbar fades out |
| 65% – 80% | "MODE & PASSION" masthead + dateline reveal |
| 78% – 95% | Coverlines, "Spring Reverie" cover story, footer labels stagger in |
| 85% – 99% | Paparazzi camera flashes burst over the scene |
| 85% – 98% | Model cutout fades in front of the masthead |

Frames are extracted client-side: a hidden `<video>` element seeks frame by frame and each frame is drawn to a canvas, then encoded as a WebP data URL and cached.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Customizing the video

1. Drop your own clip into `public/video/` and update the path in [`src/App.jsx`](src/App.jsx):
   ```js
   const VIDEO_SRC = '/video/your-clip.mp4'
   ```

2. For best performance, encode short clips (~8s) at 1080p with every frame as a keyframe:
   ```bash
   ffmpeg -i input.mp4 -t 8 -vf "scale=-2:1080" \
     -c:v libx264 -preset slow -crf 18 \
     -g 1 -keyint_min 1 -an output.mp4
   ```
   `-g 1 -keyint_min 1` forces every frame to be a keyframe → near-instant per-frame seeking.

3. Extract the final frame and remove its background (PhotoRoom, erase.bg, or `rembg`):
   ```bash
   ffmpeg -sseof -0.06 -i public/video/your-clip.mp4 -frames:v 1 last-frame.png
   ```
   Save the transparent result as `public/cutout.png` (it powers the "model in front of masthead" effect).

## Project structure

```
src/
├── App.jsx                    entry, loads video + composes UI
├── index.css                  Tailwind + reveal & flash keyframes
├── components/
│   ├── Nav.jsx                monogram + social links, fades out near end
│   └── VideoScrubber.jsx      canvas, scroll handler, magazine cover reveal
└── hooks/
    └── useVideoFrames.js      client-side frame extraction

public/
├── video/model.mp4            scroll-driven video
├── cutout.png                 transparent model overlay (Vogue effect)
└── favicon.svg
```

## Credits

- Font: [Playfair Display](https://fonts.google.com/specimen/Playfair+Display)
- Design inspired by [awwwards.com](https://www.awwwards.com) and *Vogue* magazine covers

## Author

Made by **Kelly** · [LinkedIn](https://www.linkedin.com/in/kellydev/)
