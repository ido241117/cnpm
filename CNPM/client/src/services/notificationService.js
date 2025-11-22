import api from './api'

const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications')
    return response
  },
  markRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`)
    return response
  },
  markAllRead: async () => {
    const response = await api.patch('/notifications/read-all')
    return response
  }
}

export default notificationService
