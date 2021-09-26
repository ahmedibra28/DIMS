import mongoose from 'mongoose'
import Course from './Course'
import CourseType from './CourseType'
import Student from './Student'

const assignCourseScheme = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Student,
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
    price: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    shift: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isGraduated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const AssignCourse =
  mongoose.models.AssignCourse ||
  mongoose.model('AssignCourse', assignCourseScheme)
export default AssignCourse
