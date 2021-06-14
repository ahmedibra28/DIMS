import asyncHandler from 'express-async-handler'
import MarksModel from '../models/marksModel.js'
import InstructorModel from '../models/instructorModel.js'
import AssignToSubjectModel from '../models/assignToSubjectModel.js'
import AssignToCourseModel from '../models/assignToCourseModel.js'

import SubjectModel from '../models/subjectModel.js'

export const addMarks = asyncHandler(async (req, res) => {
  const {
    isActive,
    course,
    subject,
    student,

    theoryMarks,
    practicalMarks,
  } = req.body
  const createdBy = req.user.id
  const semester = Number(req.body.semester)
  const instructorData = await AssignToSubjectModel.find({ subject, semester })
  const instructor = instructorData[0].instructor

  const exist = await MarksModel.findOne({
    course,
    subject,
    semester,
    student,
  })

  if (exist) {
    res.status(400)
    throw new Error(`The marks already entered`)
  }
  const createObj = await MarksModel.create({
    isActive,
    course,
    subject,
    semester,
    student,
    instructor,
    theoryMarks,
    practicalMarks,
    createdBy,
  })
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

export const updateMarks = asyncHandler(async (req, res) => {
  const {
    isActive,
    course,
    subject,
    semester,
    student,
    instructor,
    theoryMarks,
    practicalMarks,
  } = req.body

  const updatedBy = req.user.id
  const _id = req.params.id

  const obj = await MarksModel.findById(_id)

  if (obj) {
    const exist = await MarksModel.find({
      _id: { $ne: _id },
      course,
      subject,
      semester,
      student,
    })
    if (exist.length === 0) {
      obj.isActive = isActive
      obj.course = course
      obj.subject = subject
      obj.semester = semester
      obj.student = student
      obj.instructor = instructor
      obj.theoryMarks = theoryMarks
      obj.practicalMarks = practicalMarks
      obj.updatedBy = updatedBy

      await obj.save()
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error(`The marks already entered`)
    }
  } else {
    res.status(400)
    throw new Error('Course not found')
  }
})

export const getMarks = asyncHandler(async (req, res) => {
  const obj = await MarksModel.find({ student: req.params.id })
    .sort({ createdAt: -1 })
    .populate('subject')
    .populate('course')
    .populate('student')
    .populate('instructor')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
  res.status(201).json(obj)
})

export const deleteMarks = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await MarksModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('Marks not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})

export const getMatchedStudents = asyncHandler(async (req, res) => {
  const { course, subject } = req.body
  const semester = Number(req.body.semester)

  // subject, course
  const subjectObj = await SubjectModel.find({
    _id: subject,
    semester,
    course,
  }).sort({ createdAt: -1 })

  const assignCourseObj = await AssignToCourseModel.find({
    course,
    semester,
    status: 'In-progress',
  })
    .sort({ createdAt: -1 })
    .populate('student')
    .populate('course')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')

  res.status(201).json({
    subjectModel: subjectObj,
    assignCourseModel: assignCourseObj,
  })
})
