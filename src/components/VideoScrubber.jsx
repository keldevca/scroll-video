import { useEffect, useRef } from 'react'

export default function VideoScrubber({ frames }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const stageRef = useRef(null)
  const titleRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    if (frames.length === 0) return

    const images = frames.map((src) => {
      const img = new Image()
      img.src = src
      return img
    })

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let currentIndex = -1
    let rafId = null

    const drawFrame = (index) => {
      const image = images[index]
      if (!image.complete) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    }

    const update = () => {
      rafId = null
      const rect = containerRef.current.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const scrolled = Math.max(0, -rect.top)
      const progress = Math.min(scrolled / scrollable, 1)
      const index = Math.floor(progress * (frames.length - 1))

      if (index !== currentIndex) {
        currentIndex = index
        drawFrame(index)
      }

      const titleFade = Math.max(0, 1 - (progress - 0.03) / 0.18)
      titleRef.current.style.opacity = Math.min(1, titleFade)

      const shrink = Math.max(0, Math.min(1, (progress - 0.7) / 0.25))
      const scale = 1 - shrink * 0.45
      const translateX = -shrink * 25
      stageRef.current.style.transform = `translateX(${translateX}%) scale(${scale})`
      textRef.current.style.opacity = shrink
    }

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update)
    }

    const first = images[0]
    if (first.complete) drawFrame(0)
    else first.onload = () => drawFrame(0)

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [frames])

  return (
    <div ref={containerRef} style={{ height: `${frames.length * 30}px` }}>
      <div className="sticky top-0 h-screen bg-black overflow-hidden">
        <div
          ref={stageRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformOrigin: 'center center', willChange: 'transform' }}
        >
          <canvas
            ref={canvasRef}
            width={2048}
            height={1080}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          ref={titleRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-white z-10"
          style={{ willChange: 'opacity' }}
        >
          <h1 className="font-serif text-7xl lg:text-[10rem] font-medium tracking-tight leading-none drop-shadow-2xl">
            Mode <span className="italic font-normal">&amp;</span> Passion
          </h1>
          <div className="mt-16 flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-300">Scroll</span>
            <div className="w-6.5 h-10.5 rounded-full border border-white/70 flex items-start justify-center p-1.5">
              <span className="block w-1 h-2 rounded-full bg-white animate-bounce" />
            </div>
          </div>
        </div>

        <div
          ref={textRef}
          className="absolute right-0 top-0 h-full w-1/2 flex flex-col justify-center px-12 lg:px-20 text-white opacity-0 pointer-events-none z-20"
          style={{ willChange: 'opacity' }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400 mb-6">Spring / 26</p>
          <h2 className="font-serif text-5xl lg:text-7xl font-medium leading-[0.95] mb-8">
            Effortless<br/><span className="italic">silhouettes.</span>
          </h2>
          <p className="text-base lg:text-lg text-neutral-300 max-w-md leading-relaxed">
            A minimalist capsule built around movement, presence, and quiet confidence.
          </p>
        </div>
      </div>
    </div>
  )
}
