import asyncHandler from 'express-async-handler'
import AssignToCourseModel from '../models/assignToCourseModel.js'
import FeeModel from '../models/feeModel.js'
import StudentModel from '../models/studentModel.js'

export const getStudentTicket = asyncHandler(async (req, res) => {
  const { student } = req.params

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

export const studentClearance = asyncHandler(async (req, res) => {
  const { student } = req.params

  const checkIfNot = await FeeModel.find({
    student,
    isPaid: false,
  })

  if (checkIfNot.length === 0) {
    const obj = await StudentModel.findById(student)

    res.status(201).json(obj)
  } else {
    res.status(404)
    throw new Error('This student is not clean')
  }
})
