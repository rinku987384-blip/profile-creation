import { Router } from 'express'
import { createProfile, getMyProfile, getPublicProfile, listPublicProfiles, submitProfile, updateMyProfile, uploadProfileImage } from '../controllers/profileController.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { imageUpload } from '../utils/upload.js'

const router = Router()
router.get('/', listPublicProfiles)
router.get('/me', requireAuth, getMyProfile)
router.post('/upload', requireAuth, imageUpload.single('image'), uploadProfileImage)
router.post('/submit', requireAuth, submitProfile)
router.post('/', requireAuth, createProfile)
router.put('/me', requireAuth, updateMyProfile)
router.get('/:username', getPublicProfile)

export default router
