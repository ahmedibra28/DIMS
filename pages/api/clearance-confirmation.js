import nc from 'next-connect'
import dbConnect from '../../utils/db'
import { isAuth } from '../../utils/auth'
import Student from '../../models/Student'
import Tuition from '../../models/Tuition'
import AssignCourse from '../../models/AssignCourse'

const handler = nc()
handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()
  const { rollNo } = req.body
  // check if student si isScholarship

  const student = await Student.findOne(
    { rollNo: rollNo.toUpperCase() },
    { _id: 1 }
  )

  if (student) {
    const courses = await AssignCourse.find(
      { student: student._id, isGraduated: false },
      { course: 1, semester: 1, shift: 1, student: 1 }
    )
      .populate('course', ['name'])
      .populate('student', [
        'fullName',
        'picture',
        'rollNo',
        'gender',
        'mobileNumber',
      ])

    const tuition = await Tuition.find({ student: student._id, isPaid: false })

    if (tuition.length === 0) {
      return res.status(201).json(courses)
    } else {
      return res.status(401).json('Student has unpaid tuition')
    }
  } else {
    res.status(404).send('Sorry, student roll no does not exist')
  }
})

export default handler
