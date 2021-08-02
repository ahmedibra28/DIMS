import express from 'express'
import {
  getMarks,
  addMarks,
  updateMarks,
  deleteMarks,
} from '../controllers/marksController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, admin, addMarks)
router
  .route('/:id')
  .delete(protect, admin, deleteMarks)
  .put(protect, admin, updateMarks)

router.route('/:id/:semesterNo/:shift').get(protect, getMarks)

export default router
