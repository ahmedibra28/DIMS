import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Tuition from '../../../models/Tuition'
import RegFee from '../../../models/RegFee'
import { isAuth } from '../../../utils/auth'
import moment from 'moment'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const handler = nc()

handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()

  const { courseType, course, shift } = req.body
  const semester = Number(req.body.semester)
  let paymentDate = moment(req.body.paymentDate).format()

  const startOfMonth = moment(paymentDate).clone().startOf('month').format()
  const endOfMonth = moment(paymentDate).clone().endOf('month').format()

  const tuitionFees = await Tuition.find({
    courseType,
    course,
    shift,
    semester,
    isPaid: false,
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
  })
    .sort({ createdAt: -1 })
    .populate('courseType', 'name')
    .populate('course', 'name')
    .populate('student', ['fullName', 'picture', 'rollNo'])

  if (tuitionFees.length === 0) {
    return res
      .status(404)
      .send('No unpaid students in the semester or shift you selected')
  } else {
    return res.status(200).json(tuitionFees)
  }
})

handler.put(async (req, res) => {
  await dbConnect()

  const student = req.user.group === 'student' ? req.user.student : null

  const paymentDate = moment(new Date()).format()

  const tuition = await Tuition.findOne({
    _id: req.body._id,
    isPaid: false,
  }).populate('student', ['rollNo', 'mobileNumber'])

  if (!tuition) {
    return res.status(404).send('Payment has not done successfully')
  } else {
    if (student) {
      // Mobile Payment

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
          paymentMethod: 'MWALLET_ACCOUNT',
          payerInfo: {
            accountNo: `252${tuition.student.mobileNumber}`,
          },
          transactionInfo: {
            referenceId: uuidv4(),
            invoiceId:
              paymentDate.slice(0, 10).replace(/-/g, '') +
              tuition.student.rollNo +
              '-' +
              uuidv4().slice(1, 3),
            amount: tuition.amount,
            currency: 'USD',
            description: 'tuition fee',
          },
        },
      }

      const cost = Number(tuition.amount) * 0.01

      const withdrawalObject = {
        schemaVersion: '1.0',
        requestId: uuidv4(),
        timestamp: Date.now(),
        channelName: 'WEB',
        serviceName: 'API_CREDITACCOUNT',
        serviceParams: {
          merchantUid: process.env.MERCHANT_U_ID,
          apiUserId: process.env.API_USER_ID,
          apiKey: process.env.API_KEY,
          paymentMethod: 'MWALLET_ACCOUNT',
          payerInfo: {
            accountNo: process.env.MERCHANT_NO,
            accountType: 'MERCHANT',
          },
          transactionInfo: {
            referenceId: uuidv4(),
            invoiceId:
              paymentDate.slice(0, 10).replace(/-/g, '') +
              tuition.student.rollNo +
              '-' +
              uuidv4().slice(1, 3),
            amount: Number(tuition.amount) - cost,
            currency: 'USD',
            description:
              '`withdrawal from mwallet account to merchant account ',
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
        tuition.isPaid = true
        tuition.paymentDate = paymentDate
        tuition.paymentMethod = 'mwallet_account'
        tuition.invoice =
          paymentDate.slice(0, 10).replace(/-/g, '') +
          tuition.student.rollNo +
          '-' +
          uuidv4().slice(1, 3)

        const updateObj = await tuition.save()
        if (updateObj) {
          await axios.post(`https://api.waafi.com/asm`, withdrawalObject)
          return res.status(201).json({ status: 'success' })
        }
      }
      if (Number(data.responseCode) !== 2001) {
        res.status(401)
        throw new Error('Payment has rejected to authorize')
      }
    } else {
      tuition.isPaid = true
      tuition.paymentDate = paymentDate
      tuition.invoice =
        paymentDate.slice(0, 10).replace(/-/g, '') + tuition.student.rollNo

      await tuition.save()
      return res.status(200).json(tuition)
    }
  }
})

handler.get(async (req, res) => {
  await dbConnect()

  const runningMonth = moment().subtract(0, 'months').format()
  const sixMonthsAgo = moment().subtract(6, 'months').format()
  const startOfMonth = moment(sixMonthsAgo).clone().startOf('month').format()
  const endOfMonth = moment(runningMonth).clone().endOf('month').format()

  let fee = await Tuition.find(
    {
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    },
    { amount: 1, createdAt: 1, isPaid: 1 }
  ).lean()

  let regFee = await RegFee.find(
    {
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    },
    { amount: 1, createdAt: 1 }
  ).lean()

  regFee = regFee.map((r) => ({
    isPaid: true,
    ...r,
  }))

  fee = fee.concat(regFee)

  const lastSixMonths = () => {
    let months = []
    moment().startOf('month')

    const arr = [...Array(6).keys()]

    arr.forEach((i) => {
      months.push(
        moment().startOf('month').subtract(i, 'month').format('MMMM YYYY')
      )
    })

    return months.reverse()
  }

  const month = (index, isPaid) => {
    const mth = []
    fee
      ?.filter(
        (f) =>
          moment(f.createdAt).format('MMMM YYYY') ===
          lastSixMonths().reverse()[index]
      )
      ?.map((m) => mth.push(m))

    return mth.reduce(
      (acc, curr) =>
        acc + Number(curr && curr.isPaid === isPaid && curr.amount),
      0
    )
  }

  const chartData = {
    totalCollected: [...Array(6).keys()].map((n) => month(n, true))?.reverse(),
    totalUnCollected: [...Array(6).keys()]
      .map((n) => month(n, false))
      ?.reverse(),
    lastSixMonths: lastSixMonths(),
  }

  res.status(200).send(chartData)
})

export default handler
