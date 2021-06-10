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
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const AssignToCourseModel = mongoose.model(
  'AssignToCorse',
  assignToCourseScheme
)
export default AssignToCourseModel
