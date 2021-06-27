import asyncHandler from 'express-async-handler'
import InstructorModel from '../models/instructorModel.js'
import moment from 'moment'
import AttendanceModel from '../models/attendanceModal.js'
import StudentModel from '../models/studentModel.js'
import MarksModel from '../models/marksModel.js'
import AssignToCourseModel from '../models/assignToCourseModel.js'
import User from '../models/userModel.js'

export const getAttendanceReport = asyncHandler(async (req, res) => {
  const { course, semester, subject, shift, student, sDate, eDate } = req.body

  const instructor = req.user.email

  const user = await User.findOne({ email: instructor })

  const isAdmin = user.roles.includes('Admin')

  const instructorObj = await InstructorModel.findOne({
    email: instructor,
    isActive: true,
  })

  let endDate = moment(eDate)
  endDate = endDate.endOf('day')

  let startDate = moment(sDate)
  startDate = startDate.startOf('day')

  if (instructorObj || isAdmin) {
    const studentObj = await StudentModel.findOne({
      studentIdNo: student,
      isActive: true,
    })

    const studentId = studentObj && studentObj._id

    if (isAdmin) {
      const attendanceObj = await AttendanceModel.find({
        course,
        subject,
        semester,
        shift,
        createdAt: { $gte: startDate.format(), $lt: endDate.format() },
      })
        .sort({ createdAt: -1 })
        .populate('instructor')
        .populate('course')
        .populate('student.student')
        .populate('subject')

      res.status(201).json({ attendanceObj, studentId })
    } else {
      const attendanceObj = await AttendanceModel.find({
        course,
        subject,
        semester,
        shift,
        instructor: instructorObj._id,
        createdAt: { $gte: startDate.format(), $lt: endDate.format() },
      })
        .sort({ createdAt: -1 })
        .populate('instructor')
        .populate('course')
        .populate('student.student')
        .populate('subject')

      if (attendanceObj.length === 0) {
        res.status(400)
        throw new Error(
          'The attendance record you are looking for were not found'
        )
      }
      res.status(201).json({ attendanceObj, studentId })
    }
  } else {
    res.status(400)
    throw new Error('The attendance record you are looking for were not found')
  }
})

export const getCompleteMarkSheetReport = asyncHandler(async (req, res) => {
  const { student, course } = req.body

  const studentObj = await StudentModel.findOne({
    studentIdNo: student,
    isActive: true,
  })

  if (studentObj) {
    // const assignToCourseObj = await AssignToCourseModel.findOne({
    //   course,
    //   student: studentObj._id,
    //   isActive: true,
    //   isGraduated: false,
    // })

    const obj = await MarksModel.find({
      student: studentObj._id,
      course,
    })
      .populate('subject')
      .populate('course')
      .populate('student')
      .populate('instructor')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')

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
      var unique = filtered(obj)

      res.status(201).json(unique)
    } else {
      res.status(400)
      throw new Error('Student mark sheet were not found')
    }
  } else {
    res.status(400)
    throw new Error('Student record were not found')
  }
})
