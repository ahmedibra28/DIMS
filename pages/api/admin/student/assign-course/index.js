import nc from 'next-connect'
import dbConnect from '../../../../../utils/db'
import AssignCourse from '../../../../../models/AssignCourse'
import { isAdmin, isAuth } from '../../../../../utils/auth'

const handler = nc()

handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
  await dbConnect()

  const {
    isActive,
    courseType,
    course,
    student,
    shift,
    semester,
    pctScholarship,
  } = req.body

  if (Number(pctScholarship) > 100 || Number(pctScholarship) < 0) {
    return res.status(400).send('Please check the percentage scholarship range')
  }

  const exist = await AssignCourse.findOne({
    student,
    shift,
    isActive: true,
  })
  const exist2 = await AssignCourse.findOne({
    student,
    course,
    isActive: true,
  })

  if (exist || exist2) {
    return res
      .status(400)
      .send('This student has already taking a course in this shift')
  }

  const createObj = await AssignCourse.create({
    isActive,
    pctScholarship,
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
