import mongoose from 'mongoose'

let embeddedServer

export default async function connectDatabase() {
  const uri = process.env.MONGO_URI?.trim()

  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGO_URI is required in production.')
    }

    console.warn('No MONGO_URI configured. Starting without MongoDB connection for local preview.')
    return
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
  console.log('Connected to MongoDB.')
}

export async function closeDatabase() {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect()
  }

  await embeddedServer?.stop()
}
