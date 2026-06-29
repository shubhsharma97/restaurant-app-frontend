import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/Auth.css'

export default function Register() {
  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    phone: ''
  })
  
  // Loading state (show spinner while registering)
  const [loading, setLoading] = useState(false)
  
  // Error messages
  const [error, setError] = useState('')
  
  // Success message
  const [success, setSuccess] = useState('')
  
  // Navigate to other pages
  const navigate = useNavigate()
  
  // Backend URL (change if needed)
  const API_URL = 'https://a5dd5fb1-2d3d-424f-9a17-da1e1e2c8d6a-00-18dij7r2am0qw.worf.replit.dev'
  
  /**
   * Handle form input changes
   * Updates state whenever user types
   */
  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  /**
   * Handle form submission
   * Sends data to backend
   */
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    // Clear previous messages
    setError('')
    setSuccess('')
    
    // Validation
    if (!formData.email || !formData.full_name || !formData.password) {
      setError('Please fill all required fields')
      return
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    
    setLoading(true)
    
    try {
      // Send registration request to backend
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          email: formData.email,
          full_name: formData.full_name,
          password: formData.password,
          phone: formData.phone || null
        }
      )
      
      // Success! Backend returned user data + token
      const { user, token } = response.data
      
      // Store token in browser (localStorage)
      // Later, we'll send this token with every request
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      setSuccess('Registration successful! Redirecting...')
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
      
    } catch (err: any) {
      // Backend returned error
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="subtitle">Join our restaurant community</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="full_name">Full Name *</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email *</label>
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
          
          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password * (min 8 characters)</label>
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
          
          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone (Optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1-555-0123"
            />
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        {/* Link to Login */}
        <p className="auth-link">
          Already have account? 
          <a href="/login"> Login here</a>
        </p>
      </div>
    </div>
  )
}