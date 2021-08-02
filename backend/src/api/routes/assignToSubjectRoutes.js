import express from 'express'
import {
  getAssignToSubject,
  addAssignToSubject,
  updateAssignToSubject,
  deleteAssignToSubject,
} from '../controllers/assignToSubjectController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, admin, addAssignToSubject)
router
  .route('/:id')
  .delete(protect, admin, deleteAssignToSubject)
  .put(protect, admin, updateAssignToSubject)
  .get(protect, getAssignToSubject)

export default router
