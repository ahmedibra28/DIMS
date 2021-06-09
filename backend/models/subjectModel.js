import mongoose from 'mongoose'

const subjectScheme = mongoose.Schema(
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
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    theoryMarks: {
      type: Number,
      default: 0.0,
      required: true,
    },
    practicalMarks: {
      type: Number,
      default: 0.0,
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

const SubjectModel = mongoose.model('Subject', subjectScheme)
export default SubjectModel
