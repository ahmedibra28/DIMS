import asyncHandler from 'express-async-handler'
import FeeModel from '../models/feeModel.js'
import AssignToCourseModel from '../models/assignToCourseModel.js'
import moment from 'moment'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export const searchStudentToPay = asyncHandler(async (req, res) => {
  const { course, shift, paymentDate } = req.body
  const semester = Number(req.body.semester)
  const paymentNewDate = moment(paymentDate).format()

  const startOfMonth = moment(paymentNewDate).clone().startOf('month').format()
  const endOfMonth = moment(paymentNewDate).clone().endOf('month').format()

  const fee = await FeeModel.find({
    semester,
    shift,
    course,
    isPaid: false,
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
  })
    .populate('payment.student')
    .populate('course')
    .populate('student')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
  if (!fee) {
    res.status(400)
    throw new Error(`The is no unpaid students in this ${paymentNewDate}`)
  }
  res.status(200).json(fee)
})

export const Pay = asyncHandler(async (req, res) => {
  const { shift } = req.body
  const course = req.body.course._id
  const price = req.body.course.price
  const semester = Number(req.body.semester)
  const student = req.body.student._id
  const mobileNumber = req.body.student.mobileNumber
  const rollNo = req.body.student.rollNo
  const paymentDate = moment(req.body.paymentDate).format()
  const paymentMethod = req.body.paymentMethod

  const startOfMonth = moment(paymentDate).clone().startOf('month').format()
  const endOfMonth = moment(paymentDate).clone().endOf('month').format()

  const fee = await FeeModel.findOne({
    student,
    isPaid: false,
    semester,
    shift,
    course,
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
  })

  if (!fee) {
    res.status(400)
    throw new Error(
      `${moment(paymentDate).format('MMM')} payment is already paid`
    )
  } else {
    await fee.save()

    // Mobile Payment
    if (paymentMethod === 'mwallet_account') {
      const paymentObject = {
        schemaVersion: '1.0',
        requestId: uuidv4(),
        timestamp: Date.now(),
        channelName: 'WEB',
        serviceName: 'API_PURCHASE',
        serviceParams: {
          merchantUid: process.env.MERCHANT_U_ID,
          apiUserId: process.env.API_USER_ID,
          apiKey: process.env.API_KEY,
          paymentMethod: 'mwallet_account',
          payerInfo: {
            accountNo: `252${mobileNumber}`,
          },
          transactionInfo: {
            referenceId: uuidv4(),
            invoiceId:
              req.body.paymentDate.slice(0, 10).replace(/-/g, '') +
              rollNo +
              '-' +
              uuidv4().slice(1, 3),
            amount: price,
            currency: 'USD',
            description: 'fee tuition',
          },
        },
      }

      const { data } = await axios.post(
        `https://api.waafi.com/asm`,
        paymentObject
      )

      // 5206 => payment has been cancelled
      // 2001 => payment has been done successfully
      if (Number(data.responseCode) === 2001) {
        fee.isPaid = true
        fee.paidFeeAmount = price
        fee.paymentDate = paymentDate
        fee.paymentMethod = paymentMethod

        const updateObj = await fee.save()
        if (updateObj) res.status(201).json({ status: 'success' })
      }
      if (Number(data.responseCode) !== 2001) {
        res.status(401)
        throw new Error('Payment has been cancelled')
      }
    }

    if (paymentMethod === 'on_cash') {
      fee.isPaid = true
      fee.paidFeeAmount = price
      fee.paymentDate = paymentDate
      fee.paymentMethod = paymentMethod

      const updateObj = await fee.save()
      if (updateObj) res.status(201).json({ status: 'success' })
    }
  }
})

export const feeGeneration = asyncHandler(async (req, res) => {
  const { course, shift } = req.body
  const semester = Number(req.body.semester)
  let paymentDate = moment(new Date()).format()
  const paymentMethod = 'on_cash'

  const courseData = await AssignToCourseModel.find({
    course,
    semester,
    shift,
    isActive: true,
    isGraduated: false,
  })
  if (courseData.length === 0) {
    res.status(400)
    throw new Error('No student in the semester you selected')
  }
  if (courseData) {
    const allStudents = courseData.map((student) => student.student)

    const startOfMonth = moment(new Date()).clone().startOf('month').format()
    const endOfMonth = moment(new Date()).clone().endOf('month').format()

    const fee = await FeeModel.find({
      semester,
      shift,
      course,
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    })

    if (fee.length > 0) {
      const paidStudents = fee.map((student) => student.student.toString())

      const unPaidStudents = allStudents.filter(
        (s) => !paidStudents.includes(s.toString())
      )

      if (unPaidStudents.length > 0) {
        const createObj = unPaidStudents.map(async (std) => {
          await FeeModel.create({
            student: std,
            isPaid: false,
            paidFeeAmount: courseData && courseData[0].price,
            paymentDate,
            paymentMethod,
            semester,
            shift,
            course,
            createdBy: req.user._id,
          })
        })
        if (createObj) {
          res.status(201).json({ status: 'success' })
        } else {
          res.status(400)
          throw new Error('Invalid payment')
        }
      }
      if (unPaidStudents.length === 0) {
        res.status(400)
        throw new Error('There is no new fee collection to generate')
      }
    }

    if (fee.length === 0) {
      const createObj = allStudents.map(async (std) => {
        await FeeModel.create({
          student: std,
          isPaid: false,
          paidFeeAmount: courseData && courseData[0].price,
          paymentDate,
          paymentMethod,
          semester,
          shift,
          course,
          createdBy: req.user._id,
        })
      })
      if (createObj) {
        res.status(201).json({ status: 'success' })
      } else {
        res.status(400)
        throw new Error('Invalid payment')
      }
    }
  }
})

export const getFees = asyncHandler(async (req, res) => {
  const runningMonth = moment().subtract(0, 'months').format()
  const sixMonthsAgo = moment().subtract(6, 'months').format()
  const startOfMonth = moment(sixMonthsAgo).clone().startOf('month').format()
  const endOfMonth = moment(runningMonth).clone().endOf('month').format()

  const fee = await FeeModel.find({
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
  })
    .populate('student')
    .populate('course')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')

  res.status(200).json(fee)
})
