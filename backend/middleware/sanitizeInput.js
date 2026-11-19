function clean(value) {
  if (typeof value === 'string') return value.replace(/\u0000/g, '').replace(/<[^>]*>/g, '').trim()
  if (Array.isArray(value)) return value.map(clean)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clean(item)]))
  }
  return value
}

export default function sanitizeInput(req, _res, next) {
  req.body = clean(req.body)
  next()
}
