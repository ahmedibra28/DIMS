import express from 'express'
import {
  getMarks,
  addMarks,
  updateMarks,
  deleteMarks,
  getSubjectsByInstructor,
  getStudentBySubjectInstructor,
} from '../controllers/marksController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, getMarks).post(protect, admin, addMarks)
router
  .route('/:id')
  .delete(protect, admin, deleteMarks)
  .put(protect, admin, updateMarks)
  .get(protect, getSubjectsByInstructor)

router.route('/subject/student').post(protect, getStudentBySubjectInstructor)

export default router
