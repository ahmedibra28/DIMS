import mongoose from 'mongoose'
import Subject from './Subject'
import Student from './Student'
import CourseType from './CourseType'
import Course from './Course'
import Instructor from './Instructor'

const attendanceScheme = mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },
    semester: { type: Number, required: true },
    shift: { type: String, required: true },
    student: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Student,
          required: true,
        },
        isAttended: { type: Boolean, default: false },
      },
    ],
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
  },
  { timestamps: true }
)

const Attendance =
  mongoose.models.Attendance || mongoose.model('Attendance', attendanceScheme)
export default Attendance
