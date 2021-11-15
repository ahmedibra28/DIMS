import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAdmin, isAuth } from '../../../utils/auth'
import Exam from '../../../models/Exam'
import AssignCourse from '../../../models/AssignCourse'
import Student from '../../../models/Student'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()
  const student = req.user.group === 'student' ? req.user.student : null

  if (student) {
    const assign = await AssignCourse.find({
      student,
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

handler.use(isAuth, isAdmin)
handler.post(async (req, res) => {
  const { student, course } = req.body

  const studentObj = await Student.findOne({
    rollNo: student,
    isActive: true,
  })

  if (studentObj) {
    const assignCourseObj = await AssignCourse.findOne({
      course,
      student: studentObj._id,
    })

    const graduateStatus = {
      isGraduated: assignCourseObj ? assignCourseObj.isGraduated : false,
      graduateDate: assignCourseObj
        ? assignCourseObj.isGraduated
          ? assignCourseObj.updatedAt
          : null
        : null,
    }

    // const aggregateDataObj = await Marks.aggregate([
    //   {
    //     $match: {
    //       student: studentObj._id,
    //       course: mongoose.Types.ObjectId(course),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'students',
    //       localField: 'student',
    //       foreignField: '_id',
    //       as: 'student',
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'subjects',
    //       localField: 'subject',
    //       foreignField: '_id',
    //       as: 'subject',
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'courses',
    //       localField: 'course',
    //       foreignField: '_id',
    //       as: 'course',
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         subject: '$subject',
    //         course: '$course',
    //         student: '$student',
    //         semester: '$semester',
    //       },
    //       totalTheoryMarks: { $sum: '$theoryMarks' },
    //       totalPracticalMarks: { $sum: '$practicalMarks' },
    //     },
    //   },
    // ])

    const obj = await Exam.find({
      student: studentObj._id,
      course,
    })
      .populate('subject')
      .populate('course')
      .populate('student')
      .populate('instructor')

    if (obj.length > 0) {
      const filtered = (arr) => {
        let seen = {},
          order = []

        arr.map((o) => {
          let _id = o.subject._id
          if (_id in seen) {
            let theoryMarks = seen[_id].theoryMarks + o.theoryMarks
            let practicalMarks = seen[_id].practicalMarks + o.practicalMarks
            seen[_id] = o
            seen[_id].theoryMarks = theoryMarks
            seen[_id].practicalMarks = practicalMarks
            order.push(order.splice(order.indexOf(_id), 1))
          } else {
            seen[_id] = o
            order.push(_id)
          }
        })
        return order.map((k) => {
          return seen[k]
        })
      }
      const markSheet = filtered(obj)

      res.status(201).json({ markSheet, graduateStatus })
    } else {
      res.status(400)
      throw new Error('Student mark sheet were not found')
    }
  } else {
    res.status(400)
    throw new Error('Student record were not found')
  }
})
export default handler
