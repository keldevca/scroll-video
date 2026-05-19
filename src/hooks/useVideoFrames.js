import { useEffect, useState } from 'react'

export function useVideoFrames(src, fps = 12) {
  const [frames, setFrames] = useState([])
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const urls = []

    async function extract() {
      const video = document.createElement('video')
      video.src = src
      video.muted = true
      video.playsInline = true
      video.preload = 'auto'
      video.style.position = 'fixed'
      video.style.left = '-9999px'
      video.style.width = '1px'
      video.style.height = '1px'
      document.body.appendChild(video)

      try {
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = resolve
          video.onerror = reject
        })

        const totalFrames = Math.floor(video.duration * fps)
        const scale = 0.7
        const canvas = document.createElement('canvas')
        canvas.width = Math.floor(video.videoWidth * scale)
        canvas.height = Math.floor(video.videoHeight * scale)
        const ctx = canvas.getContext('2d')

        for (let i = 0; i < totalFrames; i++) {
          if (cancelled) return
          video.currentTime = i / fps
          await new Promise((resolve) => {
            let done = false
            const finish = () => { if (!done) { done = true; resolve() } }
            video.onseeked = finish
            setTimeout(finish, 1500)
          })
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85))
          if (blob) urls.push(URL.createObjectURL(blob))
          setProgress(Math.round(((i + 1) / totalFrames) * 100))
        }

        if (!cancelled) {
          setFrames(urls.slice())
          setLoading(false)
        }
      } finally {
        video.remove()
      }
    }

    extract()
    return () => {
      cancelled = true
      urls.forEach(URL.revokeObjectURL)
    }
  }, [src, fps])

  return { frames, loading, progress }
}
