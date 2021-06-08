import express from 'express'
import {
  getSubject,
  addSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, getSubject).post(protect, admin, addSubject)
router
  .route('/:id')
  .delete(protect, admin, deleteSubject)
  .put(protect, admin, updateSubject)

export default router
