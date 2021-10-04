import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Notice from '../../../../models/Notice'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Notice.find({})
    .sort({ createdAt: -1 })
    .populate('createdBy', 'fullName')
    .populate('updatedBy', 'fullName')

  res.status(201).json(obj)
})

handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, description, title } = req.body
  const createdBy = req.user.id

  const exist = await Notice.findOne({ title })
  if (exist) {
    return res.status(400).send('Notice already exist')
  }
  const createObj = await Notice.create({
    description,
    title,
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
