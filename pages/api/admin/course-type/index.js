import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import CourseType from '../../../../models/CourseType'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await CourseType.find({}).sort({ createdAt: -1 })

  res.send(obj)
})

handler.use(isAdmin)
handler.post(async (req, res) => {
  await dbConnect()

  const { isActive } = req.body
  const createdBy = req.user.id
  const name = req.body.name.toLowerCase()

  const exist = await CourseType.findOne({ name })
  if (exist) {
    return res.status(400).send('Course type already exist')
  }
  const createObj = await CourseType.create({
    name,
    isActive,
    createdBy,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
