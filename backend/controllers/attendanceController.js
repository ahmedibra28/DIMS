import asyncHandler from 'express-async-handler'
import InstructorModel from '../models/instructorModel.js'
import AssignToSubject from '../models/assignToSubjectModel.js'

export const getClassInfo = asyncHandler(async (req, res) => {
  const { course, semester, subject } = req.body
  const instructor = req.user.email

  // const instructorObj = await InstructorModel.findOne({ email })
  // const instructor = instructorObj._id

  // const assignToSubjectObj = await AssignToSubject.find({
  //   instructor,
  //   isActive: true,
  // })

  res.status(201).json({ s: 'Helo' })
})
