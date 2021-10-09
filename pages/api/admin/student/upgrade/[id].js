import nc from 'next-connect'
import dbConnect from '../../../../../utils/db'
import { isAdmin, isAuth } from '../../../../../utils/auth'
import AssignCourse from '../../../../../models/AssignCourse'

const handler = nc()

handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()
  const _id = req.query.id
  const { courseType, course, student, shift, semester } = req.body

  const obj = await AssignCourse.findOne({
    _id,
    isActive: true,
    isGraduated: false,
    courseType,
    course,
    student,
    shift,
    semester,
  })
  if (obj) {
    if (Number(course.duration) === Number(obj.semester)) {
      obj.isGraduated = true
      obj.isActive = false
      await obj.save()
      res.status(201).json({ status: 'success' })
    } else {
      const createNewObj = await AssignCourse.create({
        courseType,
        course,
        student,
        semester: Number(semester) + 1,
        shift,
        isActive: true,
        isGraduated: false,
      })
      if (createNewObj) {
        obj.isActive = false
        await obj.save()
        res.status(201).json({ status: 'success' })
      }
    }
  } else {
    res.status(400).send('Already passed this course')
  }
})

export default handler
