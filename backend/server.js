import 'dotenv/config'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import mongoose from 'mongoose'
import connectDatabase, { closeDatabase } from './config/database.js'
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import sanitizeInput from './middleware/sanitizeInput.js'

const app = express()
const port = Number(process.env.PORT || 4000)
const allowedOrigins = (process.env.CLIENT_URL || 'http://127.0.0.1:5173').split(',').map((url) => url.trim())

app.use(helmet())
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
  callback(new Error('Origin is not allowed by CORS.'))
}, credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())
app.use(sanitizeInput)
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: true, legacyHeaders: false }))
app.use('/uploads', express.static(path.resolve('uploads'), { fallthrough: false, maxAge: '1d' }))

app.get('/api/health', (_req, res) => res.json({ ok: true, database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }))
app.use('/api/auth', authRoutes)
app.use('/api/profiles', profileRoutes)
app.use('/api/admin', adminRoutes)

app.use((error, _req, res, _next) => {
  if (error.code === 11000) return res.status(409).json({ error: 'That email or username is already in use.' })
  if (error.name === 'ZodError') return res.status(400).json({ error: error.issues[0]?.message || 'Invalid request.' })
  if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ error: error.message })
  if (error.name === 'MulterError' || error.message?.startsWith('Only JPG')) return res.status(400).json({ error: error.message })
  if (error.message === 'Origin is not allowed by CORS.') return res.status(403).json({ error: error.message })
  console.error(error)
  res.status(500).json({ error: 'Unexpected server error.' })
})

async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a value of at least 32 characters.')
  }
  await connectDatabase()
  const server = app.listen(port, () => console.log(`Profile API listening on http://localhost:${port}`))
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => server.close(async () => {
      await closeDatabase()
      process.exit(0)
    }))
  }
}

start().catch((error) => {
  console.error(`API startup failed: ${error.message}`)
  process.exitCode = 1
})
