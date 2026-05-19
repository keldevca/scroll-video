import { useEffect, useState } from 'react'

export function useVideoFrames(src, fps = 20) {
  const [frames, setFrames] = useState([])
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function extract() {
      const video = document.createElement('video')
      video.src = src
      video.muted = true
      video.crossOrigin = 'anonymous'

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve
        video.onerror = reject
      })

      const totalFrames = Math.floor(video.duration * fps)
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      const out = []

      for (let i = 0; i < totalFrames; i++) {
        if (cancelled) return
        video.currentTime = i / fps
        await new Promise((resolve) => { video.onseeked = resolve })
        ctx.drawImage(video, 0, 0)
        out.push(canvas.toDataURL('image/webp', 0.92))
        setProgress(Math.round(((i + 1) / totalFrames) * 100))
      }

      if (!cancelled) {
        setFrames(out)
        setLoading(false)
      }
    }

    extract()
    return () => { cancelled = true }
  }, [src, fps])

  return { frames, loading, progress }
}
