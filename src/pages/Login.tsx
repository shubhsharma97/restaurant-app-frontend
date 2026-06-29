import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/Auth.css'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  const API_URL = 'https://a5dd5fb1-2d3d-424f-9a17-da1e1e2c8d6a-00-18dij7r2am0qw.worf.replit.dev'
  
  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError('')
    
    if (!formData.email || !formData.password) {
      setError('Please enter email and password')
      return
    }
    
    setLoading(true)
    
    try {
      // Send login request
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password
        }
      )
      
      // Store token and user data
      const { user, token } = response.data
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Redirect to dashboard
      navigate('/dashboard')
      
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back!</h1>
        <p className="subtitle">Login to your account</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="auth-link">
          New to our community? 
          <a href="/register"> Create account</a>
        </p>
      </div>
    </div>
  )
}