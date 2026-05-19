import { useVideoFrames } from './hooks/useVideoFrames'
import Nav from './components/Nav'
import VideoScrubber from './components/VideoScrubber'

const VIDEO_SRC = '/video/model.mp4'

export default function App() {
  const { frames, loading, progress } = useVideoFrames(VIDEO_SRC)

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-400 mb-6">Maison</p>
        <p className="text-6xl font-bold tabular-nums">{progress}%</p>
      </div>
    )
  }

  return (
    <main className="bg-black">
      <Nav />
      <VideoScrubber frames={frames} />
    </main>
  )
}
