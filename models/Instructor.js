import mongoose from 'mongoose'

const instructorScheme = mongoose.Schema(
  {
    instructorIdNo: { type: Number, required: true },
    fullName: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    nationality: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    district: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    qualification: { type: String, required: true },
    experience: { type: Number, required: true },
    picture: {
      pictureName: { type: String, required: true },
      picturePath: { type: String, required: true },
    },
    comment: { type: String },
    contactFullName: { type: String, required: true },
    contactMobileNumber: { type: Number, required: true },
    contactEmail: { type: String, required: true },
    contactRelationship: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Instructor =
  mongoose.models.Instructor || mongoose.model('Instructor', instructorScheme)
export default Instructor
