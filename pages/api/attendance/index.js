import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import AssignSubject from '../../../models/AssignSubject'
import AssignCourse from '../../../models/AssignCourse'
import Attendance from '../../../models/Attendance'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()
  const { courseType, course, subject, shift } = req.body
  const semester = Number(req.body.semester)
  const instructor = req.user.group === 'instructor' && req.user.instructor

  if (!instructor) {
    return res
      .status(400)
      .send(`${req.user.name}, your are not a instructor of this subject`)
  }

  const assign = await AssignSubject.find({
    courseType,
    course,
    semester,
    subject,
    shift,
    instructor,
    isActive: true,
  })

  const conceitedSubs = [].concat.apply(
    [],
    assign.map((a) => a.subject)
  )

  const newConceitedSubString = conceitedSubs.map((con) => con.toString())

  if (
    conceitedSubs.length === 0 ||
    !newConceitedSubString.includes(subject.toString())
  ) {
    return res
      .status(400)
      .send(`${req.user.name}, your are not a instructor of this subject`)
  }

  const obj = await AssignCourse.find({
    courseType,
    course,
    semester,
    shift,
    isGraduated: false,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .populate('student', 'name')
    .populate('courseType', 'name')
    .populate('course', 'name')
  if (obj.length === 0) {
    return res
      .status(404)
      .send('No students associated the classroom you selected')
  }

  if (obj.length > 0) {
    const startDate = moment(new Date()).clone().startOf('day').format()
    const endDate = moment(new Date()).clone().endOf('day').format()

    const attendance = await Attendance.findOne({
      courseType,
      course,
      semester,
      shift,
      instructor,
      subject,
      createdAt: { $gte: startDate, $lt: endDate },
    })

    if (!attendance) {
      const createObj = await Attendance.create({
        isActive: true,
        courseType,
        course,
        semester,
        shift,
        instructor,
        subject,
        student: obj.map(
          (std) => std.isActive && { student: std.student, isAttended: false }
        ),
      })

      if (createObj) {
        res.status(201).json(
          await Attendance.findOne({
            courseType,
            course,
            semester,
            shift,
            instructor,
            subject,
            createdAt: { $gte: startDate, $lt: endDate },
          })
            .populate('student.student')
            .populate('courseType', 'name')
            .populate('course', 'name')
            .populate('subject', 'name')
            .populate('instructor')
        )
      } else {
        return res.status(400).send('Invalid attendance generating')
      }
    } else {
      if (!attendance.isActive)
        return res.status(404).send('Todays attendance has already been taken')

      res.send(
        await Attendance.findOne({
          courseType,
          course,
          semester,
          shift,
          instructor,
          subject,
          createdAt: { $gte: startDate, $lt: endDate },
        })
          .populate('student.student')
          .populate('courseType', 'name')
          .populate('course', 'name')
          .populate('subject', 'name')
          .populate('instructor')
      )
    }
  }
})

export default handler
