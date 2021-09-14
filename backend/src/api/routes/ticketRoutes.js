import express from 'express'
import {
  getStudentTicket,
  studentClearance,
} from '../controllers/ticketController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/:student').get(protect, getStudentTicket)
router.route('/clearance/:student').get(protect, studentClearance)

export default router
