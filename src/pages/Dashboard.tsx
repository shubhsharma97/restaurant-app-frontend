import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

/**
 * Define the User interface
 * Matches what backend returns from /api/auth/me
 */
interface User {
  user_id: string
  email: string
  full_name: string
  phone?: string | null  // Optional because some users might not have it
  created_at: string
  is_active: boolean
}

export default function Dashboard() {
  // Properly type the state: User | null
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  
  const API_URL = 'https://a5dd5fb1-2d3d-424f-9a17-da1e1e2c8d6a-00-18dij7r2am0qw.worf.replit.dev'
  
  useEffect(() => {
    fetchUserData()
  }, [])
  
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        navigate('/login')
        return
      }
      
      // Send request with token in Authorization header
      const response = await axios.get(
        `${API_URL}/api/auth/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      // TypeScript now knows response.data is a User
      setUser(response.data as User)
    } catch (err) {
      console.error('Failed to fetch user:', err)
      
      // Set error message
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to fetch user')
      } else {
        setError('An error occurred')
      }
      
      // Token expired or invalid → redirect to login
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    navigate('/login')
  }
  
  if (loading) {
    return (
      <div className="dashboard-container">
        <p>Loading...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error-message">Error: {error}</p>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="dashboard-container">
        <p>No user data found</p>
      </div>
    )
  }
  
  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.full_name}! 👋</h1>
      
      <div className="user-info">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone || 'Not provided'}
        </p>
        <p>
          <strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}
        </p>
        <p>
          <strong>Account Status:</strong> {user.is_active ? '✅ Active' : '❌ Inactive'}
        </p>
      </div>
      
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  )
}