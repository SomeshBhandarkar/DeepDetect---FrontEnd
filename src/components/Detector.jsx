// // src/components/Detector.jsx
// import React, {useState, useRef, useEffect} from 'react'
// import CameraCapture from './CameraCapture'
// import UploadForm from './UploadForm'
// import axios from 'axios'

// export default function Detector({onBack}){
//   const [imageSrc, setImageSrc] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [result, setResult] = useState(null)
//   const canvasRef = useRef(null)

//   // API base: use Vite env var if present, otherwise localhost:8000
//   const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

//   useEffect(()=>{
//     if(result && imageSrc){
//       drawDetections(result.detections)
//     }
//   },[result,imageSrc])

//   function drawDetections(detections){
//     const canvas = canvasRef.current
//     if(!canvas) return
//     const ctx = canvas.getContext('2d')
//     const img = new Image()
//     img.onload = ()=>{
//       canvas.width = img.width
//       canvas.height = img.height
//       ctx.clearRect(0,0,canvas.width,canvas.height)
//       ctx.drawImage(img,0,0)
//       ctx.lineWidth = Math.max(2, img.width/300)
//       ctx.font = `${Math.max(12, img.width/60)}px Arial`
//       detections.forEach(d=>{
//         const [x1,y1,x2,y2] = d.bbox_xyxy || d.bbox || [0,0,0,0]
//         const w = x2 - x1
//         const h = y2 - y1
//         ctx.strokeStyle = '#7ee787'
//         ctx.strokeRect(x1,y1,w,h)
//         const label = `${d.class_name} ${Math.round(d.confidence*100)}%`
//         const textW = ctx.measureText(label).width
//         ctx.fillStyle = '#0b0d10'
//         ctx.fillRect(x1, y1 - 24, textW + 8, 24)
//         ctx.fillStyle = '#7ee787'
//         ctx.fillText(label, x1 + 4, y1 - 6)
//       })
//     }
//     img.src = imageSrc
//   }

//   async function sendBlob(blob, filename='capture.jpg'){
//     setLoading(true)
//     setResult(null)
//     try{
//       const form = new FormData()
//       form.append('file', blob, filename)
//       // use absolute backend URL via API_BASE
//       const resp = await axios.post(`${API_BASE}/api/damage/analyze`, form, {
//         headers: {'Content-Type': 'multipart/form-data'},
//         timeout: 120000
//       })
//       setResult(resp.data)
//     }catch(err){
//       console.error(err)
//       // show a useful error
//       const msg = err?.response?.data?.detail || err?.message || 'Unknown error'
//       alert('Upload failed: ' + msg)
//     }finally{
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="page">
//       <div className="topbar">
//         <button className="back" onClick={onBack}>◀ Back</button>
//         <div className="brand small">DeepDetect</div>
//       </div>

//       <div className="grid">
//         <div className="card column">
//           <h3>Input</h3>
//           <UploadForm onImage={(dataUrl, blob)=>{ setImageSrc(dataUrl); sendBlob(blob) }} />
//           <div style={{height:12}} />
//           <CameraCapture onCapture={(dataUrl, blob)=>{ setImageSrc(dataUrl); sendBlob(blob) }} />
//           <div style={{height:12}} />
//           <p className="muted">Tip: Use snapshot for stable inference. For continuous mode see README for streaming approach.</p>
//         </div>

//         <div className="card column">
//           <h3>Results</h3>
//           {loading && <div className="muted">Running inference...</div>}
//           {!imageSrc && <div className="muted">No image yet</div>}
//           {imageSrc && <canvas ref={canvasRef} style={{width:'100%',borderRadius:8,background:'#000'}} />}
//           {result && (
//             <div className="result-box">
//               <div><strong>ID:</strong> {result.id}</div>
//               <div><strong>Filename:</strong> {result.filename}</div>
//               <div style={{height:6}} />
//               <details>
//                 <summary>Detections ({result.detections.length})</summary>
//                 <pre className="muted" style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(result.detections, null, 2)}</pre>
//               </details>
//               <div style={{height:8}} />
//               <a className="btn" href={`${API_BASE}/api/damage/${result.id}`} target="_blank" rel="noreferrer">View JSON</a>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// src/components/Detector.jsx
import React, {useState, useRef, useEffect} from 'react'
import CameraCapture from './CameraCapture'
import UploadForm from './UploadForm'
import axios from 'axios'

export default function Detector({onBack}){
  const [imageSrc, setImageSrc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [fullscreen, setFullscreen] = useState(false)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

  useEffect(()=>{
    if(result && imageSrc){
      drawDetections(result.detections)
    }
  },[result,imageSrc])

  function drawDetections(detections){
    const canvas = canvasRef.current
    const container = containerRef.current
    if(!canvas || !container) return
    
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = ()=>{
      // Set canvas to actual image dimensions
      canvas.width = img.width
      canvas.height = img.height
      
      // Clear and draw image
      ctx.clearRect(0,0,canvas.width,canvas.height)
      ctx.drawImage(img,0,0)
      
      // Draw detections
      ctx.lineWidth = Math.max(3, img.width/200)
      ctx.font = `bold ${Math.max(14, img.width/50)}px Arial`
      
      detections.forEach(d=>{
        const [x1,y1,x2,y2] = d.bbox_xyxy || d.bbox || [0,0,0,0]
        const w = x2 - x1
        const h = y2 - y1
        
        // Draw bounding box with shadow
        ctx.strokeStyle = '#7ee787'
        ctx.shadowColor = 'rgba(126, 231, 135, 0.5)'
        ctx.shadowBlur = 10
        ctx.strokeRect(x1,y1,w,h)
        ctx.shadowBlur = 0
        
        // Draw label background
        const label = `${d.class_name} ${Math.round(d.confidence*100)}%`
        const textMetrics = ctx.measureText(label)
        const textW = textMetrics.width + 16
        const textH = 28
        
        ctx.fillStyle = 'rgba(11, 13, 16, 0.9)'
        ctx.fillRect(x1, y1 - textH - 4, textW, textH)
        
        // Draw label border
        ctx.strokeStyle = '#7ee787'
        ctx.lineWidth = 2
        ctx.strokeRect(x1, y1 - textH - 4, textW, textH)
        
        // Draw label text
        ctx.fillStyle = '#7ee787'
        ctx.fillText(label, x1 + 8, y1 - 10)
      })
    }
    img.src = imageSrc
  }

  async function sendBlob(blob, filename='capture.jpg'){
    setLoading(true)
    setResult(null)
    setError(null)
    
    try{
      const form = new FormData()
      form.append('file', blob, filename)
      
      const resp = await axios.post(`${API_BASE}/api/damage/analyze`, form, {
        headers: {'Content-Type': 'multipart/form-data'},
        timeout: 120000
      })
      setResult(resp.data)
    }catch(err){
      console.error(err)
      const msg = err?.response?.data?.detail || err?.message || 'Unknown error'
      setError(msg)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="topbar">
        <button className="back" onClick={onBack}>◀ Back</button>
        <div className="brand small">DeepDetect</div>
      </div>

      <div className="grid">
        {/* Input Column */}
        <div className="card column">
          <h3>Input</h3>
          <UploadForm onImage={(dataUrl, blob)=>{ 
            setImageSrc(dataUrl); 
            sendBlob(blob) 
          }} />
          
          <CameraCapture onCapture={(dataUrl, blob)=>{ 
            setImageSrc(dataUrl); 
            sendBlob(blob) 
          }} />
          
          <p className="muted" style={{marginTop: 8, fontSize: 13}}>
            💡 Tip: Use snapshot for stable inference. For continuous mode see README.
          </p>
        </div>

        {/* Results Column */}
        <div className="card column">
          <h3>Results</h3>
          
          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="muted">Analyzing image with YOLO...</div>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="error-message">
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}
          
          {/* No Image State */}
          {!imageSrc && !loading && (
            <div className="muted text-center" style={{padding: 40}}>
              📸 Upload an image or capture from camera to start detection
            </div>
          )}
          
          {/* Image Preview with Detections */}
          {imageSrc && (
            <>
              <div 
                ref={containerRef} 
                style={{
                  position: 'relative', 
                  width: '100%',
                  maxHeight: fullscreen ? 'none' : '60vh',
                  overflow: 'auto',
                  borderRadius: 12,
                  border: '2px solid #2b2e33',
                  background: '#000',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#7ee787 #0f1115'
                }}
              >
                <canvas 
                  ref={canvasRef} 
                  style={{
                    width:'100%',
                    height: 'auto',
                    display: 'block',
                    minHeight: '200px'
                  }} 
                />
              </div>
              
              {/* Zoom Controls */}
              <div className="button-group" style={{marginTop: 8}}>
                <button 
                  className="btn ghost" 
                  onClick={() => setFullscreen(!fullscreen)}
                  style={{fontSize: 12}}
                >
                  {fullscreen ? '🔽 Fit to Screen' : '🔍 Full Size'}
                </button>
                <button 
                  className="btn ghost"
                  onClick={() => {
                    if (!canvasRef.current) return
                    const link = document.createElement('a')
                    link.download = `detection-${result?.id || 'result'}.png`
                    link.href = canvasRef.current.toDataURL()
                    link.click()
                  }}
                  style={{fontSize: 12}}
                  disabled={!result}
                >
                  💾 Download
                </button>
              </div>
            </>
          )}
          
          {/* Detection Results Metadata */}
          {result && (
            <div className="result-box">
              <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
                <span className="badge">✓ Analysis Complete</span>
                <span className="muted" style={{fontSize: 12}}>
                  {result.detections.length} object{result.detections.length !== 1 ? 's' : ''} detected
                </span>
              </div>
              
              <div style={{marginBottom: 8}}>
                <strong>Run ID:</strong> 
                <code style={{
                  marginLeft: 8,
                  padding: '2px 6px',
                  background: '#000',
                  borderRadius: 4,
                  fontSize: 12,
                  color: '#7ee787'
                }}>
                  {result.id}
                </code>
              </div>
              
              <div style={{marginBottom: 12}}>
                <strong>Filename:</strong> 
                <span style={{marginLeft: 8, color: '#9aa5b1'}}>
                  {result.filename}
                </span>
              </div>
              
              {/* Detections List */}
              {result.detections.length > 0 && (
                <details open style={{marginTop: 12}}>
                  <summary style={{cursor: 'pointer', userSelect: 'none'}}>
                    📋 View Detection Details ({result.detections.length})
                  </summary>
                  <div style={{marginTop: 12}}>
                    {result.detections.map((det, idx) => (
                      <div 
                        key={idx}
                        style={{
                          background: '#000',
                          padding: 12,
                          borderRadius: 8,
                          marginBottom: 8,
                          border: '1px solid #2b2e33'
                        }}
                      >
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 6}}>
                          <strong style={{color: '#7ee787'}}>
                            {det.class_name}
                          </strong>
                          <span style={{
                            background: 'rgba(126, 231, 135, 0.15)',
                            color: '#7ee787',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600
                          }}>
                            {Math.round(det.confidence * 100)}%
                          </span>
                        </div>
                        <div className="muted" style={{fontSize: 12}}>
                          <div>Class ID: {det.class_id}</div>
                          <div>
                            BBox: [{det.bbox_xyxy?.map(v => Math.round(v)).join(', ')}]
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
              
              {/* Actions */}
              <div className="button-group" style={{marginTop: 16}}>
                <a 
                  className="btn" 
                  href={`${API_BASE}/api/damage/${result.id}`} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  📄 View Full JSON
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
