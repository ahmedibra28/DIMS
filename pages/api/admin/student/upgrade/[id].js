import nc from 'next-connect'
import dbConnect from '../../../../../utils/db'
import { isAdmin, isAuth } from '../../../../../utils/auth'
import Student from '../../../../../models/Student'
import AssignCourse from '../../../../../models/AssignCourse'

const handler = nc()

handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()
  const _id = req.query.id
  const { isActive, isGraduated, courseType, course, student, shift } = req.body

  res.status(200).json({ status: _id })
})

export default handler
