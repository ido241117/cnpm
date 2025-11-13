import api from './api'

const userService = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/me')
    return response
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.patch('/users/me', userData)
    return response
  }
}

export default userService


