import nc from 'next-connect'
import dbConnect from '../../../../../utils/db'
import AssignCourse from '../../../../../models/AssignCourse'
import { isAdmin, isAuth } from '../../../../../utils/auth'
import Course from '../../../../../models/Course'

const handler = nc()

handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, courseType, course, student, shift } = req.body

  const exist = await AssignCourse.findOne({
    student,
    shift,
  })
  const exist2 = await AssignCourse.findOne({
    student,
    course,
  })
  if (exist || exist2) {
    return res
      .status(400)
      .send('This student has already taking a course in this shift')
  }
  const coursePrice = await Course.findById(course)

  const createObj = await AssignCourse.create({
    isActive,
    courseType,
    price: coursePrice.price,
    course,
    student,
    semester: 1,
    shift,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
