import express from 'express'
import {
  getInstructor,
  addInstructor,
  updateInstructor,
  deleteInstructor,
  getInstructorDetails,
} from '../controllers/instructorController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .get(protect, getInstructor)
  .post(protect, admin, addInstructor)
router
  .route('/:id')
  .delete(protect, admin, deleteInstructor)
  .put(protect, admin, updateInstructor)
  .get(protect, getInstructorDetails)

export default router
