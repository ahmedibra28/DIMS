import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Notice from '../../../../models/Notice'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, description, title } = req.body
  const updatedBy = req.user.id

  const _id = req.query.id

  const obj = await Notice.findById(_id)

  if (obj) {
    const exist = await Notice.find({
      _id: { $ne: _id },
      title,
    })
    if (exist.length === 0) {
      obj.title = title
      obj.description = description
      obj.isActive = isActive
      obj.updatedBy = updatedBy
      await obj.save()

      res.send({ status: 'success' })
    } else {
      return res.status(400).send(`This ${title} already exist`)
    }
  } else {
    return res.status(404).send('Notice not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()
  return res
    .status(401)
    .send('Please contact your system administrator to do any delete operation')
  // const _id = req.query.id
  // const obj = await Notice.findById(_id)
  // if (!obj) {
  //   return res.status(404).send('Notice not found')
  // } else {
  //   await obj.remove()

  //   res.status(201).json({ status: 'success' })
  // }
})

export default handler
