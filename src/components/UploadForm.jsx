import React from 'react'

export default function UploadForm({ onImage }) {
  function handleFile(ev) {
    const f = ev.target.files[0]
    if (!f) return
    
    if (!f.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    if (f.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size is 10MB')
      return
    }
    
    const reader = new FileReader()
    reader.onload = () => {
      const blob = new Blob([f], { type: f.type })
      onImage(reader.result, blob)
    }
    reader.onerror = () => {
      alert('Error reading file')
    }
    reader.readAsDataURL(f)
  }

  return (
    <div>
      <label className="upload-label">
        📁 Choose Image
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFile}
        />
      </label>
      <div className="muted" style={{fontSize: 12, marginTop: 6}}>
        Supported: JPG, PNG, WEBP (max 10MB)
      </div>
    </div>
  )
}
