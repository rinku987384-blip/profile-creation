import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RouteLayout from '../components/RouteLayout.jsx'
import { getAdminStats } from '../services/api.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    getAdminStats().then((data) => { if (active) setStats(data) }).catch((requestError) => { if (active) setError(requestError.message) })
    return () => { active = false }
  }, [])
  const cards = [
    ['Pending Profiles', stats?.pendingProfiles, '/admin/profiles/pending'],
    ['Approved Profiles', stats?.approvedProfiles, '/admin/profiles/approved'],
    ['Rejected Profiles', stats?.rejectedProfiles, '/admin/profiles/rejected'],
    ['Total Users', stats?.totalUsers, '/admin/users'],
  ]
  return <RouteLayout><section className="route-page admin-page"><span className="eyebrow">ADMINISTRATION</span><h1>Review workspace</h1><p>Every submitted profile stays private until you approve it.</p>{error && <p className="route-error">{error}</p>}<div className="admin-stats">{cards.map(([label, value, href]) => <Link className="admin-stat" to={href} key={label}><span>{label}</span><strong>{value ?? '—'}</strong><b>Open →</b></Link>)}</div><nav className="admin-nav"><Link to="/admin/profiles/pending">Pending profiles</Link><Link to="/admin/profiles/approved">Approved profiles</Link><Link to="/admin/profiles/rejected">Rejected profiles</Link><Link to="/admin/users">All users</Link></nav></section></RouteLayout>
}
