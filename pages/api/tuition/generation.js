import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Tuition from '../../../models/Tuition'
import AssignCourse from '../../../models/AssignCourse'
import Course from '../../../models/Course'
import { isAuth } from '../../../utils/auth'
import moment from 'moment'

const handler = nc()

handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()

  const { courseType, course, shift } = req.body
  const semester = Number(req.body.semester)
  let paymentDate = moment(new Date()).format()
  const paymentMethod = 'on_cash'

  const courseData = await AssignCourse.find({
    course,
    courseType,
    semester,
    shift,
    isActive: true,
    isGraduated: false,
  })

  if (courseData.length === 0)
    return res
      .status(404)
      .send('No student in the semester or shift you selected')

  if (courseData.length > 0) {
    const allStudents = courseData
    const price = await Course.findById(course)

    const startOfMonth = moment(paymentDate).clone().startOf('month').format()
    const endOfMonth = moment(paymentDate).clone().endOf('month').format()

    const fee = await Tuition.find({
      semester,
      shift,
      course,
      courseType,
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    })

    if (fee.length > 0) {
      const paidStudents = fee.map((std) => std.student.toString())

      const unPaidStudents = allStudents.filter(
        (s) => !paidStudents.includes(s.student.toString())
      )

      if (unPaidStudents.length > 0) {
        const createObj = unPaidStudents.map(async (std) => {
          await Tuition.create({
            student: std.student,
            isPaid: Number(std.pctScholarship) === 0 ? true : false,
            amount: (Number(price.price) * (std.pctScholarship / 100)).toFixed(
              2
            ),
            paymentDate,
            paymentMethod,
            semester,
            shift,
            course,
            courseType,
            isActive: true,
          })
        })
        if (createObj) {
          res.status(201).json({ status: 'success' })
        } else {
          res.status(400).send('Invalid payment')
        }
      }
      if (unPaidStudents.length === 0) {
        res.status(400)
        throw new Error('There is no new tuition fee to generate')
      }
    }

    if (fee.length === 0) {
      const createObj = allStudents.map(async (std) => {
        await Tuition.create({
          student: std.student,
          isPaid: Number(std.pctScholarship) === 0 ? true : false,
          amount: (Number(price.price) * (std.pctScholarship / 100)).toFixed(2),
          paymentDate,
          paymentMethod,
          semester,
          shift,
          course,
          courseType,
          isActive: true,
        })
      })
      if (createObj) {
        res.status(201).json({ status: 'success' })
      } else {
        res.status(400).json('Invalid payment')
      }
    }
  }
})

export default handler
