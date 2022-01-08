import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import Tuition from '../../../models/Tuition'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()
  const { courseType, course, shift, startDate, endDate } = req.body
  const semester = Number(req.body.semester)

  const start = moment(startDate).clone().startOf('month').format()
  const end = moment(endDate).clone().endOf('month').format()

  const s = new Date(startDate)
  const e = new Date(endDate)

  if (s > e) {
    return res.status(400).send('Please check the range of the date')
  }

  const access = req.user.group === 'admin' || 'finance'

  if (!access) {
    return res
      .status(400)
      .send(`${req.user.name}, your are not authorized to view this report`)
  }

  const tuition = await Tuition.find({
    courseType,
    course,
    semester,
    shift,
    createdAt: { $gte: start, $lt: end },
  })
    .sort({ createdAt: -1 })
    .populate('student', ['rollNo', 'fullName'])
    .populate('courseType', 'name')
    .populate('course', 'name')

  if (tuition.length === 0) {
    return res
      .status(400)
      .send(
        `There is not tuition record in this date ${start.slice(
          0,
          10
        )} - ${end.slice(0, 10)}`
      )
  } else {
    res.status(201).json(tuition)
  }
})

export default handler
