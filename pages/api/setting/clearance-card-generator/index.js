import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import ClearanceCardGenerator from '../../../../models/ClearanceCardGenerator'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await ClearanceCardGenerator.find({})
    .sort({ createdAt: -1 })
    .populate('courseType', 'name')
    .populate('course', 'name')

  res.send(obj)
})

handler.use(isAdmin)
handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, courseType, course, semester, shift, exam, academic } =
    req.body

  const exist = await ClearanceCardGenerator.findOne({
    courseType,
    course,
    semester,
    shift,
  })
  if (exist) {
    return res.status(400).send('Clearance card generator already exist')
  }
  const createObj = await ClearanceCardGenerator.create({
    isActive,
    courseType,
    course,
    semester,
    shift,
    exam,
    academic,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
