import express from 'express'
import {
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
  getStudentDetails,
} from '../controllers/studentController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, getStudent).post(protect, admin, addStudent)
router
  .route('/:id')
  .delete(protect, admin, deleteStudent)
  .put(protect, admin, updateStudent)
  .get(protect, getStudentDetails)

export default router
