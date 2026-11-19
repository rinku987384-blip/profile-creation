import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import RouteLayout from '../components/RouteLayout.jsx'
import { approveProfile, getAdminProfile, rejectProfile } from '../services/api.js'

export default function AdminProfileReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [reason, setReason] = useState('')
  const [rejecting, setRejecting] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    getAdminProfile(id).then(({ profile: data }) => { if (active) setProfile(data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
    return () => { active = false }
  }, [id])
  async function approve() { try { await approveProfile(id); navigate('/admin/profiles/approved') } catch (requestError) { setError(requestError.message) } }
  async function reject(event) {
    event.preventDefault()
    try { await rejectProfile(id, reason); navigate('/admin/profiles/rejected') } catch (requestError) { setError(requestError.message) }
  }
  return <RouteLayout><section className="route-page admin-review"><Link to="/admin/profiles/pending">← Pending profiles</Link>{error && <p className="route-error">{error}</p>}{!profile ? <p>Loading profile...</p> : <>
    <div className="review-heading"><img src={profile.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&q=80'} alt="" /><div><span className="eyebrow">PROFILE REVIEW · {profile.status}</span><h1>{profile.fullName}</h1><p>{profile.professionalTitle} · {profile.location}</p><small>{profile.userId?.email}</small></div></div>
    <h2>About</h2><p>{profile.shortBio}</p><p>{profile.about}</p>
    <h2>Experience</h2>{profile.experience?.map((item) => <article className="review-entry" key={item._id}><b>{item.jobTitle}</b><p>{item.company} · {item.location}</p><p>{item.description}</p></article>)}
    <h2>Education</h2>{profile.education?.map((item) => <article className="review-entry" key={item._id}><b>{item.degree} · {item.fieldOfStudy}</b><p>{item.institution} · {item.startYear}–{item.endYear}</p></article>)}
    <h2>Skills</h2><div className="skill-chips">{profile.skills?.map((skill) => <span key={skill}>{skill}</span>)}</div>
    <h2>Projects</h2>{profile.projects?.map((item) => <article className="review-entry" key={item._id}><b>{item.name}</b><p>{item.description}</p><a href={item.url} target="_blank" rel="noreferrer">{item.url}</a></article>)}
    <h2>Social links</h2><div className="social-links">{Object.entries(profile.socialLinks || {}).filter(([, url]) => url).map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name}</a>)}</div>
    {profile.status === 'pending' && <div className="review-actions"><button className="primary-button" onClick={approve}>Approve profile</button><button className="danger-button" onClick={() => setRejecting(true)}>Reject profile</button></div>}
  </>}
  {rejecting && <div className="modal-backdrop"><form className="reject-modal" onSubmit={reject}><h2>Reject profile</h2><label>Reason<textarea value={reason} onChange={(event) => setReason(event.target.value)} minLength="3" maxLength="2000" required rows="5" /></label><div><button type="button" onClick={() => setRejecting(false)}>Cancel</button><button className="danger-button">Reject profile</button></div></form></div>}
  </section></RouteLayout>
}
