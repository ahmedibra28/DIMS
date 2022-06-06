import mongoose from 'mongoose'
import Student from './Student'

const regFeeScheme = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Student,
      required: true,
    },
    amount: { type: Number, default: 5 },
    paymentMethod: { type: String, default: 'on_cash' },
    paymentDate: { type: Date },
    invoice: { type: String, default: 'NA' },
  },
  { timestamps: true }
)

const RegFee = mongoose.models.RegFee || mongoose.model('RegFee', regFeeScheme)
export default RegFee
