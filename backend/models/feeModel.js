import mongoose from 'mongoose'

const feeScheme = mongoose.Schema(
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
    shift: {
      type: String,
      required: true,
    },
    payment: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
          required: true,
        },
        isPaid: {
          type: Boolean,
          default: false,
        },
        paidFeeAmount: {
          type: Number,
          default: 0.0,
        },
        paymentDate: {
          type: Date,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const FeeModel = mongoose.model('Fee', feeScheme)
export default FeeModel
