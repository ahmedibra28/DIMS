import express from 'express'
import {
  searchStudentToPay,
  Pay,
  feeGeneration,
} from '../controllers/feeController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/pay').post(protect, Pay)
router.route('/student').post(protect, searchStudentToPay)
router.route('/generate').post(protect, feeGeneration)

export default router
