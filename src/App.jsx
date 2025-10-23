import React, { useState } from 'react'
import Landing from './components/Landing'
import Detector from './components/Detector'

export default function App() {
  const [page, setPage] = useState('landing')
  return (
    <div className="app-root">
      {page === 'landing' ? (
        <Landing onStart={() => setPage('detector')} />
      ) : (
        <Detector onBack={() => setPage('landing')} />
      )}
    </div>
  )
}

