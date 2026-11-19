import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RouteLayout from '../components/RouteLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(event.currentTarget.email.value, event.currentTarget.password.value, event.currentTarget.remember.checked)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return <RouteLayout><section className="route-page route-auth">
    <span className="eyebrow">YOUR PROFILE, READY WHEN YOU ARE</span>
    <h1>Welcome back</h1>
    <p>Sign in to manage your public profile.</p>
    <form onSubmit={submit}>
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
      <label className="inline-check"><input name="remember" type="checkbox" />Remember me</label>
      <Link to="/forgot-password">Forgot password?</Link>
      {error && <p className="route-error" role="alert">{error}</p>}
      <button className="primary-button" disabled={busy}>{busy ? 'Signing in...' : 'Log in'}</button>
    </form>
    <p>New here? <Link to="/register">Create an account</Link></p>
  </section></RouteLayout>
}
