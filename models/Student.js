import mongoose from 'mongoose'

const studentScheme = mongoose.Schema(
  {
    rollNo: { type: String, required: true },
    fullName: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    nationality: { type: String, required: true },
    gender: { type: String, required: true },
    district: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    contactFullName: { type: String, required: true },
    contactMobileNumber: { type: Number, required: true },
    contactEmail: { type: String, required: true },
    contactRelationship: { type: String, required: true },
    levelOfEducation: { type: String, required: true },
    picture: {
      pictureName: { type: String },
      picturePath: { type: String },
    },
    languageSkills: {
      somali: { type: String, required: true },
      arabic: { type: String, required: true },
      english: { type: String, required: true },
      kiswahili: { type: String, required: true },
    },
    comment: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Student =
  mongoose.models.Student || mongoose.model('Student', studentScheme)
export default Student
