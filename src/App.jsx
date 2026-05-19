import { useState, useEffect } from 'react'
import { useVideoFrames } from './hooks/useVideoFrames'
import Nav from './components/Nav'
import VideoScrubber from './components/VideoScrubber'

const VIDEO_SRC = `${import.meta.env.BASE_URL}video/model.mp4`

function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  )
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])
  return mobile
}

function DesktopApp() {
  const { frames, loading, progress } = useVideoFrames(VIDEO_SRC)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setShowLoader(false), 800)
      return () => clearTimeout(t)
    }
  }, [loading])

  return (
    <>
      {!loading && (
        <main className="bg-black animate-fadein">
          <Nav />
          <VideoScrubber frames={frames} />
        </main>
      )}
      {showLoader && (
        <div
          className={`fixed inset-0 z-[100] bg-black text-white flex items-center justify-center transition-opacity duration-700 ease-out ${loading ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="text-center px-6">
            <p className="font-serif italic text-2xl sm:text-4xl text-neutral-200 mb-4">
              Mode <span className="font-normal">&amp;</span> Passion
            </p>
            <p className="text-6xl sm:text-8xl font-bold tabular-nums tracking-tight">{progress}%</p>
            <p className="mt-6 text-[10px] uppercase tracking-[0.5em] text-neutral-500">Spring / 26 · Loading</p>
          </div>
        </div>
      )}
    </>
  )
}

function MobileApp() {
  return (
    <main className="bg-black animate-fadein">
      <Nav />
      <VideoScrubber videoSrc={VIDEO_SRC} />
    </main>
  )
}

export default function App() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileApp /> : <DesktopApp />
}
