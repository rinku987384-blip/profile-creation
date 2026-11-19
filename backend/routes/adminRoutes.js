import { Router } from 'express'
import { approveProfile, dashboardStats, getProfileForReview, listProfilesByStatus, listUsers, rejectProfile } from '../controllers/adminController.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { requireAdmin } from '../middleware/adminMiddleware.js'

const router = Router()
router.use(requireAuth, requireAdmin)
router.get('/dashboard', dashboardStats)
router.get('/profiles/pending', (req, res) => { req.params.status = 'pending'; return listProfilesByStatus(req, res) })
router.get('/profiles/approved', (req, res) => { req.params.status = 'approved'; return listProfilesByStatus(req, res) })
router.get('/profiles/rejected', (req, res) => { req.params.status = 'rejected'; return listProfilesByStatus(req, res) })
router.get('/profiles/:id', getProfileForReview)
router.put('/profiles/:id/approve', approveProfile)
router.put('/profiles/:id/reject', rejectProfile)
router.get('/users', listUsers)

export default router
