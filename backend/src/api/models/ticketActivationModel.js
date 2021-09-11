import mongoose from 'mongoose'

const ticketActivationScheme = mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true,
    },
    shift: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const TicketActivationModel = mongoose.model(
  'TicketActivation',
  ticketActivationScheme
)
export default TicketActivationModel
