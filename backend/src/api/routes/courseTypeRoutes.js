import express from 'express'
import {
  getCourseType,
  addCourseType,
  updateCourseType,
  deleteCourseType,
} from '../controllers/courseTypeController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .get(protect, getCourseType)
  .post(protect, admin, addCourseType)
router
  .route('/:id')
  .delete(protect, admin, deleteCourseType)
  .put(protect, admin, updateCourseType)

export default router
