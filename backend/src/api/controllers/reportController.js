import asyncHandler from 'express-async-handler'
import InstructorModel from '../models/instructorModel.js'
import FeeModel from '../models/feeModel.js'
import moment from 'moment'
import AttendanceModel from '../models/attendanceModal.js'
import StudentModel from '../models/studentModel.js'
import MarksModel from '../models/marksModel.js'
import AssignToCourseModel from '../models/assignToCourseModel.js'
import User from '../models/userModel.js'

export const getAttendanceReport = asyncHandler(async (req, res) => {
  const { course, semester, subject, shift, student, sDate, eDate } = req.body

  const isAdmin = req.user.group === 'admin'

  const instructorObj = await InstructorModel.findOne({
    _id: req.user.instructor,
    isActive: true,
  })

  const startDate = moment(sDate).clone().startOf('day').format()
  const endDate = moment(eDate).clone().endOf('day').format()

  if (instructorObj || isAdmin) {
    const studentObj = await StudentModel.findOne({
      rollNo: student,
      isActive: true,
    })

    const studentId = studentObj && studentObj._id

    if (isAdmin) {
      const attendanceObj = await AttendanceModel.find({
        course,
        subject,
        semester,
        shift,
        createdAt: { $gte: startDate, $lt: endDate },
      })
        .sort({ createdAt: -1 })
        .populate('instructor')
        .populate('course')
        .populate('student.student')
        .populate('subject')

      res.status(201).json({ attendanceObj, studentId })
    }

    if (req.user.instructor) {
      const attendanceObj = await AttendanceModel.find({
        course,
        subject,
        semester,
        shift,
        instructor: req.user.instructor,
        createdAt: { $gte: startDate, $lt: endDate },
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
    rollNo: student,
    isActive: true,
  })

  if (studentObj) {
    const assignToCourseObj = await AssignToCourseModel.findOne({
      course,
      student: studentObj._id,
      isActive: false,
      isGraduated: true,
    })

    const graduateStatus = {
      isGraduated: assignToCourseObj ? true : false,
      graduateDate: assignToCourseObj ? assignToCourseObj.updatedAt : false,
    }

    // const aggregateDataObj = await MarksModel.aggregate([
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
      var markSheet = filtered(obj)

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

export const getCompleteFeeReport = asyncHandler(async (req, res) => {
  const { course, shift, sDate, eDate } = req.body
  const semester = Number(req.body.semester)
  const startDate = moment(sDate).clone().startOf('month').format()
  const endDate = moment(eDate).clone().endOf('month').format()

  const fee = await FeeModel.find({
    semester,
    shift,
    course,
    createdAt: { $gte: startDate, $lt: endDate },
  })
    .populate('payment.student')
    .populate('course')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
  if (!fee) {
    res.status(400)
    throw new Error(`The is no student fee report were found`)
  }
  res.status(200).json(fee)
})
