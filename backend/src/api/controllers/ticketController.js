import asyncHandler from 'express-async-handler'
import AssignToCourseModel from '../models/assignToCourseModel.js'
import FeeModel from '../models/feeModel.js'

export const getStudentTicket = asyncHandler(async (req, res) => {
  const student = req.params.student

  const checkIfNot = await FeeModel.find({
    student,
    isPaid: false,
  })

  if (checkIfNot.length === 0) {
    const obj = await AssignToCourseModel.findOne({
      student,
      isActive: true,
      isGraduated: false,
    })
      .sort({ createdAt: -1 })
      .populate('course', 'name')
      .populate('student')

    res.status(201).json(obj)
  } else {
    res.status(404)
    throw new Error('Please pay the fee tuition')
  }
})
