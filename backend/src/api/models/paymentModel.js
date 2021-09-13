import mongoose from 'mongoose'

const paymentScheme = mongoose.Schema(
  {
    fee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fee',
      required: true,
    },
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
    paymentMethod: {
      type: String,
      default: 'on_cash',
    },
    paymentDate: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const PaymentModel = mongoose.model('Payment', paymentScheme)
export default PaymentModel
