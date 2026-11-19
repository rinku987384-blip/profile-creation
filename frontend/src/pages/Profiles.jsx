import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RouteLayout from '../components/RouteLayout.jsx'
import { getPublicProfiles } from '../services/api.js'

export default function Profiles() {
  const [filters, setFilters] = useState({ search: '', profession: '', location: '', page: '1' })
  const [result, setResult] = useState({ profiles: [], pagination: { page: 1, pages: 1, total: 0 } })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    getPublicProfiles(filters).then((data) => { if (active) setResult(data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [filters])

  function update(field, value) { setFilters((current) => ({ ...current, [field]: value, page: '1' })) }

  return <RouteLayout><section className="route-page profiles-page">
    <span className="eyebrow">THE COMMUNITY</span><h1>People doing good work.</h1><p>Only approved profiles are shown here.</p>
    <div className="directory-filters"><label>Search<input value={filters.search} onChange={(event) => update('search', event.target.value)} placeholder="Name, skills, or title" /></label><label>Profession<input value={filters.profession} onChange={(event) => update('profession', event.target.value)} placeholder="e.g. Designer" /></label><label>Location<input value={filters.location} onChange={(event) => update('location', event.target.value)} placeholder="City or country" /></label></div>
    {loading ? <p className="route-muted">Loading approved profiles...</p> : error ? <p className="route-error" role="alert">{error}</p> : result.profiles.length ? <div className="directory-grid">{result.profiles.map((profile) => <article className="directory-profile" key={profile._id}><img src={profile.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80'} alt="" /><div><h2>{profile.fullName}</h2><b>{profile.professionalTitle}</b><p>{profile.shortBio}</p><small>{profile.location}</small><div className="skill-chips">{profile.skills?.slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}</div></div><Link to={`/profile/${profile.username}`}>View profile →</Link></article>)}</div> : <div className="community-empty"><p>No public profiles yet.</p><Link to="/register">Create your profile →</Link></div>}
    {!loading && result.pagination.pages > 1 && <div className="pagination"><button disabled={Number(filters.page) <= 1} onClick={() => update('page', String(Number(filters.page) - 1))}>Previous</button><span>Page {result.pagination.page} of {result.pagination.pages}</span><button disabled={Number(filters.page) >= result.pagination.pages} onClick={() => update('page', String(Number(filters.page) + 1))}>Next</button></div>}
  </section></RouteLayout>
}
