import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Test connection to backend
    fetch('https://a5dd5fb1-2d3d-424f-9a17-da1e1e2c8d6a-00-18dij7r2am0qw.worf.replit.dev/api/health')
      .then(res => res.json())
      .then(data => {
        setBackendStatus(`✅ Backend Connected: ${data.status}`)
        setLoading(false)
      })
      .catch(err => {
        setBackendStatus(`❌ Error: ${err.message}`)
        setLoading(false)
      })
  }, [])

  return (
    <div className="App">
      <h1>🍽️ Restaurant Discovery App</h1>
      
      <div className="status-box">
        {loading ? (
          <p>Checking backend...</p>
        ) : (
          <p>{backendStatus}</p>
        )}
      </div>

      <div className="info">
        <h2>MVP Features Coming:</h2>
        <ul>
          <li>🍴 Find nearby restaurants</li>
          <li>⭐ View ratings & reviews</li>
          <li>💾 Save favorites</li>
          <li>🤖 AI recipe suggestions</li>
        </ul>
      </div>
    </div>
  )
}

export default App