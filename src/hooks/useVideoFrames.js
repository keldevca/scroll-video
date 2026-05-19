import { useEffect, useState } from 'react'

export function useVideoFrames(src, fps = 20) {
  const [frames, setFrames] = useState([])
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function extract() {
      const isMobile = window.matchMedia('(max-width: 767px)').matches
      const effectiveFps = isMobile ? 12 : fps
      const scale = isMobile ? 0.55 : 1
      const quality = isMobile ? 0.82 : 0.92

      const video = document.createElement('video')
      video.src = src
      video.muted = true
      video.playsInline = true
      video.setAttribute('playsinline', '')
      video.setAttribute('webkit-playsinline', '')
      video.preload = 'auto'

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve
        video.onerror = reject
      })

      const totalFrames = Math.floor(video.duration * effectiveFps)
      const canvas = document.createElement('canvas')
      canvas.width = Math.floor(video.videoWidth * scale)
      canvas.height = Math.floor(video.videoHeight * scale)
      const ctx = canvas.getContext('2d')
      const out = []

      for (let i = 0; i < totalFrames; i++) {
        if (cancelled) return
        video.currentTime = i / effectiveFps
        await new Promise((resolve) => {
          let done = false
          const finish = () => { if (!done) { done = true; resolve() } }
          video.onseeked = finish
          setTimeout(finish, 500)
        })
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        out.push(canvas.toDataURL('image/webp', quality))
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
