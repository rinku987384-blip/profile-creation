import { useEffect, useState } from 'react'

const profiles = [
  { name: 'Priya Sharma', role: 'Frontend Developer', location: 'New Delhi, India', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { name: 'Aman Verma', role: 'UI/UX Designer', location: 'Bengaluru, India', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
  { name: 'Neha Singh', role: 'Full Stack Developer', location: 'Pune, India', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
  { name: 'Rohit Kumar', role: 'Digital Marketer', location: 'Delhi, India', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { name: 'Sneha Patel', role: 'Content Creator', location: 'Surat, India', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' },
  { name: 'Aditya Raj', role: 'Data Analyst', location: 'Hyderabad, India', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80' },
]
const defaultProfile = { name: 'Priya Sharma', handle: 'priyasharma', role: 'Frontend Developer', location: 'New Delhi, India', bio: 'I build thoughtful digital experiences and write about design, code, and the web.', email: 'priya@example.com', ownerEmail: '', website: 'https://priyasharma.dev', image: '', step: 1 }
function Logo() { return <span className="logo"><span className="logo-mark">✣</span> Profile</span> }
function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span> }
function websiteHref(value) { return value && /^https?:\/\//i.test(value) ? value : `https://${value}` }
function Header({ view, setView, authUser, onLogout }) {
  const submitView = view === 'submit'
  return <header className="topbar"><div className="topbar-inner"><button className="logo-button" onClick={() => setView('home')} aria-label="Go to home"><Logo /></button><nav className="main-nav" aria-label="Main navigation"><button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>Home</button><button className={view === 'profiles' ? 'active' : ''} onClick={() => setView('profiles')}>Profile List</button><button className={submitView ? 'active' : ''} onClick={() => setView('submit')}>Submit Profile</button></nav><div className="top-actions">{authUser ? <><span className="user-chip" title={authUser.email}><span className="user-avatar">{authUser.email.charAt(0).toUpperCase()}</span>{authUser.email}</span><button className="login-button" onClick={onLogout}>Log out</button></> : <button className="login-button" onClick={() => setView('auth')}>Log in</button>}</div></div></header>
}
function Home({ setView }) {
  const benefits = [
    ['01', 'A polished first impression', 'Bring your work, experience, and personality together in one place.'],
    ['02', 'Easy to make your own', 'Add the details that matter and shape a profile that feels like you.'],
    ['03', 'Simple to share', 'Give people one clear link to your professional story.'],
    ['04', 'Free to get started', 'Create and share your profile without a subscription.'],
  ]

  return <>
    <section className="home-hero">
      <div className="hero-copy">
        <span className="eyebrow"><span className="hero-eyebrow-dot" /> YOUR WORK, IN ONE PLACE</span>
        <h1>A profile that<br />opens <em>doors.</em></h1>
        <p>Show people what you do, what you care about, and where to find your work. Your next opportunity starts with a better introduction.</p>
        <div className="hero-actions">
          <button className="primary-button" onClick={() => setView('submit')}>Create Your Profile <Icon>→</Icon></button>
          <button className="outline-button" onClick={() => setView('profiles')}>View profiles</button>
        </div>
        <div className="hero-proof">
          <div className="proof-avatars" aria-hidden="true">{profiles.slice(0, 3).map((item) => <img key={item.name} src={item.image} alt="" />)}</div>
          <span>Made for people building what&apos;s next.</span>
        </div>
      </div>
      <div className="hero-art" aria-label="Example professional profile">
        <div className="hero-stage">
          <div className="hero-stage-head"><span>PROFILE PREVIEW</span><span className="stage-status"><i /> LIVE</span></div>
          <div className="profile-mockup">
            <div className="mockup-cover" />
            <div className="mockup-avatar"><img src={profiles[0].image} alt="Priya Sharma" /></div>
            <strong>Priya Sharma</strong>
            <small>Frontend Developer</small>
            <small>New Delhi, India</small>
            <div className="mock-socials"><b>in</b><b>◎</b><b>↗</b></div>
            <div className="mock-lines"><i /><i /><i /></div>
            <span className="mock-tag">AVAILABLE FOR WORK</span>
          </div>
          <div className="floating-badge"><b>01</b><span>YOUR STORY<br />YOUR WAY</span></div>
          <span className="floating-icon icon-one">✦</span>
          <span className="floating-icon icon-two">↗</span>
        </div>
      </div>
    </section>
    <section className="why-section">
      <div className="section-title"><span className="eyebrow blue">A BETTER WAY TO SHOW UP</span><h2>Your work deserves a good home.</h2><p>Everything you need to make your next introduction count.</p></div>
      <div className="benefit-grid">{benefits.map(([number, title, text]) => <article key={number}><span className="benefit-icon">{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
  </>
}
function Auth({ setView, onAuth }) {
  const [mode, setMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState('')
  function submit(event) { event.preventDefault(); if (!email.includes('@')) { setError('Please enter a valid Gmail or email ID.'); return }; if (password.length < 6) { setError('Password must be at least 6 characters.'); return }; if (mode === 'signup' && password !== repeatPassword) { setError('Passwords do not match.'); return }; const result = onAuth({ email, password, mode }); if (result !== true) { setError(typeof result === 'string' ? result : 'Account not found or password is incorrect.'); return }; setView('submit') }
  function googleRedirect() { window.location.assign('https://accounts.google.com/') }
  function switchMode() { setMode(mode === 'signup' ? 'login' : 'signup'); setPassword(''); setRepeatPassword(''); setError('') }
  return <section className="auth-page"><div className="auth-card"><button className="auth-back" onClick={() => setView('home')}>← Back home</button><div className="auth-heading"><span className="logo-mark">✣</span><h1>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1><p>{mode === 'signup' ? 'Sign up to submit and manage your profile.' : 'Log in to continue to your profile.'}</p></div><button className="gmail-button" type="button" onClick={googleRedirect}><b>G</b> Continue with Google</button><div className="auth-divider"><span>or use your email</span></div><form onSubmit={submit}><label>Email ID<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@gmail.com" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 6 characters" minLength="6" required /></label>{mode === 'signup' && <label>Repeat Password<input type="password" value={repeatPassword} onChange={(event) => setRepeatPassword(event.target.value)} placeholder="Repeat your password" minLength="6" required /></label>}{error && <p className="auth-error">{error}</p>}<button className="primary-button auth-submit" type="submit">{mode === 'signup' ? 'Create account' : 'Log in'} <Icon>→</Icon></button></form><p className="auth-switch">{mode === 'signup' ? 'Already have an account?' : 'New to Profile?'} <button onClick={switchMode}>{mode === 'signup' ? 'Log in' : 'Sign up'}</button></p></div></section>
}
function StepNav({ step, setStep }) { const steps = ['Basic Info', 'About You', 'Skills', 'Experience', 'Education', 'Social Links']; return <aside className="step-nav">{steps.map((label, index) => <button key={label} className={step === index + 1 ? 'selected' : step > index + 1 ? 'done' : ''} onClick={() => setStep(index + 1)}><span>{step > index + 1 ? '✓' : index + 1}</span>{label}</button>)}</aside> }
function PhotoUpload({ profile, setProfile }) { function upload(event) { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setProfile((old) => ({ ...old, image: reader.result })); reader.readAsDataURL(file) } return <label className="photo-upload"><div className="photo-preview">{profile.image ? <img src={profile.image} alt="Preview" /> : <span>●</span>}</div><div><strong>Profile Photo</strong><small>JPG, PNG (Max 2MB)</small></div><span className="upload-button">Upload Photo</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} /></label> }
function CreateProfile({ profile, setProfile, setView, saveProfile, isEditing }) {
  const [step, setStep] = useState(profile.step || 1)
  useEffect(() => setProfile((old) => ({ ...old, step })), [step, setProfile])
  function change(event) { setProfile((old) => ({ ...old, [event.target.name]: event.target.value })) }
  function submit(event) {
    event.preventDefault()
    if (step < 6) { setStep(step + 1); return }
    saveProfile(profile)
    setView('profiles')
  }
  return <section className="builder-page"><StepNav step={step} setStep={setStep} /><div className="builder-content"><div className="builder-head"><div><span className="eyebrow blue">{step === 1 ? 'BASIC INFORMATION' : 'YOUR PROFILE'}</span><h1>{step === 1 ? isEditing ? 'Edit Your Profile' : 'Create Your Profile' : 'Build Your Story'}</h1><p>Public on Home. Use the same Gmail to log in when you edit.</p></div><span className="step-count">Step {step} of 6</span></div><form className="builder-form" onSubmit={submit}><h2>{step === 1 ? 'Profile Photo' : step === 2 ? 'Tell us about yourself' : 'Add your details'}</h2>{step === 1 && <PhotoUpload profile={profile} setProfile={setProfile} />}<label>Full Name *<input name="name" value={profile.name} onChange={change} placeholder="Enter your full name" required /></label><div className="two-fields"><label>Username *<div className="url-input"><input name="handle" value={profile.handle} onChange={change} placeholder="your-username" required /><span>.profile.com</span></div></label><label>Professional Title *<input name="role" value={profile.role} onChange={change} placeholder="e.g. Web Developer, Designer, etc." required /></label></div><div className="two-fields"><label>Gmail for profile ownership *<input name="ownerEmail" type="email" value={profile.ownerEmail || ''} onChange={change} placeholder="you@gmail.com" readOnly={isEditing} required /></label><label>Location<input name="location" value={profile.location} onChange={change} placeholder="e.g. New Delhi, India" /></label></div><div className="two-fields"><label>Website<input name="website" type="url" value={profile.website} onChange={change} placeholder="https://yourwebsite.com" /></label></div>{step > 1 && <label>About You<textarea name="bio" value={profile.bio} onChange={change} placeholder="Tell people what makes you, you..." rows="5" /></label>}<div className="builder-footer"><button type="button" className="back-button" onClick={() => step > 1 ? setStep(step - 1) : setView('home')}>← Back</button><button className="primary-button" type="submit">{step === 6 ? 'Save Profile' : 'Next'} <Icon>→</Icon></button></div></form></div></section>
}
function InquiryForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [notice, setNotice] = useState('')
  function change(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })) }
  function submit(event) { event.preventDefault(); localStorage.setItem('profilehub-inquiry', JSON.stringify({ ...form, submittedAt: new Date().toISOString() })); setNotice('Your inquiry has been submitted successfully.') }
  return <section className="inquiry-page"><div className="inquiry-heading"><span className="eyebrow blue">CONTACT PROFILEHUB</span><h1>Send an Inquiry</h1><p>Have a question or need help with your profile? Send us a message.</p></div><form className="inquiry-form" onSubmit={submit}><div className="two-fields"><label>Your Name *<input name="name" value={form.name} onChange={change} placeholder="Enter your name" required /></label><label>Email Address *<input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" required /></label></div><div className="two-fields"><label>Phone Number<input name="phone" value={form.phone} onChange={change} placeholder="Optional" /></label><label>Subject *<input name="subject" value={form.subject} onChange={change} placeholder="How can we help?" required /></label></div><label>Your Message *<textarea name="message" value={form.message} onChange={change} placeholder="Write your inquiry here..." rows="7" required /></label><div className="inquiry-footer"><span className="inquiry-notice">{notice}</span><button className="primary-button" type="submit">Submit Inquiry <Icon>→</Icon></button></div></form></section>
}
function SubmitWorkspace({ profile, setProfile, setView, saveProfile, isEditing }) {
  return <CreateProfile profile={profile} setProfile={setProfile} setView={setView} saveProfile={saveProfile} isEditing={isEditing} />
}
function Explore({ setView, submittedProfiles }) { const allProfiles = [...submittedProfiles, ...profiles.filter((sample) => !submittedProfiles.some((saved) => saved.handle === sample.handle))]; return <section className="explore-page"><div className="explore-head"><div><span className="eyebrow blue">ALL SUBMITTED PROFILES</span><h1>Explore Profiles</h1><p>{allProfiles.length} profiles in the Profile community</p></div><button className="primary-button" onClick={() => setView('submit')}>Submit Profile <Icon>+</Icon></button></div><div className="search-row"><div className="search-box">⌕ <input placeholder="Search by name, skills, or location..." /></div><button className="filter-button">☷ Filters</button></div><div className="profile-grid">{allProfiles.map((item) => <article className="directory-card" key={`${item.handle || item.name}-${item.email || ''}`}><img src={item.image || profiles[0].image} alt={item.name} /><div className="verified">✓</div><h3>{item.name}</h3><strong>{item.role}</strong><p>⌖ {item.location}</p><button onClick={() => setView('profile')}>View Profile <Icon>→</Icon></button></article>)}</div><div className="templates"><div><h2>Choose Your Template</h2><p>Pick a design that matches your style</p></div><div className="template-row">{['Modern & Simple', 'Professional', 'Minimal', 'Creative'].map((name, i) => <button key={name} onClick={() => setView('submit')} className={i === 0 ? 'chosen' : ''}><div className={`template-thumb thumb-${i}`} /><b>Template {i + 1}</b><small>{name}</small></button>)}</div></div></section> }
function ProfileDashboard({ profile, setView }) { const current = { ...defaultProfile, ...profile }; return <section className="dashboard-page"><div className="cover"><div className="cover-dots">•••</div></div><div className="dashboard-card"><div className="dashboard-intro"><div className="dashboard-avatar"><img src={current.image || profiles[0].image} alt={current.name} /></div><div><h1>{current.name} <span className="verified">✓</span></h1><p>{current.role}</p><span>⌖ {current.location}</span></div><div className="dashboard-actions"><button className="primary-button" onClick={() => setView('create')}>✎ Edit Profile</button><button className="outline-button">↗ Share Profile</button></div></div><div className="stats"><div><b>12</b><span>Posts</span></div><div><b>2.5k</b><span>Followers</span></div><div><b>1.2k</b><span>Following</span></div></div><div className="dashboard-tabs"><button className="active">About</button><button>Skills</button><button>Experience</button><button>Education</button><button>Contact</button></div><div className="dashboard-columns"><article><h2>About Me</h2><p>{current.bio}</p><dl><dt>✧ Experience</dt><dd>2+ Years</dd><dt>✉ Email</dt><dd>{current.email}</dd><dt>↗ Website</dt><dd>{current.website ? <a href={websiteHref(current.website)} target="_blank" rel="noreferrer">{current.website}</a> : 'Not added'}</dd></dl></article><article><h2>Skills</h2><div className="skill-list">{['SEO', 'React', 'WordPress', 'Google Analytics', 'Technical SEO', 'Keyword Research', 'Content Writing', 'Digital Marketing'].map((skill) => <span key={skill}>{skill}</span>)}</div><h2 className="experience-title">Experience</h2><p><b>SEO Executive</b><br /><small>Digital Marketing Agency · 2022 — Present</small></p></article></div></div></section> }
function ProfileList({ submittedProfiles, authUser, onEditProfile, setView }) {
  return <section className="explore-page profile-list-page"><div className="explore-head profile-list-head"><div><span className="eyebrow blue">THE PROFILE COMMUNITY</span><h1>Profile List</h1><p>{submittedProfiles.length} public {submittedProfiles.length === 1 ? 'profile' : 'profiles'}</p></div><button className="primary-button" onClick={() => setView('submit')}>Submit Profile <Icon>+</Icon></button></div>{submittedProfiles.length ? <div className="profile-grid">{submittedProfiles.map((item) => <article className="directory-card" key={`${item.handle}-${item.ownerEmail}`}><img src={item.image || profiles[0].image} alt={item.name} /><h3>{item.name}</h3><strong>{item.role}</strong><p>⌖ {item.location}</p>{item.website && <a className="community-link" href={websiteHref(item.website)} target="_blank" rel="noreferrer">Visit website ↗</a>}{savedProfileOwner(item) && (!authUser || savedProfileOwner(item) === authUser.email.toLowerCase()) && <button className="community-edit" onClick={() => onEditProfile(item)}>{authUser ? 'Edit profile' : 'Log in to edit'}</button>}</article>)}</div> : <div className="profile-list-empty"><h2>No profiles yet</h2><p>Newly submitted profiles will appear here.</p><button className="primary-button" onClick={() => setView('submit')}>Create a profile <Icon>→</Icon></button></div>}</section>
}
function CommunityPreview({ submittedProfiles, setView }) {
  const community = [...submittedProfiles, ...profiles.filter((sample) => !submittedProfiles.some((saved) => saved.name === sample.name))].slice(0, 3)
  return <section className="profile-community"><div className="slider-heading"><div><span className="eyebrow blue">MEET THE COMMUNITY</span><h2>Profiles made to be seen.</h2><p>Discover people, work, and stories from the Profile community.</p></div><button className="outline-button" onClick={() => setView('profiles')}>View profile list <Icon>→</Icon></button></div><div className="profile-grid home-profile-grid">{community.map((item) => <article className="directory-card" key={`${item.name}-${item.handle || ''}`}><img src={item.image || profiles[0].image} alt={item.name} /><h3>{item.name}</h3><strong>{item.role}</strong><p>⌖ {item.location}</p>{item.website && <a className="community-link" href={websiteHref(item.website)} target="_blank" rel="noreferrer">Visit website ↗</a>}</article>)}</div></section>
}
function savedProfileOwner(item) { return (item.ownerEmail || '').trim().toLowerCase() }
function App() {
  const [view, setView] = useState('home')
  const [editingHandle, setEditingHandle] = useState(null)
  const [authUser, setAuthUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('profilehub-user')) || null } catch { return null }
  })
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('profilehub-profile')) || defaultProfile } catch { return defaultProfile }
  })
  const [savedProfiles, setSavedProfiles] = useState(() => {
    try { return JSON.parse(localStorage.getItem('profilehub-submissions')) || [] } catch { return [] }
  })
  useEffect(() => localStorage.setItem('profilehub-profile', JSON.stringify(profile)), [profile])
  function authenticate(user) {
    const targetProfile = savedProfiles.find((item) => item.handle === editingHandle)
    if (targetProfile && savedProfileOwner(targetProfile) !== user.email.trim().toLowerCase()) return 'This profile belongs to a different Gmail account.'
    let accounts = []
    try { accounts = JSON.parse(localStorage.getItem('profilehub-accounts')) || [] } catch { accounts = [] }
    const email = user.email.trim().toLowerCase()
    const existing = accounts.find((account) => account.email.toLowerCase() === email)
    if (user.mode === 'login') {
      if (!existing || existing.password !== user.password) return false
    } else if (!existing) {
      accounts = [...accounts, { email, password: user.password }]
      localStorage.setItem('profilehub-accounts', JSON.stringify(accounts))
    }
    const account = { email }
    setAuthUser(account)
    localStorage.setItem('profilehub-user', JSON.stringify(account))
    return true
  }
  function logout() {
    setAuthUser(null)
    setView('home')
    localStorage.removeItem('profilehub-user')
  }
  function saveProfile(nextProfile) {
    const savedProfile = { ...nextProfile, ownerEmail: (nextProfile.ownerEmail || '').trim().toLowerCase(), website: nextProfile.website && !/^https?:\/\//i.test(nextProfile.website) ? `https://${nextProfile.website}` : nextProfile.website, savedAt: new Date().toISOString() }
    const editingExisting = editingHandle && savedProfiles.some((item) => item.handle === editingHandle)
    const nextProfiles = editingExisting
      ? savedProfiles.map((item) => item.handle === editingHandle ? savedProfile : item)
      : [savedProfile, ...savedProfiles.filter((item) => item.handle !== savedProfile.handle)]
    setProfile(savedProfile)
    setSavedProfiles(nextProfiles)
    setEditingHandle(null)
    localStorage.setItem('profilehub-profile', JSON.stringify(savedProfile))
    localStorage.setItem('profilehub-submissions', JSON.stringify(nextProfiles))
  }
  function editProfile(item) {
    if (!authUser) {
      setProfile(item)
      setEditingHandle(item.handle)
      setView('auth')
      return
    }
    setProfile(item)
    setEditingHandle(item.handle)
    setView('submit')
  }
  return <main className="app"><Header view={view} setView={setView} authUser={authUser} onLogout={logout} />{view === 'home' && <><Home setView={setView} /><CommunityPreview submittedProfiles={savedProfiles} setView={setView} /></>}{view === 'profiles' && <ProfileList submittedProfiles={savedProfiles} authUser={authUser} onEditProfile={editProfile} setView={setView} />}{view === 'auth' && <Auth setView={setView} onAuth={authenticate} />}{view === 'submit' && <SubmitWorkspace profile={profile} setProfile={setProfile} setView={setView} saveProfile={saveProfile} isEditing={Boolean(editingHandle)} />}<footer className="footer"><Logo /><span>© 2026 Profile. Your identity, your story.</span></footer></main>
}
export default App


