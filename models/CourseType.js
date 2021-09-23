import mongoose from 'mongoose'

const courseTypeScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const CourseType =
  mongoose.models.CourseType || mongoose.model('CourseType', courseTypeScheme)
export default CourseType
