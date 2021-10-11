import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import Attendance from '../../../models/Attendance'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()
  const student = req.user.group === 'student' ? req.user.student : null

  if (student) {
    const startDate = new Date()
    const endDate = new Date()

    const start = moment(startDate).clone().startOf('month').format()
    const end = moment(endDate).clone().endOf('month').format()

    const attendances = await Attendance.find({
      'student.student': student,
      createdAt: { $gte: start, $lt: end },
    })

    const atts = attendances.map((a) =>
      a.student.filter((std) => std.student.toString() === student.toString())
    )

    let attends = []
    for (let i = 0; i < atts.length; i++) {
      for (let j = 0; j < atts[i].length; j++) {
        const el = atts[i][j]
        attends.push(el)
      }
    }

    const attend = attends.filter((a) => a.isAttended === true)
    const absent = attends.filter((a) => a.isAttended === false)

    return res.status(200).json({ attend, absent })
  } else {
    return res
      .status(404)
      .send(`Sorry, ${req.user.name} you are not authorized this request`)
  }
})

export default handler
