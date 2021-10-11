import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import Tuition from '../../../models/Tuition'
import AssignCourse from '../../../models/AssignCourse'
import ClearanceCardGenerator from '../../../models/ClearanceCardGenerator'
import Student from '../../../models/Student'

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

    if (assign.length > 0) {
      let clearanceCardGenerator = []
      for (let i = 0; i < assign.length; i++) {
        const element = await ClearanceCardGenerator.find({
          courseType: assign[i].courseType,
          course: assign[i].course,
          semester: assign[i].semester,
          shift: assign[i].shift,
          isActive: true,
        }).populate('course', 'name')

        clearanceCardGenerator.push(element)
      }

      const fees = await Tuition.find({ isPaid: false, student })
      if (fees.length > 0) {
        return res
          .status(401)
          .send(`${req.user.name} you have to pay the fee tuition`)
      } else {
        const std = await Student.findById(student)
        return res
          .status(200)
          .json({ clearance: clearanceCardGenerator, student: std })
      }
    } else {
      return res.status(200).json([])
    }
  } else {
    return res
      .status(404)
      .send(`Sorry, ${req.user.name} you are not authorized this request`)
  }
})

export default handler
