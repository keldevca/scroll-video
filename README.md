<div align="center">

# Mode &nbsp;*&*&nbsp; Passion

### A scroll-driven fashion experience

*A minimalist single-page interaction where a fashion sequence plays frame by frame as you scroll, ending with an editorial reveal.*

[**Live Demo**](#) · [**LinkedIn**](https://www.linkedin.com/in/kellydev/)

</div>

<div align="center">

https://github.com/user-attachments/assets/0a664dbf-2a37-4ef6-bbf6-2e4d39af0aff

</div>

---

## About

**Mode & Passion** is a small awwwards-style React project exploring scroll-driven storytelling. A model walks toward the camera frame by frame as the user scrolls, then the video container shrinks and shifts left while an editorial text panel fades in on the right.

Built as a learning project to practice canvas-based scroll animations, frame extraction, and minimalist editorial design.

## Features

- Smooth frame-by-frame video scrubbing tied to scroll position
- All-keyframe encoding for instant per-frame seeking
- Animated shrink + editorial reveal at the end of the sequence
- Fixed minimalist navigation with serif monogram and social links
- Mouse-style scroll indicator with progressive fade

## Tech Stack

- **React 19**
- **Vite 8**
- **Tailwind CSS v4**
- Canvas 2D + WebP frame extraction
- **Playfair Display** (Google Fonts)

## How it works

1. The video loads on mount from `public/video/model.mp4`
2. Frames are extracted client-side using a hidden `<video>` element and a canvas
3. As you scroll, the matching frame is drawn to the visible canvas
4. After ~70% of the scroll, the canvas scales down + shifts left while a text panel fades in

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Customizing the video

Drop your own clip into `public/video/` and update the path in [`src/App.jsx`](src/App.jsx):

```js
const VIDEO_SRC = '/video/your-clip.mp4'
```

For best performance, encode short clips (~8s) at 1080p with every frame as a keyframe:

```bash
ffmpeg -i input.mp4 -t 8 -vf "scale=-2:1080" \
  -c:v libx264 -preset slow -crf 18 \
  -g 1 -keyint_min 1 -an output.mp4
```

The `-g 1 -keyint_min 1` flags force every frame to be a keyframe, which makes per-frame seeking nearly instant.

## Project structure

```
src/
├── App.jsx                    entry, loads video + composes UI
├── components/
│   ├── Nav.jsx                monogram + social links
│   └── VideoScrubber.jsx      canvas, scroll handler, shrink + text reveal
└── hooks/
    └── useVideoFrames.js      client-side frame extraction
```

## Credits

- Font: [Playfair Display](https://fonts.google.com/specimen/Playfair+Display)
- Design inspired by [awwwards.com](https://www.awwwards.com)

## Author

Made by **Kelly** · [LinkedIn](https://www.linkedin.com/in/kellydev/)
