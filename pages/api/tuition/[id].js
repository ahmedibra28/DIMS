import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Tuition from '../../../models/Tuition'
import { isAuth, isSuperAdmin } from '../../../utils/auth'

const handler = nc()

handler.use(isAuth, isSuperAdmin)
handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Tuition.findById(_id)
  if (!obj) {
    return res.status(404).send('Invalid Ref No')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
