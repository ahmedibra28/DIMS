import express from 'express'
import {
  getAttendanceReport,
  getCompleteFeeReport,
  getCompleteMarkSheetReport,
} from '../controllers/reportController.js'

import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/attendance').post(protect, getAttendanceReport)
router.route('/marksheet').post(protect, getCompleteMarkSheetReport)
router.route('/fee').post(protect, getCompleteFeeReport)

export default router
