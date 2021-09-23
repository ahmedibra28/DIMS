import mongoose from 'mongoose'
import Course from './Course'
import CourseType from './CourseType'

const subjectScheme = mongoose.Schema(
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
    name: { type: String, required: true },
    semester: { type: Number, required: true },
    theoryMarks: { type: Number, required: true },
    practicalMarks: { type: [String], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Subject =
  mongoose.models.Subject || mongoose.model('Subject', subjectScheme)
export default Subject
