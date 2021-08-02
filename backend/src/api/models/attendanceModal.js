import mongoose from 'mongoose'

const attendanceScheme = mongoose.Schema(
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
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    student: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
          required: true,
        },
        isPresent: {
          type: Boolean,
          default: false,
        },
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
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
  },
  {
    timestamps: true,
  }
)

const AttendanceModel = mongoose.model('Attendance', attendanceScheme)
export default AttendanceModel
