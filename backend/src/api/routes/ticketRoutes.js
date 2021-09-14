import express from 'express'
import { getStudentTicket } from '../controllers/ticketController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/:student').get(protect, getStudentTicket)

export default router
