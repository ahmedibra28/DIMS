import nc from 'next-connect'
import dbConnect from '../../../../../utils/db'
import { isAuth } from '../../../../../utils/auth'
import Student from '../../../../../models/Student'
import RegFee from '../../../../../models/RegFee'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()
  const { id } = req.query
  const paymentDate = moment().format()

  const student = await Student.findById(id)

  if (!student) return res.status(404).send('Student not found')

  student.isRegFeePaid = true

  const invoice =
    paymentDate.slice(0, 10).replace(/-/g, '') +
    student.rollNo +
    '-' +
    uuidv4().slice(1, 3)

  const regFee = await RegFee.create({
    student: student._id,
    amount: 5,
    paymentMethod: 'on_cash',
    paymentDate,
    invoice,
  })

  if (regFee) {
    await student.save()
    res.status(200).send(student)
  } else {
    return res.status(500).send('Error while saving the transaction')
  }
})

export default handler
