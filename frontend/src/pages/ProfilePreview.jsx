import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RouteLayout from '../components/RouteLayout.jsx'
import { getMyProfile } from '../services/api.js'

export default function ProfilePreview() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    getMyProfile().then(({ profile: result }) => { if (active) setProfile(result) })
      .catch((requestError) => { if (active) setError(requestError.message) })
    return () => { active = false }
  }, [])
  return <RouteLayout><section className="route-page preview-page"><Link to="/dashboard">← Dashboard</Link>{error ? <p className="route-error">{error}</p> : !profile ? <><h1>No saved profile yet</h1><Link to="/profile/create">Create a profile</Link></> : <article className="profile-live-preview" style={{ '--profile-accent': profile.theme?.accentColor || '#60784d' }}><span className="eyebrow">PRIVATE PREVIEW · {profile.status}</span>{profile.profileImage && <img src={profile.profileImage} alt="" />}<h1>{profile.fullName}</h1><h2>{profile.professionalTitle}</h2><p>{profile.location}</p><p>{profile.shortBio}</p><section><h2>About</h2><p>{profile.about}</p></section><h2>Experience</h2>{profile.experience?.map((item) => <p key={item._id}>{item.jobTitle} · {item.company}</p>)}<h2>Education</h2>{profile.education?.map((item) => <p key={item._id}>{item.degree} · {item.institution}</p>)}<h2>Skills</h2><div className="skill-chips">{profile.skills?.map((skill) => <span key={skill}>{skill}</span>)}</div><Link className="primary-button" to="/profile/edit">Edit profile</Link></article>}</section></RouteLayout>
}
