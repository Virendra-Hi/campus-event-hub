import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campus_event_hub_admin_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Normalizes backend errors into a single friendly message string
// so components never have to inspect raw exception names or status codes.
export function getFriendlyErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error?.response) {
    return 'Cannot reach the server. Check your connection and try again.'
  }

  const data = error.response.data
  const raw = (data?.message || data?.error || '').toString()
  const status = error.response.status

  const knownPatterns = [
    { test: /already.*registered|RegistrationAlreadyExists/i, message: 'This student is already registered for this event.' },
    { test: /no.*seats|NoSeatsAvailable/i, message: 'Sorry, this event is fully booked.' },
    { test: /event.*not.*found|EventNotFound/i, message: "We couldn't find that event. It may have been removed." },
    { test: /registration.*not.*found|RegistrationNotFound/i, message: "We couldn't find that registration. It may already be cancelled." },
    { test: /invalid.*seat|InvalidSeatCount/i, message: 'Total seats cannot be less than the number of students already registered.' },
  ]

  for (const pattern of knownPatterns) {
    if (pattern.test.test(raw)) return pattern.message
  }

  if (status === 400 && data?.errors && typeof data.errors === 'object') {
    const firstField = Object.values(data.errors)[0]
    if (firstField) return String(firstField)
  }

  if (status === 400) return raw || 'Please check the form and try again.'
  if (status === 404) return raw || 'The item you were looking for could not be found.'
  if (status >= 500) return 'Something went wrong on our end. Please try again shortly.'

  return raw || fallback
}

export default api
