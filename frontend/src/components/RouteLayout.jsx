import { useAuth } from '../context/AuthContext.jsx'

export default function RouteLayout({ children }) {
  const { user, logout } = useAuth()
  return <main className="route-shell">
    <header className="route-header">
      <a className="route-brand" href="/">Profile</a>
      <nav aria-label="Account navigation">
        <a href="/">Home</a><a href="/#community">Profiles</a>
        {user ? <><a href="/dashboard">Dashboard</a><button type="button" onClick={logout}>Log out</button></> : <><a href="/login">Log in</a><a href="/register">Create account</a></>}
      </nav>
    </header>
    {children}
  </main>
}
