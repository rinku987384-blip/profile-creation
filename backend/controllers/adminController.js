import Profile from '../models/Profile.js'
import User from '../models/User.js'
import { rejectSchema } from '../utils/validation.js'

const reviewFields = '-__v'

export async function dashboardStats(_req, res) {
  const [pendingProfiles, approvedProfiles, rejectedProfiles, totalUsers] = await Promise.all([
    Profile.countDocuments({ status: 'pending' }),
    Profile.countDocuments({ status: 'approved' }),
    Profile.countDocuments({ status: 'rejected' }),
    User.countDocuments(),
  ])
  res.json({ pendingProfiles, approvedProfiles, rejectedProfiles, totalUsers })
}

export async function listProfilesByStatus(req, res) {
  const profiles = await Profile.find({ status: req.params.status })
    .select('username profileImage fullName professionalTitle location submittedAt status rejectionReason')
    .sort({ submittedAt: -1 }).lean()
  res.json({ profiles })
}

export async function getProfileForReview(req, res) {
  const profile = await Profile.findById(req.params.id).select(reviewFields).populate('userId', 'name email').lean()
  if (!profile) return res.status(404).json({ error: 'Profile not found.' })
  res.json({ profile })
}

export async function approveProfile(req, res) {
  const profile = await Profile.findOneAndUpdate(
    { _id: req.params.id, status: 'pending' },
    { $set: { status: 'approved', approvedAt: new Date(), approvedBy: req.user.id, rejectionReason: '', rejectedAt: null } },
    { new: true, runValidators: true },
  )
  if (!profile) return res.status(409).json({ error: 'Only pending profiles can be approved.' })
  res.json({ message: 'Profile approved and now public.', profile })
}

export async function rejectProfile(req, res) {
  const { reason } = rejectSchema.parse(req.body)
  const profile = await Profile.findOneAndUpdate(
    { _id: req.params.id, status: 'pending' },
    { $set: { status: 'rejected', rejectionReason: reason, rejectedAt: new Date(), approvedAt: null, approvedBy: null } },
    { new: true, runValidators: true },
  )
  if (!profile) return res.status(409).json({ error: 'Only pending profiles can be rejected.' })
  res.json({ message: 'Profile rejected.', profile })
}

export async function listUsers(_req, res) {
  const users = await User.find().select('name email role createdAt').sort({ createdAt: -1 }).lean()
  res.json({ users })
}
