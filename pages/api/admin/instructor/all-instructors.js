import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Instructor from '../../../../models/Instructor'
import { isAuth } from '../../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Instructor.find({}, { _id: 1, fullName: 1 })

  res.send(obj)
})

export default handler
