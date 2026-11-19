const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function apiRequest(path, options = {}) {
  const isForm = options.body instanceof FormData
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.body && !isForm ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new Error('Cannot reach the API. Check that the backend and MongoDB are running.')
  }
  const payload = response.status === 204 ? null : await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload?.error || `Request failed (${response.status}).`)
  return payload
}

export const signIn = (email, password, rememberMe = false) => apiRequest('/auth/login', {
  method: 'POST', body: JSON.stringify({ email, password, rememberMe }),
})

export const signUp = (details) => apiRequest('/auth/register', {
  method: 'POST', body: JSON.stringify(details),
})

export const signOut = () => apiRequest('/auth/logout', { method: 'POST' })
export const getCurrentUser = () => apiRequest('/auth/me')
export const getMyProfile = () => apiRequest('/profiles/me')
export const createProfile = (profile) => apiRequest('/profiles', { method: 'POST', body: JSON.stringify(profile) })
export const updateProfile = (profile) => apiRequest('/profiles/me', { method: 'PUT', body: JSON.stringify(profile) })
export const submitProfile = () => apiRequest('/profiles/submit', { method: 'POST' })
export const uploadProfileImage = (image) => {
  const form = new FormData()
  form.append('image', image)
  return apiRequest('/profiles/upload', { method: 'POST', body: form })
}

export const getPublicProfiles = (filters = {}) => {
  const params = new URLSearchParams(typeof filters === 'string' ? { search: filters } : filters)
  return apiRequest(`/profiles${params.size ? `?${params}` : ''}`)
}
export const getPublicProfile = (username) => apiRequest(`/profiles/${encodeURIComponent(username)}`)
export const getAdminStats = () => apiRequest('/admin/dashboard')
export const getAdminProfiles = (status) => apiRequest(`/admin/profiles/${status}`)
export const getAdminProfile = (id) => apiRequest(`/admin/profiles/${id}`)
export const approveProfile = (id) => apiRequest(`/admin/profiles/${id}/approve`, { method: 'PUT' })
export const rejectProfile = (id, reason) => apiRequest(`/admin/profiles/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) })
export const getAdminUsers = () => apiRequest('/admin/users')
export const requestPasswordReset = (email) => apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
export const resetPassword = (token, password) => apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) })
