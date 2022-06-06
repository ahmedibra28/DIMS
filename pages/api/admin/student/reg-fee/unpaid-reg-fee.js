import nc from 'next-connect'
import dbConnect from '../../../../../utils/db'
import Student from '../../../../../models/Student'
import { isAuth } from '../../../../../utils/auth'

const handler = nc()

handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()

  const unpaidStudents = await Student.find({
    isRegFeeRequired: true,
    isRegFeePaid: false,
  })

  res.send(unpaidStudents)
})
export default handler
