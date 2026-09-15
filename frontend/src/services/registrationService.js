import api from './api'

const registrationService = {
  register: (eventId, payload) =>
    api.post(`/api/events/${eventId}/register`, payload).then((res) => res.data),

  getAll: () =>
    api.get('/api/events/registrations').then((res) => res.data),

  getForEvent: (eventId) =>
    api.get(`/api/events/${eventId}/registrations`).then((res) => res.data),

  getByEmail: (email) =>
    api.get(`/api/events/registrations/by-email?email=${encodeURIComponent(email)}`)
      .then((res) => res.data),

  cancel: (registrationId) =>
    api.delete(`/api/events/registration/student/${registrationId}`).then((res) => res.data),
}

export default registrationService