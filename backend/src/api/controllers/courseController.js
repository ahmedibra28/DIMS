import asyncHandler from 'express-async-handler'
import CourseModel from '../models/courseModel.js'

export const addCourse = asyncHandler(async (req, res) => {
  const {
    isActive,
    courseType,
    duration,
    noExam,
    certificationIssued,
    enrolmentRequirement,
    price,
  } = req.body
  const createdBy = req.user.id
  const name = req.body.name.toLowerCase()

  const exist = await CourseModel.findOne({
    name,
    courseType: { $eq: courseType },
  })

  if (exist) {
    res.status(400)
    throw new Error('Course already exist')
  }
  const createObj = await CourseModel.create({
    name,
    isActive,
    createdBy,
    courseType,
    duration,
    noExam,
    certificationIssued,
    enrolmentRequirement,
    price,
  })
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

export const updateCourse = asyncHandler(async (req, res) => {
  const {
    isActive,
    courseType,
    duration,
    noExam,
    certificationIssued,
    enrolmentRequirement,
    price,
  } = req.body

  const updatedBy = req.user.id
  const name = req.body.name.toLowerCase()
  const _id = req.params.id

  const obj = await CourseModel.findById(_id)

  if (obj) {
    const exist = await CourseModel.find({
      _id: { $ne: _id },
      name,
      courseType: { $eq: courseType },
    })
    if (exist.length === 0) {
      obj.name = name
      obj.isActive = isActive
      obj.updatedBy = updatedBy
      obj.courseType = courseType
      obj.duration = duration
      obj.noExam = noExam
      obj.certificationIssued = certificationIssued
      obj.enrolmentRequirement = enrolmentRequirement
      obj.price = price

      await obj.save()
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error(`This ${name} Course already exist`)
    }
  } else {
    res.status(400)
    throw new Error('Course not found')
  }
})

export const getCourse = asyncHandler(async (req, res) => {
  const obj = await CourseModel.find({})
    .sort({ createdAt: -1 })
    .populate('courseType', 'name')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
  res.status(201).json(obj)
})

export const deleteCourse = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await CourseModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('Course not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
