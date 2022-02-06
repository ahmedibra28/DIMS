import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import Tuition from '../../../models/Tuition'
import Student from '../../../models/Student'

const handler = nc()
handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()
  const { student: rollNo, option } = req.body

  if (rollNo) {
    const student = await Student.findOne({ rollNo: rollNo.toUpperCase() })
    if (student) {
      const fees = await Tuition.find({ student: student._id })
        .sort({ createdAt: -1 })
        .populate('course', ['name'])
        .populate('student', ['fullName', 'rollNo'])

      const filtered =
        fees &&
        fees.filter(
          (f) =>
            (option === 'Paid' && f.isPaid === true) ||
            (option === 'unpaid' && f.isPaid === false) ||
            option === ''
        )

      return res.status(200).json(filtered)
    } else {
      return res.status(404).send(`Sorry, ${rollNo} does not exist`)
    }
  } else {
    return res.status(404).send(`Sorry, ${rollNo} does not exist`)
  }
})

export default handler
