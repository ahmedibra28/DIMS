import express from 'express'
import {
  addAttendance,
  getAttendanceReport,
  getClassInfo,
} from '../controllers/attendanceController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, getClassInfo)
router.route('/search').post(protect, getAttendanceReport)
router.route('/submit').post(protect, addAttendance)

export default router
