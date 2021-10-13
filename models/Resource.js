import mongoose from 'mongoose'
import Course from './Course'
import CourseType from './CourseType'
import Subject from './Subject'
import Instructor from './Instructor'

const resourceScheme = mongoose.Schema(
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
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Subject,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Instructor,
      required: true,
    },
    semester: { type: Number, required: true },
    shift: { type: String, required: true },
    file: {
      fileName: { type: String },
      filePath: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Resource =
  mongoose.models.Resource || mongoose.model('Resource', resourceScheme)
export default Resource
