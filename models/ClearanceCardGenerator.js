import mongoose from 'mongoose'
import CourseType from './CourseType'
import Course from './Course'

const clearanceCardGeneratorScheme = mongoose.Schema(
  {
    courseType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CourseType,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Course,
      required: true,
    },
    semester: { type: Number, required: true },
    shift: { type: String, required: true },
    exam: { type: String, required: true },
    academic: { type: String, required: true },
    examDate: { type: Date, default: new Date() },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const ClearanceCardGenerator =
  mongoose.models.ClearanceCardGenerator ||
  mongoose.model('ClearanceCardGenerator', clearanceCardGeneratorScheme)
export default ClearanceCardGenerator
