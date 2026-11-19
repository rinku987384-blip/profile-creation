import { z } from 'zod'

const text = (max) => z.string().trim().max(max).default('')
const experience = z.object({
  jobTitle: text(160), company: text(160), location: text(160),
  startDate: text(20), endDate: text(20), current: z.boolean().default(false),
  description: text(3000),
})
const education = z.object({
  institution: text(180), degree: text(160), fieldOfStudy: text(160),
  startYear: z.number().int().min(1900).max(2200).nullable().default(null),
  endYear: z.number().int().min(1900).max(2200).nullable().default(null),
  description: text(3000),
})
const project = z.object({
  name: text(160), description: text(3000), image: text(2048),
  url: text(2048), technologies: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
})
const socialLinks = z.object({
  website: text(2048), linkedin: text(2048), github: text(2048),
  instagram: text(2048), facebook: text(2048), twitter: text(2048),
}).default({})
const theme = z.object({
  profileTheme: z.enum(['light', 'dark', 'editorial']).default('light'),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#60784d'),
  layout: z.enum(['classic', 'minimal', 'split']).default('classic'),
}).default({})

export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(128),
})

export const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(128),
})

export const profileSchema = z.object({
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_-]{3,30}$/),
  profileImage: text(1_500_000),
  fullName: z.string().trim().min(2).max(120),
  professionalTitle: text(160), location: text(180), shortBio: text(280), about: text(10000),
  experience: z.array(experience).max(30).default([]),
  education: z.array(education).max(30).default([]),
  skills: z.array(z.string().trim().min(1).max(80)).max(60).default([]),
  projects: z.array(project).max(30).default([]), socialLinks, theme,
})

export const rejectSchema = z.object({ reason: z.string().trim().min(3).max(2000) })
