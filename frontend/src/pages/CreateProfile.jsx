import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RouteLayout from '../components/RouteLayout.jsx'
import { createProfile, getMyProfile, submitProfile, updateProfile, uploadProfileImage } from '../services/api.js'

const steps = ['Basic information', 'About', 'Experience', 'Education', 'Skills', 'Projects', 'Social links', 'Customize', 'Preview']
const blankProfile = {
  username: '', profileImage: '', fullName: '', professionalTitle: '', location: '', shortBio: '', about: '',
  experience: [], education: [], skills: [], projects: [],
  socialLinks: { website: '', linkedin: '', github: '', instagram: '', facebook: '', twitter: '' },
  theme: { profileTheme: 'light', accentColor: '#60784d', layout: 'classic' },
}
const blankExperience = { jobTitle: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }
const blankEducation = { institution: '', degree: '', fieldOfStudy: '', startYear: null, endYear: null, description: '' }
const blankProject = { name: '', description: '', image: '', url: '', technologies: [] }

export default function CreateProfile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(blankProfile)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getMyProfile().then(({ profile: saved }) => { if (active && saved) setProfile({ ...blankProfile, ...saved, socialLinks: { ...blankProfile.socialLinks, ...saved.socialLinks }, theme: { ...blankProfile.theme, ...saved.theme } }) })
      .catch((requestError) => { if (active && requestError.message !== 'Request failed.') setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  function change(field, value) { setProfile((current) => ({ ...current, [field]: value })); setNotice('') }
  function changeNested(group, field, value) { setProfile((current) => ({ ...current, [group]: { ...current[group], [field]: value } })) }
  function changeRow(group, index, field, value) {
    setProfile((current) => ({ ...current, [group]: current[group].map((row, rowIndex) => rowIndex === index ? { ...row, [field]: value } : row) }))
  }
  function addRow(group, row) { setProfile((current) => ({ ...current, [group]: [...current[group], { ...row }] })) }
  function removeRow(group, index) { setProfile((current) => ({ ...current, [group]: current[group].filter((_, rowIndex) => rowIndex !== index) })) }

  async function uploadPhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setBusy(true); setError('')
    try { const result = await uploadProfileImage(file); change('profileImage', result.imageUrl) }
    catch (requestError) { setError(requestError.message) }
    finally { setBusy(false) }
  }

  async function persist(submitForReview = false) {
    setBusy(true); setError(''); setNotice('')
    try {
      const result = profile._id ? await updateProfile(profile) : await createProfile(profile)
      setProfile(result.profile)
      if (submitForReview) {
        const submitted = await submitProfile()
        setProfile(submitted.profile)
        setNotice('Your profile has been submitted for review.')
        window.setTimeout(() => navigate('/dashboard'), 900)
      } else {
        setNotice('Draft saved. It is not publicly visible.')
      }
    } catch (requestError) { setError(requestError.message) }
    finally { setBusy(false) }
  }

  if (loading) return <RouteLayout><main className="route-page"><p>Loading your profile...</p></main></RouteLayout>
  const input = (label, field, props = {}) => <label>{label}<input value={profile[field] || ''} onChange={(event) => change(field, event.target.value)} {...props} /></label>
  const textarea = (label, field, props = {}) => <label>{label}<textarea value={profile[field] || ''} onChange={(event) => change(field, event.target.value)} {...props} /></label>
  const rowInput = (group, index, label, field, props = {}) => <label>{label}<input value={profile[group][index][field] ?? ''} onChange={(event) => changeRow(group, index, field, event.target.value)} {...props} /></label>

  return <RouteLayout><section className="route-page profile-builder">
    <Link to="/dashboard">← Dashboard</Link><span className="eyebrow">PROFILE BUILDER · {profile.status || 'DRAFT'}</span><h1>Create your professional profile</h1>
    <nav className="builder-steps" aria-label="Profile creation steps">{steps.map((label, index) => <button type="button" className={step === index ? 'selected' : ''} key={label} onClick={() => setStep(index)}><span>{index + 1}</span>{label}</button>)}</nav>
    <div className="builder-content-panel">
      {step === 0 && <><h2>Basic information</h2><label>Profile photo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadPhoto} />{profile.profileImage && <img className="builder-photo" src={profile.profileImage} alt="Profile preview" />}</label>{input('Full name', 'fullName', { required: true })}<div className="route-fields">{input('Username', 'username', { pattern: '[A-Za-z0-9_-]{3,30}', required: true })}{input('Professional title', 'professionalTitle', { placeholder: 'e.g. Product Designer' })}</div>{input('Location', 'location', { placeholder: 'City, country' })}</>}
      {step === 1 && <><h2>About</h2>{input('Short bio', 'shortBio', { maxLength: 280, placeholder: 'A concise introduction' })}{textarea('About me', 'about', { rows: 7 })}</>}
      {step === 2 && <><h2>Experience</h2>{profile.experience.map((item, index) => <fieldset className="builder-entry" key={item._id || index}><legend>Experience {index + 1}</legend>{rowInput('experience', index, 'Job title', 'jobTitle')}{rowInput('experience', index, 'Company', 'company')}{rowInput('experience', index, 'Location', 'location')}<div className="route-fields">{rowInput('experience', index, 'Start date', 'startDate', { type: 'month' })}{!item.current && rowInput('experience', index, 'End date', 'endDate', { type: 'month' })}</div><label className="inline-check"><input type="checkbox" checked={item.current} onChange={(event) => changeRow('experience', index, 'current', event.target.checked)} />Currently working here</label>{rowInput('experience', index, 'Description', 'description', { as: 'textarea' })}<button type="button" className="text-button" onClick={() => removeRow('experience', index)}>Remove experience</button></fieldset>)}<button type="button" className="outline-button" onClick={() => addRow('experience', blankExperience)}>+ Add experience</button></>}
      {step === 3 && <><h2>Education</h2>{profile.education.map((item, index) => <fieldset className="builder-entry" key={item._id || index}><legend>Education {index + 1}</legend>{rowInput('education', index, 'Institution', 'institution')}{rowInput('education', index, 'Degree', 'degree')}{rowInput('education', index, 'Field of study', 'fieldOfStudy')}<div className="route-fields">{rowInput('education', index, 'Start year', 'startYear', { type: 'number', onChange: (event) => changeRow('education', index, 'startYear', event.target.value ? Number(event.target.value) : null) })}{rowInput('education', index, 'End year', 'endYear', { type: 'number', onChange: (event) => changeRow('education', index, 'endYear', event.target.value ? Number(event.target.value) : null) })}</div>{rowInput('education', index, 'Description', 'description')}<button type="button" className="text-button" onClick={() => removeRow('education', index)}>Remove education</button></fieldset>)}<button type="button" className="outline-button" onClick={() => addRow('education', blankEducation)}>+ Add education</button></>}
      {step === 4 && <><h2>Skills</h2><div className="skill-editor">{profile.skills.map((skill, index) => <span key={`${skill}-${index}`}>{skill}<button type="button" aria-label={`Remove ${skill}`} onClick={() => removeRow('skills', index)}>×</button></span>)}</div><SkillInput onAdd={(skill) => setProfile((current) => ({ ...current, skills: [...current.skills, skill] }))} /></>}
      {step === 5 && <><h2>Projects</h2>{profile.projects.map((item, index) => <fieldset className="builder-entry" key={item._id || index}><legend>Project {index + 1}</legend>{rowInput('projects', index, 'Project name', 'name')}{rowInput('projects', index, 'Description', 'description')}{rowInput('projects', index, 'Project image URL', 'image', { type: 'url' })}{rowInput('projects', index, 'Project URL', 'url', { type: 'url' })}<label>Technologies<input value={item.technologies.join(', ')} onChange={(event) => changeRow('projects', index, 'technologies', event.target.value.split(',').map((value) => value.trim()).filter(Boolean))} placeholder="React, Node.js" /></label><button type="button" className="text-button" onClick={() => removeRow('projects', index)}>Remove project</button></fieldset>)}<button type="button" className="outline-button" onClick={() => addRow('projects', blankProject)}>+ Add project</button></>}
      {step === 6 && <><h2>Social links</h2>{Object.entries(profile.socialLinks).map(([key, value]) => <label key={key}>{key[0].toUpperCase() + key.slice(1)}<input type="url" value={value} onChange={(event) => changeNested('socialLinks', key, event.target.value)} placeholder="https://" /></label>)}</>}
      {step === 7 && <><h2>Profile customization</h2><label>Theme<select value={profile.theme.profileTheme} onChange={(event) => changeNested('theme', 'profileTheme', event.target.value)}><option value="light">Light</option><option value="dark">Dark</option><option value="editorial">Editorial</option></select></label><label>Accent color<input type="color" value={profile.theme.accentColor} onChange={(event) => changeNested('theme', 'accentColor', event.target.value)} /></label><label>Layout<select value={profile.theme.layout} onChange={(event) => changeNested('theme', 'layout', event.target.value)}><option value="classic">Classic</option><option value="minimal">Minimal</option><option value="split">Split</option></select></label></>}
      {step === 8 && <div className="profile-live-preview" style={{ '--profile-accent': profile.theme.accentColor }}><span className="eyebrow">PREVIEW · NOT PUBLIC</span>{profile.profileImage && <img src={profile.profileImage} alt="" />}<h2>{profile.fullName || 'Your name'}</h2><b>{profile.professionalTitle || 'Professional title'}</b><p>{profile.location}</p><p>{profile.shortBio}</p><p>{profile.about}</p><h3>Experience</h3>{profile.experience.map((entry, index) => <p key={entry._id || index}>{entry.jobTitle} · {entry.company}</p>)}<h3>Skills</h3><div className="skill-chips">{profile.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>}
      {error && <p className="route-error" role="alert">{error}</p>}{notice && <p className="route-success" role="status">{notice}</p>}
      <div className="builder-actions"><button type="button" className="outline-button" disabled={step === 0 || busy} onClick={() => setStep((current) => current - 1)}>Previous</button><button type="button" className="outline-button" disabled={busy} onClick={() => persist(false)}>{busy ? 'Saving...' : 'Save draft'}</button>{step < steps.length - 1 ? <button type="button" className="primary-button" onClick={() => setStep((current) => current + 1)}>Continue</button> : <button type="button" className="primary-button" disabled={busy} onClick={() => persist(true)}>Submit for review</button>}</div>
    </div>
  </section></RouteLayout>
}

function SkillInput({ onAdd }) {
  const [value, setValue] = useState('')
  function add(event) { event.preventDefault(); const next = value.trim(); if (next) { onAdd(next); setValue('') } }
  return <form className="skill-add" onSubmit={add}><label>Add a skill<input value={value} onChange={(event) => setValue(event.target.value)} placeholder="e.g. React" /></label><button className="outline-button">Add skill</button></form>
}
