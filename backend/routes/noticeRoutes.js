import express from 'express'
import {
  getNotice,
  addNotice,
  updateNotice,
  deleteNotice,
} from '../controllers/noticeController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, getNotice).post(protect, admin, addNotice)
router
  .route('/:id')
  .delete(protect, admin, deleteNotice)
  .put(protect, admin, updateNotice)

export default router
