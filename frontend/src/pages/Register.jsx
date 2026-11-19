import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RouteLayout from '../components/RouteLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    if (form.get('password') !== form.get('confirmPassword')) {
      setError('Passwords do not match.')
      setBusy(false)
      return
    }
    try {
      await register({
        email: form.get('email'), password: form.get('password'), fullName: form.get('fullName'),
      })
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return <RouteLayout><section className="route-page route-auth">
    <span className="eyebrow">START WITH A GOOD INTRODUCTION</span>
    <h1>Create your account</h1>
    <form onSubmit={submit}>
      <label>Full name<input name="fullName" autoComplete="name" minLength="2" required /></label>
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      <label>Password<input name="password" type="password" autoComplete="new-password" minLength="8" required /></label>
      <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength="8" required /></label>
      {error && <p className="route-error" role="alert">{error}</p>}
      <button className="primary-button" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
    </form>
    <p>Already registered? <Link to="/login">Log in</Link></p>
  </section></RouteLayout>
}
