import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RouteLayout from '../components/RouteLayout.jsx'
import { getPublicProfile } from '../services/api.js'

export default function PublicProfile({ username: requestedUsername }) {
  const { username: routeUsername } = useParams()
  const username = requestedUsername || routeUsername
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    let active = true
    getPublicProfile(username).then(({ profile: result }) => { if (active) setProfile(result) })
      .catch((requestError) => { if (active) setError(requestError.message) })
    return () => { active = false }
  }, [username])
  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  async function share() {
    if (navigator.share) await navigator.share({ title: `${profile.fullName} | Profile.`, url: window.location.href })
    else await copyLink()
  }
  return <RouteLayout><article className={`public-profile public-${profile?.theme?.profileTheme || 'light'}`} style={{ '--profile-accent': profile?.theme?.accentColor || '#60784d' }}>
    {error ? <div className="route-page"><h1>Profile not available</h1><p>{error}</p><Link to="/profiles">Browse profiles</Link></div> : !profile ? <div className="route-page"><p>Loading profile...</p></div> : <>
      <header className="public-profile-heading">{profile.profileImage && <img src={profile.profileImage} alt={profile.fullName} />}<span className="eyebrow">PROFILE · @{profile.username}</span><h1>{profile.fullName}</h1><h2>{profile.professionalTitle}</h2><p>{profile.location}</p><p>{profile.shortBio}</p><div className="route-actions"><button className="outline-button" onClick={share}>Share profile</button><button className="outline-button" onClick={copyLink}>{copied ? 'Link copied' : 'Copy profile link'}</button>{profile.socialLinks?.website && <a className="primary-button" href={profile.socialLinks.website} target="_blank" rel="noreferrer">Website</a>}</div></header>
      {profile.about && <section><h2>About</h2><p>{profile.about}</p></section>}
      {profile.experience?.length > 0 && <section><h2>Experience</h2>{profile.experience.map((item) => <article className="public-entry" key={item._id}><h3>{item.jobTitle}</h3><p>{item.company} · {item.location}</p><small>{item.startDate} – {item.current ? 'Present' : item.endDate}</small><p>{item.description}</p></article>)}</section>}
      {profile.education?.length > 0 && <section><h2>Education</h2>{profile.education.map((item) => <article className="public-entry" key={item._id}><h3>{item.degree}{item.fieldOfStudy ? `, ${item.fieldOfStudy}` : ''}</h3><p>{item.institution}</p><small>{item.startYear} – {item.endYear}</small><p>{item.description}</p></article>)}</section>}
      {profile.skills?.length > 0 && <section><h2>Skills</h2><div className="skill-chips">{profile.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section>}
      {profile.projects?.length > 0 && <section><h2>Projects</h2><div className="public-projects">{profile.projects.map((project) => <article className="public-entry" key={project._id}>{project.image && <img src={project.image} alt="" />}<h3>{project.name}</h3><p>{project.description}</p>{project.url && <a href={project.url} target="_blank" rel="noreferrer">View project →</a>}<div className="skill-chips">{project.technologies?.map((technology) => <span key={technology}>{technology}</span>)}</div></article>)}</div></section>}
      <section><h2>Connect</h2><div className="social-links">{Object.entries(profile.socialLinks || {}).filter(([, url]) => url).map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name}</a>)}</div></section>
    </>}
  </article></RouteLayout>
}
