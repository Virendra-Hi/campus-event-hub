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