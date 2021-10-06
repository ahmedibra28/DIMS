import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import AssignSubject from '../../../models/AssignSubject'
import { isAuth } from '../../../utils/auth'

const handler = nc()

handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()
  console.log(req.body)
  const { isActive, courseType, course, subject, instructor, semester, shift } =
    req.body

  res.status(201).json({ status: 'success' })

  // const exist = await AssignSubject.findOne({
  //   courseType,
  //   course,
  //   subject,
  //   shift,
  //   semester,
  // })
  // if (exist) {
  //   return res
  //     .status(400)
  //     .send('This subject has already assigned to a instructor')
  // }
  // const createObj = await AssignSubject.create({
  //   isActive,
  //   courseType,
  //   course,
  //   subject,
  //   instructor,
  //   semester,
  //   shift,
  // })

  // if (createObj) {
  //   res.status(201).json({ status: 'success' })
  // } else {
  //   return res.status(400).send('Invalid data')
  // }
})

export default handler
