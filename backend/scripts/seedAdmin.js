import 'dotenv/config'
import bcrypt from 'bcryptjs'
import connectDatabase from '../config/database.js'
import User from '../models/User.js'

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password || password.length < 12) {
    throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in backend/.env.')
  }
  await connectDatabase()
  const hashedPassword = await bcrypt.hash(password, 12)
  const admin = await User.findOneAndUpdate(
    { email },
    { $set: { name: 'Profile Administrator', email, password: hashedPassword, role: 'admin' } },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  )
  console.log(`Administrator ready: ${admin.email}`)
  await User.db.close()
}

seedAdmin().catch((error) => {
  console.error(`Admin seed failed: ${error.message}`)
  process.exitCode = 1
})
