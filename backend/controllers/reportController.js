import asyncHandler from 'express-async-handler'
import InstructorModel from '../models/instructorModel.js'
import moment from 'moment'
import AttendanceModel from '../models/attendanceModal.js'
import StudentModel from '../models/studentModel.js'
import MarksModel from '../models/marksModel.js'
import AssignToCourseModel from '../models/assignToCourseModel.js'

export const getAttendanceReport = asyncHandler(async (req, res) => {
  const { course, semester, subject, shift, sDate, eDate } = req.body

  const instructor = req.user.email

  const instructorObj = await InstructorModel.findOne({
    email: instructor,
    isActive: true,
  })

  let endDate = moment(eDate)
  endDate = endDate.endOf('day')

  let startDate = moment(sDate)
  startDate = startDate.startOf('day')

  if (instructorObj) {
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

    res.status(201).json(attendanceObj)
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
    const assignToCourseObj = await AssignToCourseModel.findOne({
      course,
      student: studentObj._id,
      isActive: true,
      isGraduated: false,
    })

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

    if (obj.length > 0 && assignToCourseObj) {
      res.status(201).json({ obj, assignToCourseObj })
    } else {
      res.status(400)
      throw new Error('Student mark sheet were not found')
    }
  } else {
    res.status(400)
    throw new Error('Student record were not found')
  }
})
