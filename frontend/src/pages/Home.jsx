import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RouteLayout from '../components/RouteLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getPublicProfiles } from '../services/api.js'

export default function Home() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [search, setSearch] = useState('')
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    let active = true
    getPublicProfiles()
      .then(({ profiles: results }) => { if (active) setProfiles(results) })
      .catch(() => { if (active) setUnavailable(true) })
    return () => { active = false }
  }, [])

  const filteredProfiles = profiles.filter((profile) => {
    const content = `${profile.fullName} ${profile.professionalTitle} ${profile.location} ${profile.skills?.join(' ')}`.toLowerCase()
    return content.includes(search.toLowerCase())
  })

  return <RouteLayout>
    <section className="landing-hero">
      <div className="landing-copy">
        <span className="eyebrow">YOUR WORK, IN ONE PLACE</span>
        <h1>A clear introduction to your work and story.</h1>
        <p>Bring your experience, skills, and next big idea together in a profile that is easy to share.</p>
        <div className="landing-actions">
          <Link className="primary-button" to={user ? '/profile/create' : '/register'}>{user ? 'Build your profile' : 'Create your profile'} <span aria-hidden="true">→</span></Link>
          <a className="outline-button" href="#community">Explore profiles</a>
        </div>
        <div className="landing-proof"><span>01</span> A thoughtful home for your professional story</div>
      </div>
      <div className="landing-photo">
        <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1000&q=85" alt="Creative professionals working together around a table" />
        <div className="photo-caption"><span>MAKE YOUR WORK VISIBLE</span><b>One link. Your whole story.</b></div>
      </div>
    </section>
    <section className="feature-story">
      <div><span className="eyebrow">MAKE YOUR WORK VISIBLE</span><h2>One link. Your whole story.</h2></div>
      <p>Bring your experience, skills, projects, education, and social links into one professional profile that is easy to share.</p>
      <Link className="feature-link" to={user ? '/profile/create' : '/register'}>Create your profile <span aria-hidden="true">→</span></Link>
    </section>
    <section className="landing-community" id="community">
      <div className="community-heading">
        <div><span className="eyebrow">THE COMMUNITY</span><h2>People doing good work.</h2><p>Discover public profiles and the work behind them.</p></div>
        <label className="community-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people or roles" aria-label="Search public profiles" /></label>
      </div>
      {unavailable ? <p className="community-empty">Profiles are temporarily unavailable. Try again shortly.</p> : filteredProfiles.length ? <div className="landing-profile-grid">
        {filteredProfiles.slice(0, 6).map((profile) => <article className="landing-profile" key={profile._id || profile.username}>
          <img src={profile.profilePhotoUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80'} alt="" />
          <div><h3>{profile.fullName}</h3><p>{profile.professionalTitle || 'Professional'}</p><span>{profile.location}</span></div>
          <Link to={`/profile/${encodeURIComponent(profile.username)}`} aria-label={`View ${profile.fullName}'s profile`}>↗</Link>
        </article>)}
      </div> : <div className="community-empty"><p>{search ? 'No profiles match that search yet.' : 'No public profiles yet.'}</p><Link to={user ? '/profile/create' : '/register'}>Create your profile →</Link></div>}
    </section>
  </RouteLayout>
}
