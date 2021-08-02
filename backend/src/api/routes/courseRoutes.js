import express from 'express'
import {
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, getCourse).post(protect, admin, addCourse)
router
  .route('/:id')
  .delete(protect, admin, deleteCourse)
  .put(protect, admin, updateCourse)

export default router
