import React, { useRef, useEffect, useState } from 'react'

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [streaming, setStreaming] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  function stopCamera() {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
    setStreaming(false)
  }

  async function startCamera() {
    if (streaming) return
    setError(null)

    setStreaming(true)
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      if (!videoRef.current) {
        throw new Error('Video element not ready. Please try again.')
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }, 
        audio: false 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            console.error('Play error:', err)
            setError('Could not play video: ' + err.message)
            stopCamera()
          })
        }
      } else {
        stream.getTracks().forEach(t => t.stop())
        throw new Error('Video element lost during setup')
      }
    } catch (e) {
      console.error('Camera error:', e)
      setError(e.message || 'Could not access camera')
      setStreaming(false)
    }
  }

  function capture() {
    if (!videoRef.current || !canvasRef.current) {
      setError('Camera not ready')
      return
    }

    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      setError('Camera is still loading, please wait...')
      return
    }

    setCapturing(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    
    setTimeout(() => setCapturing(false), 150)
    
    canvas.toBlob(blob => {
      const url = canvas.toDataURL('image/jpeg')
      onCapture(url, blob)
      stopCamera() 
    }, 'image/jpeg', 0.95)
  }

  return (
    <div>
      {error && (
        <div className="error-message" style={{marginBottom: 12}}>
          <strong>⚠️ Camera Error:</strong> {error}
        </div>
      )}

      {streaming && (
        <div className="camera" style={{position: 'relative', marginBottom: 8}}>
          <video 
            ref={videoRef} 
            autoPlay
            playsInline
            muted
            style={{ 
              width: '100%', 
              borderRadius: 12,
              display: 'block',
              background: '#000',
              minHeight: '200px'
            }} 
          />
          {capturing && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'white',
              opacity: 0.7,
              borderRadius: 12,
              pointerEvents: 'none',
              animation: 'flash 0.15s ease-out'
            }} />
          )}
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="button-group">
        {!streaming ? (
          <button className="btn" onClick={startCamera}>
            📷 Open Camera
          </button>
        ) : (
          <>
            <button 
              className="btn" 
              onClick={capture}
              disabled={capturing}
            >
              {capturing ? '📸 Capturing...' : '📸 Capture'}
            </button>
            <button className="btn ghost" onClick={stopCamera}>
              ✕ Close
            </button>
          </>
        )}
      </div>
    </div>
  )
}
