import express from 'express'
import {
  getAttendanceReport,
  getCompleteMarkSheetReport,
} from '../controllers/reportController.js'

import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/attendance').post(protect, getAttendanceReport)
router.route('/marksheet').post(protect, getCompleteMarkSheetReport)

export default router
