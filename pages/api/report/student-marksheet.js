import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import Exam from '../../../models/Exam'
import AssignCourse from '../../../models/AssignCourse'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()
  const student = req.user.group === 'student' ? req.user.student : null

  if (student) {
    const assign = await AssignCourse.find({
      student,
      isActive: true,
      isGraduated: false,
    })

    let results = []
    for (let i = 0; i < assign.length; i++) {
      const element = await Exam.find({
        student: assign[i].student,
        semester: assign[i].semester,
        shift: assign[i].shift,
        course: assign[i].course,
      })
        .sort({ course: -1 })
        .populate('course', ['name'])
        .populate('subject', ['name', 'theoryMarks', 'practicalMarks'])
        .populate('student', ['fullName', 'rollNo'])
      results.push(element)
    }

    return res.status(200).json(results)
  } else {
    return res
      .status(404)
      .send(`Sorry, ${req.user.name} you are not authorized this request`)
  }
})

export default handler
