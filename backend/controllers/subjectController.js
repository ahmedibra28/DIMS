import asyncHandler from 'express-async-handler'
import SubjectModel from '../models/subjectModel.js'

export const addSubject = asyncHandler(async (req, res) => {
  const { isActive, course, theoryMarks, practicalMarks } = req.body
  const createdBy = req.user.id
  const name = req.body.name.toLowerCase()

  const exist = await SubjectModel.findOne({
    name,
    course: { $eq: course },
  })

  if (exist) {
    res.status(400)
    throw new Error('Subject already exist')
  }
  const createObj = await SubjectModel.create({
    name,
    isActive,
    createdBy,
    course,
    theoryMarks,
    practicalMarks,
  })
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

export const updateSubject = asyncHandler(async (req, res) => {
  const { isActive, course, theoryMarks, practicalMarks } = req.body

  const updatedBy = req.user.id
  const name = req.body.name.toLowerCase()
  const _id = req.params.id

  const obj = await SubjectModel.findById(_id)

  if (obj) {
    const exist = await SubjectModel.find({
      _id: { $ne: _id },
      name,
      course: { $eq: course },
    })
    if (exist.length === 0) {
      obj.name = name
      obj.isActive = isActive
      obj.updatedBy = updatedBy
      obj.course = course
      obj.theoryMarks = theoryMarks
      obj.practicalMarks = practicalMarks

      await obj.save()
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error(`This ${name} subject already exist`)
    }
  } else {
    res.status(400)
    throw new Error('Subject not found')
  }
})

export const getSubject = asyncHandler(async (req, res) => {
  const obj = await SubjectModel.find({})
    .sort({ createdAt: -1 })
    .populate('course')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
  res.status(201).json(obj)
})

export const deleteSubject = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await SubjectModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('Subject not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
