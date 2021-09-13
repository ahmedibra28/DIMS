import express from 'express'
import {
  getTicketActivation,
  addTicketActivation,
  updateTicketActivation,
  deleteTicketActivation,
  getStudentTicket,
} from '../controllers/ticketController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/activate')
  .get(protect, getTicketActivation)
  .post(protect, addTicketActivation)
router.route('/:student').get(protect, getStudentTicket)
router
  .route('/activate/:id')
  .delete(protect, admin, deleteTicketActivation)
  .put(protect, admin, updateTicketActivation)

export default router
