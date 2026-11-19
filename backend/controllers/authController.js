import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { loginSchema, registerSchema } from '../utils/validation.js'

const cookieName = 'profile_session'
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

function sendSession(user, res, rememberMe = true) {
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.cookie(cookieName, token, { ...cookieOptions, maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000 })
}

export async function register(req, res) {
  const data = registerSchema.parse(req.body)
  const email = data.email.toLowerCase()
  if (await User.exists({ email })) return res.status(409).json({ error: 'An account with this email already exists.' })
  const user = await User.create({ name: data.fullName, email, password: await bcrypt.hash(data.password, 12) })
  sendSession(user, res, req.body.rememberMe !== false)
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}

export async function login(req, res) {
  const data = loginSchema.parse(req.body)
  const user = await User.findOne({ email: data.email.toLowerCase() }).select('+password')
  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    return res.status(401).json({ error: 'Email or password is incorrect.' })
  }
  sendSession(user, res, req.body.rememberMe !== false)
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}

export function logout(_req, res) {
  res.clearCookie(cookieName, { ...cookieOptions, maxAge: undefined })
  res.json({ message: 'You are logged out.' })
}

export function currentUser(req, res) {
  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role } })
}

export async function forgotPassword(req, res) {
  const email = String(req.body.email || '').trim().toLowerCase()
  if (!email) return res.status(400).json({ error: 'Enter a valid email address.' })
  const user = await User.findOne({ email }).select('+passwordResetTokenHash +passwordResetExpiresAt')
  if (user) {
    const token = crypto.randomBytes(32).toString('hex')
    user.passwordResetTokenHash = crypto.createHash('sha256').update(token).digest('hex')
    user.passwordResetExpiresAt = new Date(Date.now() + 30 * 60 * 1000)
    await user.save()
    if (process.env.NODE_ENV !== 'production') console.info(`Password reset URL: ${process.env.CLIENT_URL}/reset-password?token=${token}`)
  }
  res.json({ message: 'If an account exists for that email, password reset instructions will be sent.' })
}

export async function resetPassword(req, res) {
  const { token, password } = req.body
  if (typeof token !== 'string' || typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return res.status(400).json({ error: 'A valid reset token and password of at least 8 characters are required.' })
  }
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const user = await User.findOne({ passwordResetTokenHash: tokenHash, passwordResetExpiresAt: { $gt: new Date() } }).select('+passwordResetTokenHash +passwordResetExpiresAt')
  if (!user) return res.status(400).json({ error: 'This password reset link is invalid or expired.' })
  user.password = await bcrypt.hash(password, 12)
  user.passwordResetTokenHash = undefined
  user.passwordResetExpiresAt = undefined
  await user.save()
  res.json({ message: 'Password updated. You can now log in.' })
}
