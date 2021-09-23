import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Subject from '../../../../models/Subject'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Subject.find({})
    .sort({ createdAt: -1 })
    .populate('courseType', 'name')
    .populate('course', 'name')

  res.send(obj)
})

handler.use(isAdmin)
handler.post(async (req, res) => {
  await dbConnect()

  const {
    isActive,
    courseType,
    course,
    semester,
    theoryMarks,
    practicalMarks,
  } = req.body
  const createdBy = req.user.id
  const name = req.body.name.toLowerCase()

  const exist = await Subject.findOne({ name, courseType, course, semester })
  if (exist) {
    return res.status(400).send('Subject already exist')
  }
  const createObj = await Subject.create({
    name,
    isActive,
    createdBy,
    courseType,
    course,
    semester,
    theoryMarks,
    practicalMarks,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
