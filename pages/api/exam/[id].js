import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Exam from '../../../models/Exam'
import AssignCourse from '../../../models/AssignCourse'
import { isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()
  const { id: assignCourseId } = req.query
  const assign = await AssignCourse.findById(assignCourseId)

  const exams = await Exam.find({
    course: assign.course,
    courseType: assign.courseType,
    shift: assign.shift,
    semester: assign.semester,
    student: assign.student,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .populate('student', ['fullName', 'rollNo'])
    .populate('courseType', ['name'])
    .populate('course', ['name'])
    .populate('subject', ['name'])
    .populate('instructor', ['fullName'])

  res.status(200).json(exams)
})

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, courseType, course, subject, instructor, semester, shift } =
    req.body

  const _id = req.query.id
  res.json({ status: 'success' })

  // const obj = await AssignSubject.findById(_id)

  // if (obj) {
  //   const exist = await AssignSubject.find({
  //     _id: { $ne: _id },
  //     courseType,
  //     course,
  //     subject,
  //     shift,
  //     semester,
  //   })
  //   if (exist.length === 0) {
  //     obj.subject = subject
  //     obj.instructor = instructor
  //     obj.semester = semester
  //     obj.shift = shift
  //     obj.isActive = isActive
  //     obj.course = course
  //     obj.courseType = courseType
  //     await obj.save()

  //     res.json({ status: 'success' })
  //   } else {
  //     return res.status(400).send(`This course already exist`)
  //   }
  // } else {
  //   return res.status(404).send('Course not found')
  // }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  res.json({ status: 'success' })
  // const obj = await AssignSubject.findById(_id)
  // if (!obj) {
  //   return res.status(404).send('Course not found')
  // } else {
  //   await obj.remove()

  //   res.json({ status: 'success' })
  // }
})

export default handler
