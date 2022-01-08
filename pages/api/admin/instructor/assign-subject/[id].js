import nc from 'next-connect'
import dbConnect from '../../../../../utils/db'
import AssignSubject from '../../../../../models/AssignSubject'
import { isAdmin, isAuth } from '../../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()

  const obj = await AssignSubject.find({ instructor: req.query.id })
    .sort({ createdAt: -1 })
    .populate('instructor', 'fullName')
    .populate('courseType', 'name')
    .populate('course', 'name')
    .populate('subject', 'name')

  res.send(obj)
})

handler.use(isAuth, isAdmin)
handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, courseType, course, subject, instructor, semester, shift } =
    req.body

  const _id = req.query.id

  const obj = await AssignSubject.findById(_id)

  if (obj) {
    const exist = await AssignSubject.find({
      _id: { $ne: _id },
      courseType,
      course,
      subject,
      shift,
      semester,
    })
    if (exist.length === 0) {
      obj.subject = subject
      obj.instructor = instructor
      obj.semester = semester
      obj.shift = shift
      obj.isActive = isActive
      obj.course = course
      obj.courseType = courseType
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This course already exist`)
    }
  } else {
    return res.status(404).send('Course not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()
  return res
    .status(401)
    .send('Please contact your system administrator to do any delete operation')

  // const _id = req.query.id
  // const obj = await AssignSubject.findById(_id)
  // if (!obj) {
  //   return res.status(404).send('Course not found')
  // } else {
  //   await obj.remove()

  //   res.json({ status: 'success' })
  // }
})

export default handler
