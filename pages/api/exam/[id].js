import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Exam from '../../../models/Exam'
import AssignCourse from '../../../models/AssignCourse'
import { isAuth } from '../../../utils/auth'
// import Subject from '../../../models/Subject'

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
    .sort({ exam: -1 })
    .populate('student', ['fullName', 'rollNo'])
    .populate('courseType', ['name'])
    .populate('course', ['name'])
    .populate('subject', ['name', 'theoryMarks', 'practicalMarks'])
    .populate('instructor', ['fullName'])

  res.status(200).json(exams)
})

// handler.put(async (req, res) => {
//   await dbConnect()
//   const { subject, theoryMarks, practicalMarks, exam, courseId } = req.body
//   const _id = req.query.id

//   res.json({ status: 'success' })

//   const obj = await Exam.findById(_id)

//   if (obj) {
//     const subjects = await Subject.findOne({
//       _id: subject,
//       isActive: true,
//       course: courseId,
//     })

//     const prevExams = await Exam.find({
//       subject,
//       course: courseId,
//       shift: obj.shift,
//       semester: obj.semester,
//       student: obj.student,
//     })

//     const totalPracticalMarks = prevExams.reduce(
//       (acc, curr) => acc + Number(curr.practicalMarks),
//       0
//     )
//     const totalTheoryMarks = prevExams.reduce(
//       (acc, curr) => acc + Number(curr.theoryMarks),
//       0
//     )

//     if (
//       subjects.theoryMarks < Number(totalTheoryMarks) + Number(theoryMarks) ||
//       subjects.practicalMarks <
//         Number(totalPracticalMarks) + Number(practicalMarks)
//     ) {
//       return res
//         .status(400)
//         .send('Please check theory and practical marks you entered')
//     }

//   }

//   // if (obj) {
//   //   const exist = await Exam.find({
//   //     _id: { $ne: _id },
//   //     courseType,
//   //     course,
//   //     subject,
//   //     shift,
//   //     semester,
//   //   })
//   //   if (exist.length === 0) {
//   //     obj.subject = subject
//   //     obj.instructor = instructor
//   //     obj.semester = semester
//   //     obj.shift = shift
//   //     obj.isActive = isActive
//   //     obj.course = course
//   //     obj.courseType = courseType
//   //     await obj.save()

//   //     res.json({ status: 'success' })
//   //   } else {
//   //     return res.status(400).send(`This course already exist`)
//   //   }
//   // } else {
//   //   return res.status(404).send('Course not found')
//   // }
// })

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Exam.findById(_id)
  if (!obj) {
    return res.status(404).send('Exam record not found')
  } else {
    await obj.remove()
    res.json({ status: 'success' })
  }
})

export default handler
