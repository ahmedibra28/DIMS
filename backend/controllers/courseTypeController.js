import asyncHandler from 'express-async-handler'
import CourseTypeModel from '../models/courseTypeModel.js'

export const addCourseType = asyncHandler(async (req, res) => {
  const isActive = req.body.isActive
  const createdBy = req.user.id
  const name = req.body.name.toLowerCase()

  const exist = await CourseTypeModel.findOne({ name })
  if (exist) {
    res.status(400)
    throw new Error('CourseType already exist')
  }
  const createObj = await CourseTypeModel.create({
    name,
    isActive,
    createdBy,
  })
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

export const updateCourseType = asyncHandler(async (req, res) => {
  const isActive = req.body.isActive
  const updatedBy = req.user.id
  const name = req.body.name.toLowerCase()
  const _id = req.params.id

  const obj = await CourseTypeModel.findById(_id)

  if (obj) {
    const exist = await CourseTypeModel.find({ _id: { $ne: _id }, name })
    if (exist.length === 0) {
      obj.name = name
      obj.isActive = isActive
      obj.updatedBy = updatedBy
      await obj.save()
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error(`This ${name} Course Type already exist`)
    }
  } else {
    res.status(400)
    throw new Error('Course Type not found')
  }
})

export const getCourseType = asyncHandler(async (req, res) => {
  const obj = await CourseTypeModel.find({})
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
  res.status(201).json(obj)
})

export const deleteCourseType = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await CourseTypeModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('Course Type not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
