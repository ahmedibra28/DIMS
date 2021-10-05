import mongoose from 'mongoose'
import CourseType from './CourseType'
import Course from './Course'
import Student from './Student'

const tuitionScheme = mongoose.Schema(
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
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Student,
      required: true,
    },
    semester: { type: Number, required: true },
    shift: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    amount: { type: Number, default: 0.0 },
    paymentMethod: { type: String, default: 'on_cash' },
    paymentDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Tuition =
  mongoose.models.Tuition || mongoose.model('Tuition', tuitionScheme)
export default Tuition
