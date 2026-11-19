import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RouteLayout from '../components/RouteLayout.jsx'
import { getAdminProfiles } from '../services/api.js'

export default function AdminProfiles() {
  const { status } = useParams()
  const [profiles, setProfiles] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    getAdminProfiles(status).then(({ profiles: data }) => { if (active) setProfiles(data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [status])
  return <RouteLayout><section className="route-page admin-page"><span className="eyebrow">PROFILE MODERATION</span><h1>{status} profiles</h1>{error && <p className="route-error">{error}</p>}{loading ? <p>Loading profiles...</p> : profiles.length ? <div className="admin-profile-list">{profiles.map((profile) => <article key={profile._id}><img src={profile.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80'} alt="" /><div><h2>{profile.fullName}</h2><p>{profile.professionalTitle} · {profile.location}</p><small>Submitted {profile.submittedAt ? new Date(profile.submittedAt).toLocaleDateString() : 'not submitted'}</small></div><Link to={`/admin/profiles/review/${profile._id}`}>Review →</Link></article>)}</div> : <div className="community-empty"><p>No {status} profiles.</p></div>}</section></RouteLayout>
}
