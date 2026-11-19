import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RouteLayout from '../components/RouteLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyProfile } from '../services/api.js'

const statusCopy = {
  draft: ['Draft', 'Your profile is a draft and is not publicly visible.'],
  pending: ['Pending Review', 'Your profile has been submitted and is waiting for admin approval.'],
  approved: ['Approved', 'Your profile is live.'],
  rejected: ['Rejected', 'Your profile needs changes before it can be submitted again.'],
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    getMyProfile().then(({ profile: result }) => { if (active) setProfile(result) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const status = profile?.status || 'draft'
  const [label, description] = statusCopy[status]
  const editorPath = profile ? '/profile/edit' : '/profile/create'
  async function exit() { await logout(); window.location.assign('/') }

  return <RouteLayout><section className="dashboard-layout">
    <aside className="dashboard-sidebar"><Link className="dashboard-wordmark" to="/">Profile.</Link><span>WORKSPACE</span><Link to="/dashboard">Dashboard</Link><Link to="/dashboard">My Profile</Link><Link to={editorPath}>Edit Profile</Link><Link to="/preview">Preview</Link><Link to="/settings">Settings</Link>{user?.role === 'admin' && <Link to="/admin">Admin review</Link>}<button onClick={exit}>Logout</button></aside>
    <div className="dashboard-main"><span className="eyebrow">PROFILE DASHBOARD</span><h1>Welcome, {user?.name || 'there'}</h1><p>Manage your profile and track its review status.</p>
      {error && <p className="route-error" role="alert">{error}</p>}{loading ? <p>Loading profile...</p> : <article className={`status-card status-${status}`}><div><span className="eyebrow">PROFILE STATUS</span><h2>{label}</h2><p>{description}</p>{status === 'rejected' && profile?.rejectionReason && <div className="rejection-reason"><b>Admin feedback</b><p>{profile.rejectionReason}</p></div>}</div><div className="route-actions">{status === 'approved' && <Link className="primary-button" to={`/profile/${profile.username}`}>View public profile</Link>}{status === 'draft' && <Link className="primary-button" to={editorPath}>{profile ? 'Continue profile' : 'Create profile'}</Link>}{status === 'rejected' && <Link className="primary-button" to={editorPath}>Edit and resubmit</Link>}{status === 'pending' && <Link className="outline-button" to="/preview">Preview submission</Link>}</div></article>}
      {profile && <div className="dashboard-profile-summary"><img src={profile.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80'} alt=""/><div><h2>{profile.fullName}</h2><p>{profile.professionalTitle} · @{profile.username}</p><small>{profile.location}</small></div><Link to={editorPath}>Edit →</Link></div>}
    </div>
  </section></RouteLayout>
}
