import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Course from '../../../../models/Course'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Course.find({})
    .sort({ createdAt: -1 })
    .populate('courseType')

  res.send(obj)
})

handler.use(isAdmin)
handler.post(async (req, res) => {
  await dbConnect()

  const {
    isActive,
    courseType,
    price,
    duration,
    certificationIssued,
    enrolmentRequirement,
  } = req.body
  const exam = !Array.isArray(req.body.exam)
    ? req.body.exam.split(',')
    : req.body.exam

  const createdBy = req.user.id
  const name = req.body.name.toLowerCase()

  const exist = await Course.findOne({ name, courseType })
  if (exist) {
    return res.status(400).send('Course already exist')
  }
  const createObj = await Course.create({
    name,
    isActive,
    createdBy,
    courseType,
    price,
    duration,
    exam,
    certificationIssued,
    enrolmentRequirement,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
