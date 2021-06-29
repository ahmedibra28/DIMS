import asyncHandler from 'express-async-handler'
import StudentModel from '../models/studentModel.js'
import FeeModel from '../models/feeModel.js'
import AssignToCourseModel from '../models/assignToCourseModel.js'
import moment from 'moment'

export const searchStudentToPay = asyncHandler(async (req, res) => {
  const { course, shift } = req.body
  const semester = Number(req.body.semester)

  const courseData = await AssignToCourseModel.find({
    course,
    semester,
    shift,
    isActive: true,
    isGraduated: false,
  })
    .populate('student')
    .populate('course')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
  res.status(200).json(courseData)
})

export const Pay = asyncHandler(async (req, res) => {
  const { semester, shift, price } = req.body.student
  const student = req.body.student.student._id
  const course = req.body.student.course._id
  let paymentDate = moment(req.body.paymentDate)

  const startOfMonth = moment(paymentDate).clone().startOf('month').format()
  const endOfMonth = moment(paymentDate).clone().endOf('month').format()

  const fee = await FeeModel.findOne({
    semester,
    shift,
    course,
    'payment.paymentDate': { $gte: startOfMonth, $lt: endOfMonth },
  })

  if (fee) {
    const checkIfNot = await FeeModel.findOne({
      semester,
      shift,
      course,
      'payment.student': student,
      'payment.paymentDate': { $gte: startOfMonth, $lt: endOfMonth },
    })
    if (checkIfNot) {
      res.status(400)
      throw new Error(
        `${moment(paymentDate).format('MMM')} payment is already paid`
      )
    } else {
      const payment = {
        student,
        isPaid: true,
        paidFeeAmount: price,
        paymentDate,
      }
      fee.payment.push(payment)
      const updateObj = await fee.save()
      if (updateObj) res.status(201).json({ status: 'success' })
    }
  } else {
    const payment = {
      student,
      isPaid: true,
      paidFeeAmount: price,
      paymentDate: paymentDate,
    }
    const createObj = await FeeModel.create({
      semester,
      shift,
      payment,
      course,
      createdBy: req.user._id,
    })
    if (createObj) {
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error('Invalid payment')
    }
  }
})
