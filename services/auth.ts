import { useRouter } from 'next/navigation'
import api from './api'

export const auth = {
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_data')
    window.location.href = '/login'
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token')
  }
} 