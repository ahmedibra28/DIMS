import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import CourseType from '../../../../models/CourseType'
import { isAdmin, isAuth, isSuperAdmin } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()

  const isActive = req.body.isActive
  const updatedBy = req.user.id
  const name = req.body.name.toLowerCase()
  const _id = req.query.id

  const obj = await CourseType.findById(_id)

  if (obj) {
    const exist = await CourseType.find({ _id: { $ne: _id }, name })
    if (exist.length === 0) {
      obj.name = name
      obj.isActive = isActive
      obj.updatedBy = updatedBy
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${name} course type already exist`)
    }
  } else {
    return res.status(404).send('Course type not found')
  }
})

handler.use(isSuperAdmin)
handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await CourseType.findById(_id)
  if (!obj) {
    return res.status(404).send('Course type not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
