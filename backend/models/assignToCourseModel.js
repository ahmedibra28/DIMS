import mongoose from 'mongoose'

const assignToCourseScheme = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
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
    dateOfAdmission: {
      type: Date,
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

const AssignToCourseModel = mongoose.model(
  'AssignToCourse',
  assignToCourseScheme
)
export default AssignToCourseModel
