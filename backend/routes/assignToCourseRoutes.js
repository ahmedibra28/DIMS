import express from 'express'
import {
  getAssignToCourse,
  addAssignToCourse,
  updateAssignToCourse,
  deleteAssignToCourse,
} from '../controllers/assignToCourseController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, admin, addAssignToCourse)
router
  .route('/:id')
  .delete(protect, admin, deleteAssignToCourse)
  .put(protect, admin, updateAssignToCourse)
  .get(protect, getAssignToCourse)

export default router
