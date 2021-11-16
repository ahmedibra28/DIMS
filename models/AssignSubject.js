import mongoose from 'mongoose'
import Course from './Course'
import CourseType from './CourseType'
import Subject from './Subject'
import Instructor from './Instructor'

const assignSubjectScheme = mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Instructor,
      required: true,
    },
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
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Subject,
      required: true,
    },
    semester: { type: Number, required: true },
    shift: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const AssignSubject =
  mongoose.models.AssignSubject ||
  mongoose.model('AssignSubject', assignSubjectScheme)
export default AssignSubject
