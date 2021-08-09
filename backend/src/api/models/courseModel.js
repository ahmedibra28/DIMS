import mongoose from 'mongoose'

const courseScheme = mongoose.Schema(
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
    courseType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourseType',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    noExam: {
      type: Number,
      required: true,
    },
    certificationIssued: {
      type: String,
      required: true,
    },
    enrolmentRequirement: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const CourseModel = mongoose.model('Course', courseScheme)
export default CourseModel
