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
    semester,
    student,
    instructor,
    theoryMarks,
    practicalMarks,
  } = req.body
  const createdBy = req.user.id

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
  const obj = await MarksModel.find({})
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

export const getSubjectsByInstructor = asyncHandler(async (req, res) => {
  const email = req.params.id
  const objInstructor = await InstructorModel.findOne({ email })

  const obj = await AssignToSubjectModel.find({
    instructor: objInstructor._id,
  })
    .sort({ createdAt: -1 })
    .populate('instructor')
    .populate('subject')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')

  res.status(201).json(obj)
})

export const getStudentBySubjectInstructor = asyncHandler(async (req, res) => {
  const subjectObj = await SubjectModel.findById(req.body.subject)

  const assignToCourseObj = await AssignToCourseModel.find({
    course: subjectObj.course,
    semester: Number(req.body.semester),
  })
  console.log(Number(req.body.semester))

  let query = AssignToCourseModel.find({
    course: subjectObj.course,
    semester: Number(req.body.semester),
  })

  const page = parseInt(req.params.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize
  const total = await AssignToCourseModel.countDocuments()

  const pages = Math.ceil(total / pageSize)

  query = query
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate('student')
    .populate('course')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')

  const result = await query

  res.status(200).json({
    startIndex: skip + 1,
    endIndex: skip + result.length,
    count: result.length,
    page,
    pages,
    total,
    data: result,
  })
})
