import mongoose from 'mongoose'
import Course from './Course'
import CourseType from './CourseType'
import Student from './Student'
import Subject from './Subject'
import Instructor from './Instructor'

const examScheme = mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Course,
      required: true,
    },
    courseType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CourseType,
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Subject,
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Student,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Instructor,
      required: true,
    },
    semester: { type: Number, required: true },
    shift: { type: String, required: true },
    exam: { type: String, required: true },
    theoryMarks: { type: Number, required: true, default: 0 },
    practicalMarks: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Exam = mongoose.models.Exam || mongoose.model('Exam', examScheme)
export default Exam
