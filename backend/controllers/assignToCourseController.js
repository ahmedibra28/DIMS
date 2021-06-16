import asyncHandler from 'express-async-handler'
import AssignToCourseModel from '../models/assignToCourseModel.js'
import CourseModel from '../models/courseModel.js'
import MarksModel from '../models/marksModel.js'

export const addAssignToCourse = asyncHandler(async (req, res) => {
  const { isActive, course, semester, shift, dateOfAdmission, status } =
    req.body.data
  const student = req.body.paramId
  const createdBy = req.user.id

  const exist = await AssignToCourseModel.findOne({
    student,
    semester,
    course: { $eq: course },
  })

  const coursePrice = await CourseModel.findById(course)

  if (exist) {
    res.status(400)
    throw new Error('Student has already taken the course')
  }
  const createObj = await AssignToCourseModel.create({
    isActive,
    course,
    student,
    semester,
    shift,
    dateOfAdmission,
    status,
    createdBy,
    price: coursePrice.price,
  })
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

export const updateAssignToCourse = asyncHandler(async (req, res) => {
  const {
    isActive,
    course,
    student,
    semester,
    shift,
    dateOfAdmission,
    status,
  } = req.body

  const updatedBy = req.user.id
  const _id = req.params.id

  const obj = await AssignToCourseModel.findById(_id)
  const coursePrice = await CourseModel.findById(course)

  if (obj) {
    const exist = await AssignToCourseModel.find({
      _id: { $ne: _id },
      student,
      semester,
      course: { $eq: course },
    })
    if (exist.length === 0) {
      obj.updatedBy = updatedBy
      obj.isActive = isActive
      obj.course = course
      obj.student = student
      obj.semester = semester
      obj.shift = shift
      obj.dateOfAdmission = dateOfAdmission
      obj.status = status
      obj.price = coursePrice.price

      await obj.save()
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error('Student has already taken the course')
    }
  } else {
    res.status(400)
    throw new Error('AssignToCourse not found')
  }
})

export const getAssignToCourse = asyncHandler(async (req, res) => {
  const obj = await AssignToCourseModel.find({ student: req.params.id })
    .sort({ createdAt: -1 })
    .populate('student')
    .populate('course')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
  res.status(201).json(obj)
})

export const deleteAssignToCourse = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await AssignToCourseModel.findById(_id)

  if (!obj) {
    res.status(400)
    throw new Error('student course not found')
  } else {
    await MarksModel.find({
      course: obj.course,
      semester: obj.semester,
      shift: obj.shift,
      student: obj.student,
    }).deleteMany()
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
