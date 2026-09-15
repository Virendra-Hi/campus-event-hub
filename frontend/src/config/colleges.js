// Campus Event Hub currently supports a single college. This file exists so
// that adding another college later (e.g. MLSU) means adding an entry here
// and wiring a selector — not rewriting the admin signup/login/dashboard UI.
// No multi-college switching is implemented yet; CURRENT_COLLEGE is the only
// one in use throughout the app.

export const COLLEGES = [
  {
    code: 'GITS',
    name: 'Geetanjali Institute of Technical Studies',
  },
  {
    code: 'MLSU',
    name: 'Mohanlal Sukhadia University',
  },
]

export const CURRENT_COLLEGE = COLLEGES.find(
  (college) => college.code === 'GITS'
)