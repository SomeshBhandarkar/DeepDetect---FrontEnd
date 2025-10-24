import React from 'react'

export default function Landing({ onStart }) {
  return (
    <div className="page center">
      <div className="card" style={{textAlign: 'center', maxWidth: 600}}>
        <h1 className="brand">DeepDetect</h1>
        <p className="muted" style={{fontSize: 16, lineHeight: 1.6, marginTop: 16}}>
          🚀 Advanced damage analysis & object detection powered by <strong style={{color: '#7ee787'}}>YOLOv8</strong>
        </p>
        <p className="muted" style={{fontSize: 14, marginTop: 12}}>
          Dark, mobile-friendly UI built for real-time inference
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginTop: 24,
          marginBottom: 24
        }}>
          <div style={{
            background: 'rgba(126, 231, 135, 0.05)',
            padding: 16,
            borderRadius: 12,
            border: '1px solid #2b2e33'
          }}>
            <div style={{fontSize: 24, marginBottom: 8}}>⚡</div>
            <div style={{fontSize: 13, color: '#9aa5b1'}}>Fast Detection</div>
          </div>
          <div style={{
            background: 'rgba(126, 231, 135, 0.05)',
            padding: 16,
            borderRadius: 12,
            border: '1px solid #2b2e33'
          }}>
            <div style={{fontSize: 24, marginBottom: 8}}>🎯</div>
            <div style={{fontSize: 13, color: '#9aa5b1'}}>High Accuracy</div>
          </div>
          <div style={{
            background: 'rgba(126, 231, 135, 0.05)',
            padding: 16,
            borderRadius: 12,
            border: '1px solid #2b2e33'
          }}>
            <div style={{fontSize: 24, marginBottom: 8}}>📱</div>
            <div style={{fontSize: 13, color: '#9aa5b1'}}>Mobile Ready</div>
          </div>
        </div>
        
        <button className="cta" onClick={onStart}>
          Let's Go →
        </button>
      </div>
      
      <footer className="footer muted" style={{marginTop: 32}}>
        © 2024 DeepDetect • Built with React + FastAPI
      </footer>
    </div>
  )
}
