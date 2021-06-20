import express from 'express'
import {
  addAttendance,
  getClassInfo,
} from '../controllers/attendanceController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, getClassInfo)
router.route('/submit').post(protect, addAttendance)

export default router
