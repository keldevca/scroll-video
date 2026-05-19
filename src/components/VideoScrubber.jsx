import { useEffect, useRef } from 'react'

export default function VideoScrubber({ frames, videoSrc }) {
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const mediaWrapRef = useRef(null)
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const mastheadRef = useRef(null)
  const cutoutRef = useRef(null)
  const coverlinesRef = useRef(null)
  const flashRef = useRef(null)

  const useVideo = !!videoSrc
  const scrollHeight = useVideo ? 5000 : frames.length * 30

  useEffect(() => {
    let rafId = null
    let images = []
    let ctx = null
    let currentIndex = -1

    if (!useVideo) {
      if (frames.length === 0) return
      images = frames.map((src) => {
        const img = new Image()
        img.src = src
        return img
      })
      ctx = canvasRef.current.getContext('2d')
    }

    const drawFrame = (index) => {
      const image = images[index]
      if (!image || !image.complete) return
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      ctx.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height)
    }

    const update = () => {
      rafId = null
      const rect = containerRef.current.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const scrolled = Math.max(0, -rect.top)
      const progress = Math.min(scrolled / scrollable, 1)

      if (useVideo) {
        const video = videoRef.current
        if (video.duration) {
          video.currentTime = progress * video.duration
        }
      } else {
        const index = Math.floor(progress * (frames.length - 1))
        if (index !== currentIndex) {
          currentIndex = index
          drawFrame(index)
        }
      }

      const titleFade = Math.max(0, 1 - (progress - 0.03) / 0.18)
      titleRef.current.style.opacity = Math.min(1, titleFade)

      const cutoutFade = Math.max(0, Math.min(1, (progress - 0.85) / 0.13))
      cutoutRef.current.style.opacity = cutoutFade
      const mediaFade = 1 - Math.max(0, Math.min(1, (progress - 0.92) / 0.07))
      mediaWrapRef.current.style.opacity = mediaFade
      mastheadRef.current.classList.toggle('reveal-on', progress > 0.65)
      coverlinesRef.current.classList.toggle('reveal-on', progress > 0.78)
      flashRef.current.classList.toggle('flash-burst', progress > 0.85 && progress < 0.99)
    }

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update)
    }

    if (!useVideo) {
      const first = images[0]
      if (first.complete) drawFrame(0)
      else first.onload = () => drawFrame(0)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [frames, useVideo])

  return (
    <div ref={containerRef} style={{ height: `${scrollHeight}px` }}>
      <div className="sticky top-0 h-screen bg-black overflow-hidden p-3 sm:p-4">
        <div ref={mediaWrapRef} className="absolute inset-3 sm:inset-4 rounded-2xl sm:rounded-3xl overflow-hidden" style={{ willChange: 'opacity' }}>
          {useVideo ? (
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              autoPlay
              playsInline
              preload="auto"
              onLoadedMetadata={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0.01 }}
              className="w-full h-full object-cover"
            />
          ) : (
            <canvas
              ref={canvasRef}
              width={1433}
              height={756}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div
          ref={titleRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-white z-10 px-6"
          style={{ willChange: 'opacity' }}
        >
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-[10rem] font-medium tracking-tight leading-none drop-shadow-2xl text-center">
            Mode <span className="italic font-normal">&amp;</span> Passion
          </h1>
          <div className="mt-10 sm:mt-16 flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-300">Scroll</span>
            <div className="w-6.5 h-10.5 rounded-full border border-white/70 flex items-start justify-center p-1.5">
              <span className="block w-1 h-2 rounded-full bg-white animate-bounce" />
            </div>
          </div>
        </div>

        <div
          ref={mastheadRef}
          className="absolute top-6 sm:top-10 inset-x-0 px-5 sm:px-12 text-center text-white z-20 pointer-events-none"
        >
          <h2 className="reveal-down font-serif text-4xl sm:text-6xl lg:text-9xl font-black tracking-tight leading-none drop-shadow-2xl">
            MODE <span className="italic font-normal">&amp;</span> PASSION
          </h2>
          <div className="reveal delay-2 mt-2 sm:mt-3 flex items-center justify-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-neutral-200">
            <span>Spring / 26</span>
            <span>·</span>
            <span>Issue N°01</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">€12.00</span>
          </div>
        </div>

        <div
          ref={cutoutRef}
          className="absolute inset-3 sm:inset-4 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none opacity-0 z-30"
          style={{ willChange: 'opacity' }}
        >
          <img src={`${import.meta.env.BASE_URL}cutout.png`} alt="" className="w-full h-full object-cover select-none" />
        </div>

        <div
          ref={flashRef}
          className="absolute inset-3 sm:inset-4 rounded-2xl sm:rounded-3xl bg-white opacity-0 pointer-events-none z-50"
        />

        <div
          ref={coverlinesRef}
          className="absolute inset-0 text-white z-40 pointer-events-none"
        >
          <div className="reveal delay-1 absolute top-8 right-8 sm:top-12 sm:right-16 text-xs sm:text-sm font-bold uppercase tracking-widest drop-shadow">
            May
          </div>

          <div className="hidden sm:flex absolute top-[30%] left-8 sm:left-16 max-w-[42%] flex-col gap-7 sm:gap-10 text-left drop-shadow">
            <div className="reveal delay-2 leading-[1.05]">
              <p className="text-base sm:text-xl lg:text-2xl font-extrabold uppercase tracking-wide">
                <span className="text-rose-500">Effortless</span> Silhouettes
              </p>
              <p className="text-sm sm:text-base lg:text-lg font-extrabold uppercase tracking-wide text-neutral-200">The new minimal</p>
              <p className="text-sm sm:text-base lg:text-lg font-extrabold uppercase tracking-wide text-neutral-200">100 looks for spring</p>
            </div>
            <div className="reveal delay-3 leading-[1.05]">
              <p className="text-base sm:text-xl lg:text-2xl font-extrabold uppercase tracking-wide">Quiet Confidence</p>
              <p className="text-sm sm:text-base lg:text-lg font-extrabold uppercase tracking-wide text-neutral-200">A new natural</p>
              <p className="text-sm sm:text-base lg:text-lg font-extrabold uppercase tracking-wide text-neutral-200">Wear the silence</p>
            </div>
          </div>

          <div className="hidden sm:flex absolute top-[30%] right-8 sm:right-16 max-w-[42%] flex-col gap-7 sm:gap-10 text-right items-end drop-shadow">
            <div className="reveal delay-2 leading-[1.05]">
              <p className="text-base sm:text-xl lg:text-2xl font-extrabold uppercase tracking-wide">
                <span className="text-amber-300">The Atelier</span> Issue
              </p>
              <p className="text-sm sm:text-base lg:text-lg font-extrabold uppercase tracking-wide text-neutral-200">Behind the seams</p>
              <p className="text-sm sm:text-base lg:text-lg font-extrabold uppercase tracking-wide text-neutral-200">10 designers to watch</p>
            </div>
            <div className="reveal delay-3 leading-[1.05]">
              <p className="text-base sm:text-xl lg:text-2xl font-extrabold uppercase tracking-wide">Beauty Files</p>
              <p className="text-sm sm:text-base lg:text-lg font-extrabold uppercase tracking-wide text-neutral-200">Skin first</p>
              <p className="text-sm sm:text-base lg:text-lg font-extrabold uppercase tracking-wide text-neutral-200">No-makeup makeup</p>
            </div>
          </div>

          <div className="reveal-scale delay-4 absolute bottom-16 sm:bottom-20 inset-x-0 text-center drop-shadow-lg px-4">
            <h3 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-black italic tracking-tight leading-[0.85] text-amber-300">
              Spring<br/>Reverie
            </h3>
            <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-white">
              How Mode &amp; Passion<br className="sm:hidden" /> redefines Spring 26
            </p>
          </div>

          <div className="reveal delay-5 absolute bottom-8 sm:bottom-10 left-8 sm:left-16 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-neutral-300 drop-shadow">
            Maison · Paris
          </div>
          <div className="reveal delay-5 absolute bottom-8 sm:bottom-10 right-8 sm:right-16 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-neutral-300 drop-shadow">
            modeandpassion.com
          </div>
        </div>
      </div>
    </div>
  )
}
