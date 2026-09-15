import api from './api'

const eventService = {
  getAll: () => api.get('/api/events').then((res) => res.data),
  getById: (id) => api.get(`/api/events/${id}`).then((res) => res.data),
  create: (payload) => api.post('/api/events', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/api/events/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/api/events/${id}`).then((res) => res.data),
}

export default eventService
