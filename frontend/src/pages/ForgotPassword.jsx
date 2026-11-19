import { useState } from 'react'
import { Link } from 'react-router-dom'
import RouteLayout from '../components/RouteLayout.jsx'
import { requestPasswordReset } from '../services/api.js'

export default function ForgotPassword() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  async function submit(event) {
    event.preventDefault()
    setError('')
    try {
      const result = await requestPasswordReset(event.currentTarget.email.value)
      setMessage(result.message)
    } catch (requestError) { setError(requestError.message) }
  }
  return <RouteLayout><section className="route-page route-auth"><span className="eyebrow">ACCOUNT RECOVERY</span><h1>Reset your password</h1><p>Enter your account email to request a secure reset link.</p><form onSubmit={submit}><label>Email<input name="email" type="email" autoComplete="email" required /></label>{error && <p className="route-error" role="alert">{error}</p>}{message && <p className="route-success" role="status">{message}</p>}<button className="primary-button">Send reset instructions</button></form><p><Link to="/login">Back to login</Link></p></section></RouteLayout>
}
