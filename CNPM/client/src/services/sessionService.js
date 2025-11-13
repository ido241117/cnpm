import api from './api'

const sessionService = {
  // Get all sessions (with filters)
  getSessions: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key])
    })
    const response = await api.get(`/sessions?${params.toString()}`)
    return response
  },

  // Get single session
  getSession: async (id) => {
    const response = await api.get(`/sessions/${id}`)
    return response
  },

  // Create session (Tutor only)
  createSession: async (sessionData) => {
    const response = await api.post('/sessions', sessionData)
    return response
  },

  // Update session (Tutor only)
  updateSession: async (id, updates) => {
    const response = await api.patch(`/sessions/${id}`, updates)
    return response
  },

  // Delete/Cancel session (Tutor only)
  deleteSession: async (id) => {
    const response = await api.delete(`/sessions/${id}`)
    return response
  },

  // Register for session (Student)
  registerSession: async (id) => {
    const response = await api.post(`/sessions/${id}/register`)
    return response
  },

  // Unregister from session (Student)
  unregisterSession: async (id) => {
    const response = await api.delete(`/sessions/${id}/register`)
    return response
  },

  // Get registrations for a session (Tutor)
  getSessionRegistrations: async (id) => {
    const response = await api.get(`/sessions/${id}/registrations`)
    return response
  },

  // Get my registrations (Student)
  getMyRegistrations: async () => {
    const response = await api.get('/registrations/me')
    return response
  },

  // Cancel registration (Student)
  cancelRegistration: async (id) => {
    const response = await api.delete(`/sessions/${id}/register`)
    return response
  },

  // Submit feedback (Student)
  submitFeedback: async (sessionId, feedbackData) => {
    const response = await api.post(`/sessions/${sessionId}/feedback`, feedbackData)
    return response
  },

  // Get my feedback for a session (Student)
  getMyFeedback: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}/feedback/me`)
    return response
  },

  // Delete my feedback for a session (Student)
  deleteFeedback: async (sessionId) => {
    const response = await api.delete(`/sessions/${sessionId}/feedback/me`)
    return response
  }
}

export default sessionService


