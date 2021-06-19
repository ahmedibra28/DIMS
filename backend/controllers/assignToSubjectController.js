import asyncHandler from 'express-async-handler'
import AssignToSubjectModel from '../models/assignToSubjectModel.js'

export const addAssignToSubject = asyncHandler(async (req, res) => {
  const { subject, semester, shift, dateOfAdmission, isActive } = req.body.data
  const instructor = req.body.paramId
  const createdBy = req.user.id

  const exist = await AssignToSubjectModel.findOne({
    shift,
    isActive: true,
    subject: { $eq: subject },
  })

  if (exist) {
    res.status(400)
    throw new Error('Instructor has already assigned this subject')
  }
  const createObj = await AssignToSubjectModel.create({
    subject,
    instructor,
    semester,
    shift,
    isActive,
    dateOfAdmission,
    createdBy,
  })
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

export const updateAssignToSubject = asyncHandler(async (req, res) => {
  const { subject, semester, shift, dateOfAdmission, instructor, isActive } =
    req.body

  const updatedBy = req.user.id
  const _id = req.params.id

  const obj = await AssignToSubjectModel.findById(_id)

  if (obj) {
    const exist = await AssignToSubjectModel.find({
      _id: { $ne: _id },
      isActive: true,
      shift,
      subject: { $eq: subject },
    })
    if (exist.length === 0) {
      obj.updatedBy = updatedBy
      obj.subject = subject
      obj.instructor = instructor
      obj.semester = semester
      obj.shift = shift
      obj.isActive = isActive
      obj.dateOfAdmission = dateOfAdmission

      await obj.save()
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error('Instructor has already taken the subject')
    }
  } else {
    res.status(400)
    throw new Error('AssignToSubject not found')
  }
})

export const getAssignToSubject = asyncHandler(async (req, res) => {
  const obj = await AssignToSubjectModel.find({ instructor: req.params.id })
    .sort({ createdAt: -1 })
    .populate('instructor')
    .populate('subject')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')

  res.status(201).json(obj)
})

export const deleteAssignToSubject = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await AssignToSubjectModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('instructor subject not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
