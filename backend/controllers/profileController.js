import Profile from '../models/Profile.js'
import { profileSchema } from '../utils/validation.js'

const publicFields = 'username profileImage fullName professionalTitle location shortBio about experience education skills projects socialLinks theme'

function profileInput(body) {
  return profileSchema.parse(body)
}

export async function createProfile(req, res) {
  const data = profileInput(req.body)
  const profile = await Profile.create({ ...data, userId: req.user.id, status: 'draft' })
  res.status(201).json({ profile })
}

export async function getMyProfile(req, res) {
  const profile = await Profile.findOne({ userId: req.user.id })
  res.json({ profile })
}

export async function updateMyProfile(req, res) {
  const data = profileInput(req.body)
  const profile = await Profile.findOne({ userId: req.user.id })
  if (!profile) return res.status(404).json({ error: 'Create a profile before saving changes.' })
  Object.assign(profile, data, {
    status: 'draft', rejectionReason: '', submittedAt: null,
    approvedAt: null, approvedBy: null, rejectedAt: null,
  })
  await profile.save()
  res.json({ profile })
}

export async function submitProfile(req, res) {
  const profile = await Profile.findOne({ userId: req.user.id })
  if (!profile) return res.status(404).json({ error: 'Create a profile before submitting it.' })
  profile.status = 'pending'
  profile.submittedAt = new Date()
  profile.rejectionReason = ''
  profile.approvedAt = null
  profile.approvedBy = null
  profile.rejectedAt = null
  await profile.save()
  res.json({ message: 'Your profile has been submitted for review.', profile })
}

export async function listPublicProfiles(req, res) {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
  const limit = Math.min(30, Math.max(1, Number.parseInt(req.query.limit, 10) || 12))
  const filter = { status: 'approved' }
  const search = String(req.query.search || '').trim().slice(0, 100)
  const profession = String(req.query.profession || '').trim().slice(0, 100)
  const location = String(req.query.location || '').trim().slice(0, 100)
  const regex = (value) => new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  if (search) filter.$or = [
    { fullName: regex(search) }, { professionalTitle: regex(search) },
    { shortBio: regex(search) }, { skills: regex(search) },
  ]
  if (profession) filter.professionalTitle = regex(profession)
  if (location) filter.location = regex(location)
  const [profiles, total] = await Promise.all([
    Profile.find(filter).select(publicFields).sort({ approvedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Profile.countDocuments(filter),
  ])
  res.json({ profiles, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
}

export async function getPublicProfile(req, res) {
  const profile = await Profile.findOne({ username: req.params.username.toLowerCase(), status: 'approved' }).select(publicFields).lean()
  if (!profile) return res.status(404).json({ error: 'Profile not available.' })
  res.json({ profile })
}

export async function uploadProfileImage(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Choose an image file to upload.' })
  const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
  res.status(201).json({ imageUrl })
}
