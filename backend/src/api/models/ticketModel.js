import mongoose from 'mongoose'

const ticketScheme = mongoose.Schema(
  {
    ticket: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

const TicketModel = mongoose.model('Ticket', ticketScheme)
export default TicketModel
