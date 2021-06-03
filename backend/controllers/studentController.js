import asyncHandler from 'express-async-handler'
import StudentModel from '../models/studentModel.js'

export const addStudent = asyncHandler(async (req, res) => {
  const {
    isActive,
    placeOfBirth,
    dateOfBirth,
    nationality,
    gender,
    dateOfAdmission,
    district,
    mobileNumber,
    levelOfEducation,
    contactFullName,
    contactMobileNumber,
    contactEmail,
    contactRelationship,
    course,
    somali,
    arabic,
    english,
    kiswahili,
    comment,
  } = req.body
  const createdBy = req.user.id
  const fullName = req.body.fullName.toLowerCase()

  const exist = await StudentModel.findOne({
    fullName,
    mobileNumber: { $eq: mobileNumber },
  })

  if (exist) {
    res.status(400)
    throw new Error(`This Student ${fullName} already exist`)
  }

  const languageSkills = {
    somali,
    arabic,
    english,
    kiswahili,
  }

  const createObj = await StudentModel.create({
    isActive,
    fullName,
    placeOfBirth,
    dateOfBirth,
    nationality,
    gender,
    dateOfAdmission,
    district,
    mobileNumber,
    levelOfEducation,
    contactFullName,
    contactMobileNumber,
    contactEmail,
    contactRelationship,
    course,
    languageSkills,
    comment,
    createdBy,
  })
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

export const updateStudent = asyncHandler(async (req, res) => {
  const {
    isActive,
    placeOfBirth,
    dateOfBirth,
    nationality,
    gender,
    dateOfAdmission,
    district,
    mobileNumber,
    levelOfEducation,
    contactFullName,
    contactMobileNumber,
    contactEmail,
    contactRelationship,
    course,
    somali,
    arabic,
    english,
    kiswahili,
    comment,
  } = req.body

  const updatedBy = req.user.id
  const fullName = req.body.fullName.toLowerCase()
  const _id = req.params.id
  const obj = await StudentModel.findById(_id)

  if (obj) {
    const exist = await StudentModel.find({
      _id: { $ne: _id },
      fullName,
      mobileNumber: { $eq: mobileNumber },
    })
    if (exist.length === 0) {
      const languageSkills = {
        somali,
        arabic,
        english,
        kiswahili,
      }

      obj.isActive = isActive
      obj.placeOfBirth = placeOfBirth
      obj.dateOfBirth = dateOfBirth
      obj.nationality = nationality
      obj.gender = gender
      obj.dateOfAdmission = dateOfAdmission
      obj.district = district
      obj.mobileNumber = mobileNumber
      obj.contactFullName = contactFullName
      obj.fullName = fullName
      obj.contactMobileNumber = contactMobileNumber
      obj.contactEmail = contactEmail
      obj.contactRelationship = contactRelationship
      obj.course = course
      obj.languageSkills = languageSkills
      obj.levelOfEducation = levelOfEducation
      obj.comment = comment
      obj.updatedBy = updatedBy

      await obj.save()
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error(`This student ${fullName} already exist`)
    }
  } else {
    res.status(400)
    throw new Error('Student not found')
  }
})

export const getStudent = asyncHandler(async (req, res) => {
  const obj = await StudentModel.find({})
    .sort({ createdAt: -1 })
    .populate('course', 'name')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
  res.status(201).json(obj)
})

export const getStudentDetails = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await StudentModel.findById(_id)
    .sort({ createdAt: -1 })
    .populate('course', 'name')
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
  if (obj) {
    res.status(201).json(obj)
  } else {
    res.status(400)
    throw new Error('Student not found')
  }
})

export const deleteStudent = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await StudentModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('Student not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
