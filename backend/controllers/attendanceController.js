import asyncHandler from 'express-async-handler'
import InstructorModel from '../models/instructorModel.js'
import AssignToSubject from '../models/assignToSubjectModel.js'
import AssignToCourseModel from '../models/assignToCourseModel.js'
import AttendanceModel from '../models/attendanceModal.js'
import moment from 'moment'

export const getClassInfo = asyncHandler(async (req, res) => {
  const { course, semester, subject, shift } = req.body
  const instructor = req.user.email

  const instructorObj = await InstructorModel.findOne({
    email: instructor,
    isActive: true,
  })
  if (instructorObj) {
    const instructor = instructorObj._id
    const assignToSubjectObj = await AssignToSubject.findOne({
      instructor,
      isActive: true,
      subject,
      semester,
      shift,
    })
      .sort({ createdAt: -1 })
      .populate('instructor')
      .populate('subject')
    if (assignToSubjectObj) {
      const assignToCourseObj = await AssignToCourseModel.find({
        course,
        semester: assignToSubjectObj.semester,
        shift: assignToSubjectObj.shift,
        isGraduated: false,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .populate('student')
        .populate('course')

      res.status(201).json(assignToCourseObj)
    } else {
      res.status(400)
      throw new Error('Instructor does not belong the subject')
    }
  } else {
    res.status(400)
    throw new Error('Instructor not found')
  }
})

export const addAttendance = asyncHandler(async (req, res) => {
  const { attendedStudents, absentStudents, course, semester, shift, subject } =
    req.body

  const instructorObj = await InstructorModel.findOne({
    email: req.user.email,
    isActive: true,
  })

  if (instructorObj) {
    const instructor = instructorObj._id

    let start = moment().startOf('day')
    let end = moment().endOf('day')

    let students = [
      ...attendedStudents.map((x) => {
        return { student: x, isPresent: true }
      }),
      ...absentStudents.map((x) => {
        return { student: x, isPresent: false }
      }),
    ]

    const attendanceObj = await AttendanceModel.findOne({
      course,
      semester,
      shift,
      subject,
      instructor,
      createdAt: { $gte: start, $lt: end },
    })

    if (attendanceObj) {
      res.status(400)
      throw new Error('Attendance data already submitted')
    }

    const createObj = await AttendanceModel.create({
      student: students,
      course,
      semester,
      shift,
      subject,
      instructor,
      createdBy: req.user._id,
    })
    if (createObj) {
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error('Invalid data')
    }
  }
})

export const getAttendanceReport = asyncHandler(async (req, res) => {
  const { course, semester, subject, shift } = req.body
  const instructor = req.user.email

  const instructorObj = await InstructorModel.findOne({
    email: instructor,
    isActive: true,
  })

  let start = moment().startOf('day')
  let end = moment().endOf('day')

  if (instructorObj) {
    console.log({
      course,
      subject,
      semester,
      shift,
      instructor: instructorObj._id,
    })
    const attendanceObj = await AttendanceModel.find({
      course,
      subject,
      semester,
      shift,
      instructor: instructorObj._id,
      createdAt: { $gte: start, $lt: end },
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
