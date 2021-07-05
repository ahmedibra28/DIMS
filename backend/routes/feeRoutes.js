import express from 'express'
import {
  searchStudentToPay,
  Pay,
  feeGeneration,
  getFees,
} from '../controllers/feeController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, getFees)
router.route('/pay').post(protect, Pay)
router.route('/student').post(protect, searchStudentToPay)
router.route('/generate').post(protect, feeGeneration)

export default router
