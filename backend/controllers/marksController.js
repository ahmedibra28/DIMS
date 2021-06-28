import asyncHandler from 'express-async-handler'
import MarksModel from '../models/marksModel.js'
import AssignToSubjectModel from '../models/assignToSubjectModel.js'
import AssignToCourseModel from '../models/assignToCourseModel.js'
import mongoose from 'mongoose'
import SubjectModel from '../models/subjectModel.js'

export const addMarks = asyncHandler(async (req, res) => {
  const {
    isActive,
    course,
    subject,
    student,
    shift,
    exam,
    theoryMarks,
    practicalMarks,
  } = req.body
  const createdBy = req.user.id
  const semester = Number(req.body.semester)
  const instructorData = await AssignToSubjectModel.find({
    subject,
    semester,
    shift,
    isActive: true,
  })
  if (!instructorData[0]) {
    res.status(400)
    throw new Error(`This subject did not assign to a instructor`)
  }
  const instructor = instructorData[0].instructor

  const exist = await MarksModel.findOne({
    course,
    subject,
    exam,
    semester,
    student,
    shift,
  })

  if (exist) {
    res.status(400)
    throw new Error(`The marks already entered`)
  }
  const createObj = await MarksModel.create({
    isActive,
    course,
    subject,
    exam,
    shift,
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
  const { course, subject, exam, shift, student, theoryMarks, practicalMarks } =
    req.body

  const semester = Number(req.body.semester)
  const updatedBy = req.user.id
  const _id = req.params.id

  const instructorData = await AssignToSubjectModel.find({
    subject,
    semester,
    shift,
    isActive: true,
  })
  if (!instructorData[0]) {
    res.status(400)
    throw new Error(`This subject did not assign to a instructor`)
  }
  const instructor = instructorData[0].instructor

  const obj = await MarksModel.findById(_id)

  if (obj) {
    const exist = await MarksModel.find({
      _id: { $ne: _id },
      course,
      subject,
      exam,
      semester,
      student,
      shift,
    })
    if (exist.length === 0) {
      obj.course = course
      obj.subject = subject
      obj.exam = exam
      obj.shift = shift
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
  const semesterNo = Number(req.params.semesterNo)
  const shift = req.params.shift
  const student = req.params.id

  const obj = await MarksModel.find({
    student,
    semester: semesterNo,
    shift,
  })
    .sort({ createdAt: -1 })
    .populate('subject')
    .populate('course')
    .populate('student')
    .populate('instructor')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')

  // console.log(obj)
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
