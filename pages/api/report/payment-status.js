import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import Tuition from '../../../models/Tuition'
import Student from '../../../models/Student'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()
  const { rollNo, startDate, endDate } = req.body

  if (moment(startDate).isAfter(endDate)) {
    res.status(400).send('Start date cannot be greater than end date.')
    return
  }

  const start = moment(startDate).clone().startOf('month').format()
  const end = moment(endDate).clone().endOf('month').format()

  if (rollNo) {
    const student = await Student.findOne({ rollNo }, { _id: 1 })
    if (!student) {
      return res.status(400).send('Student not found')
    }

    const tuition = await Tuition.find({
      student: student._id,
      createdAt: { $gte: start, $lte: end },
    })
      .sort({ createdAt: -1 })
      .populate('course', ['name'])
      .populate('student', ['fullName', 'rollNo'])

    const unpaidNoFilter = tuition.filter((t) => !t.isPaid)
    const paidNoFilter = tuition.filter((t) => t.isPaid)
    const unpaidTotal = unpaidNoFilter.reduce((acc, curr) => {
      return acc + curr.amount
    }, 0)
    const paidTotal = paidNoFilter.reduce((acc, curr) => {
      return acc + curr.amount
    }, 0)
    const paymentInfo = {
      unpaidNo:
        unpaidNoFilter && unpaidNoFilter.length > 0
          ? unpaidNoFilter.length.toLocaleString(undefined, {
              minimumFractionDigits: 0,
            })
          : 0,
      paidNo:
        paidNoFilter && paidNoFilter.length > 0
          ? paidNoFilter.length.toLocaleString(undefined, {
              minimumFractionDigits: 0,
            })
          : 0,
      unpaidTotal: unpaidTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
      paidTotal: paidTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
    }

    res.status(200).send({ payments: tuition, paymentInfo })
  } else {
    const tuition = await Tuition.find({
      createdAt: { $gte: start, $lte: end },
    })
      .sort({ student: 1 })
      .populate('course', ['name'])
      .populate('student', ['fullName', 'rollNo'])

    const unpaidNoFilter = tuition.filter((t) => !t.isPaid)
    const paidNoFilter = tuition.filter((t) => t.isPaid)
    const unpaidTotal = unpaidNoFilter.reduce((acc, curr) => {
      return acc + curr.amount
    }, 0)
    const paidTotal = paidNoFilter.reduce((acc, curr) => {
      return acc + curr.amount
    }, 0)

    const paymentInfo = {
      unpaidNo:
        unpaidNoFilter && unpaidNoFilter.length > 0
          ? unpaidNoFilter.length.toLocaleString(undefined, {
              minimumFractionDigits: 0,
            })
          : 0,
      paidNo:
        paidNoFilter && paidNoFilter.length > 0
          ? paidNoFilter.length.toLocaleString(undefined, {
              minimumFractionDigits: 0,
            })
          : 0,
      unpaidTotal: unpaidTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
      paidTotal: paidTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
    }

    res.status(200).send({ payments: tuition, paymentInfo })
  }
})

export default handler
