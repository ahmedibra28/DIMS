import nc from 'next-connect'
import dbConnect from '../../../../../utils/db'
import AssignCourse from '../../../../../models/AssignCourse'
import { isAdmin, isAuth } from '../../../../../utils/auth'
import Student from '../../../../../models/Student'

const handler = nc()

handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, courseType, course, student, shift, semester } = req.body

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

  const isScholarship = await Student.findById(student, {
    isScholarship: 1,
  })
  const createObj = await AssignCourse.create({
    isActive,
    isScholarship: isScholarship.isScholarship ? true : false,
    courseType,
    course,
    student,
    semester,
    shift,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
