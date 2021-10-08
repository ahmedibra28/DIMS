import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Tuition from '../../../models/Tuition'
import { isAuth } from '../../../utils/auth'
import moment from 'moment'

const handler = nc()

handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()

  const { courseType, course, shift } = req.body
  const semester = Number(req.body.semester)
  let paymentDate = moment(new Date()).format()

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

  const paymentDate = moment(new Date()).format()

  const tuition = await Tuition.findOne({
    _id: req.body._id,
    isPaid: false,
  }).populate('student', 'rollNo')

  if (!tuition) {
    return res.status(404).send('Payment has not done successfully')
  } else {
    tuition.isPaid = true
    tuition.paymentDate = paymentDate
    tuition.invoice =
      paymentDate.slice(0, 10).replaceAll('-', '') + tuition.student.rollNo

    await tuition.save()
    return res.status(200).json(tuition)
  }
})

export default handler
