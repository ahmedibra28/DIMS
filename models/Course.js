import mongoose from 'mongoose'
import CourseType from './CourseType'

const courseScheme = mongoose.Schema(
  {
    courseType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CourseType,
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    exam: { type: [String], required: true },
    certificationIssued: { type: String, required: true },
    enrolmentRequirement: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Course = mongoose.models.Course || mongoose.model('Course', courseScheme)
export default Course
