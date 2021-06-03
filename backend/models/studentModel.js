import mongoose from 'mongoose'

const studentScheme = mongoose.Schema(
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
    fullName: {
      type: String,
      required: true,
    },
    placeOfBirth: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dateOfAdmission: {
      type: Date,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    contactFullName: {
      type: String,
      required: true,
    },
    contactMobileNumber: {
      type: Number,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactRelationship: {
      type: String,
      required: true,
    },
    levelOfEducation: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    languageSkills: {
      somali: {
        type: String,
        required: true,
      },
      arabic: {
        type: String,
        required: true,
      },
      english: {
        type: String,
        required: true,
      },
      kiswahili: {
        type: String,
        required: true,
      },
    },

    comment: {
      type: String,
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

const StudentModel = mongoose.model('Student', studentScheme)
export default StudentModel
