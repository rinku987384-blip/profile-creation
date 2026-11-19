import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema({
  jobTitle: { type: String, trim: true, maxlength: 160 },
  company: { type: String, trim: true, maxlength: 160 },
  location: { type: String, trim: true, maxlength: 160 },
  startDate: { type: String, trim: true, maxlength: 20 },
  endDate: { type: String, trim: true, maxlength: 20 },
  current: { type: Boolean, default: false },
  description: { type: String, trim: true, maxlength: 3000 },
}, { _id: true })

const educationSchema = new mongoose.Schema({
  institution: { type: String, trim: true, maxlength: 180 },
  degree: { type: String, trim: true, maxlength: 160 },
  fieldOfStudy: { type: String, trim: true, maxlength: 160 },
  startYear: { type: Number, min: 1900, max: 2200 },
  endYear: { type: Number, min: 1900, max: 2200 },
  description: { type: String, trim: true, maxlength: 3000 },
}, { _id: true })

const projectSchema = new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 160 },
  description: { type: String, trim: true, maxlength: 3000 },
  image: { type: String, trim: true, maxlength: 2048 },
  url: { type: String, trim: true, maxlength: 2048 },
  technologies: [{ type: String, trim: true, maxlength: 80 }],
}, { _id: true })

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 30, match: /^[a-z0-9_-]+$/ },
  profileImage: { type: String, trim: true, maxlength: 2048, default: '' },
  fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  professionalTitle: { type: String, trim: true, maxlength: 160, default: '' },
  location: { type: String, trim: true, maxlength: 180, default: '' },
  shortBio: { type: String, trim: true, maxlength: 280, default: '' },
  about: { type: String, trim: true, maxlength: 10000, default: '' },
  experience: { type: [experienceSchema], default: [] },
  education: { type: [educationSchema], default: [] },
  skills: { type: [{ type: String, trim: true, maxlength: 80 }], default: [] },
  projects: { type: [projectSchema], default: [] },
  socialLinks: {
    website: { type: String, trim: true, maxlength: 2048, default: '' },
    linkedin: { type: String, trim: true, maxlength: 2048, default: '' },
    github: { type: String, trim: true, maxlength: 2048, default: '' },
    instagram: { type: String, trim: true, maxlength: 2048, default: '' },
    facebook: { type: String, trim: true, maxlength: 2048, default: '' },
    twitter: { type: String, trim: true, maxlength: 2048, default: '' },
  },
  theme: {
    profileTheme: { type: String, enum: ['light', 'dark', 'editorial'], default: 'light' },
    accentColor: { type: String, match: /^#[0-9a-fA-F]{6}$/, default: '#60784d' },
    layout: { type: String, enum: ['classic', 'minimal', 'split'], default: 'classic' },
  },
  status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected'], default: 'draft', index: true },
  rejectionReason: { type: String, trim: true, maxlength: 2000, default: '' },
  submittedAt: { type: Date, default: null },
  approvedAt: { type: Date, default: null },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  rejectedAt: { type: Date, default: null },
}, { timestamps: true })

profileSchema.index({ status: 1, updatedAt: -1 })
profileSchema.index({ fullName: 'text', professionalTitle: 'text', shortBio: 'text', location: 'text', skills: 'text' })

export default mongoose.models.Profile || mongoose.model('Profile', profileSchema)
