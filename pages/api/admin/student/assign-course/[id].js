import nc from 'next-connect'
import dbConnect from '../../../../../utils/db'
import AssignCourse from '../../../../../models/AssignCourse'
import { isAdmin, isAuth, isSuperAdmin } from '../../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()

  const obj = await AssignCourse.find({ student: req.query.id })
    .sort({ createdAt: -1 })
    .populate('student', 'fullName')
    .populate('courseType', 'name')
    .populate('course', ['name', 'price', 'duration', 'isActive'])

  res.send(obj)
})

handler.use(isAuth, isAdmin)
handler.put(async (req, res) => {
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

  const _id = req.query.id

  if (Number(pctScholarship) > 100 || Number(pctScholarship) < 0) {
    return res.status(400).send('Please check the percentage scholarship range')
  }

  const obj = await AssignCourse.findById(_id)

  if (obj) {
    const exist = await AssignCourse.find({
      _id: { $ne: _id },
      student,
      shift,
      isActive: true,
    })
    const exist2 = await AssignCourse.find({
      _id: { $ne: _id },
      student,
      course,
      isActive: true,
    })
    if (exist.length === 0 && exist2.length === 0) {
      obj.student = student
      obj.pctScholarship = pctScholarship
      obj.shift = shift
      obj.semester = semester
      obj.isActive = isActive
      obj.course = course
      obj.courseType = courseType
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res
        .status(400)
        .send(`This student has already taking a course in this shift`)
    }
  } else {
    return res.status(404).send('Course not found')
  }
})

handler.use(isSuperAdmin)
handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await AssignCourse.findById(_id)
  if (!obj) {
    return res.status(404).send('Course not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
