import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import Tuition from '../../../models/Tuition'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()
  const student = req.user.group === 'student' ? req.user.student : null

  if (student) {
    const fees = await Tuition.find({
      student,
      isPaid: false,
    })

    return res.status(200).json(fees)
  } else {
    return res
      .status(404)
      .send(`Sorry, ${req.user.name} you are not authorized this request`)
  }
})

export default handler
