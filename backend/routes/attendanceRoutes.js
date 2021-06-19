import express from 'express'
import { getClassInfo } from '../controllers/attendanceController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, getClassInfo)

export default router
