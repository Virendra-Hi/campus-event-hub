export function validateRegistration({ studentName, email, rollNumber }) {
  const errors = {}

  if (!studentName || !studentName.trim()) {
    errors.studentName = 'Enter your full name.'
  }

  if (!email || !email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!rollNumber || !rollNumber.trim()) {
    errors.rollNumber = 'Enter your roll number.'
  }

  return errors
}

export function validateEvent({ title, eventDate, venue, totalSeats }) {
  const errors = {}

  if (!title || !title.trim()) {
    errors.title = 'Give the event a title.'
  }

  if (!eventDate) {
    errors.eventDate = 'Pick a date for the event.'
  }

  if (!venue || !venue.trim()) {
    errors.venue = 'Enter a venue.'
  }

  const seats = Number(totalSeats)
  if (!totalSeats || Number.isNaN(seats) || seats < 1) {
    errors.totalSeats = 'Total seats must be at least 1.'
  }

  return errors
}
