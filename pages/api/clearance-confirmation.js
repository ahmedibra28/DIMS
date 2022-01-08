import nc from 'next-connect'
import dbConnect from '../../utils/db'
import { isAuth } from '../../utils/auth'
import Student from '../../models/Student'
import Tuition from '../../models/Tuition'

const handler = nc()
handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()
  const { rollNo } = req.body
  // check if student si isScholarship

  const student = await Student.findOne({ rollNo: rollNo.toUpperCase() })
  if (student) {
    const tuition = await Tuition.find({ student: student._id, isPaid: false })
    return res.status(201).json({ student, tuition })
  } else {
    res.status(404).send('Sorry, student roll no does not exist')
  }
})

export default handler
