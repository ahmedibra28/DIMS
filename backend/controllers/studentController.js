import asyncHandler from 'express-async-handler'
import StudentModel from '../models/studentModel.js'
import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()

export const addStudent = asyncHandler(async (req, res) => {
  const {
    isActive,
    placeOfBirth,
    dateOfBirth,
    nationality,
    gender,
    district,
    mobileNumber,
    levelOfEducation,
    contactFullName,
    contactMobileNumber,
    contactEmail,
    contactRelationship,
    somali,
    arabic,
    english,
    kiswahili,
    comment,
  } = req.body

  const createdBy = req.user.id
  const fullName = req.body.fullName.toLowerCase()
  const picture = req.files && req.files.picture

  let date = new Date()
  const studentIdNo =
    date.getFullYear() *
    (date.getMonth() + 1) *
    date.getHours() *
    date.getMinutes() *
    date.getSeconds()

  const pictureFullName = picture && picture.name.split('.').shift()
  const pictureExtension = picture && picture.name.split('.').pop()
  const pictureName =
    picture && `${pictureFullName}-${Date.now()}.${pictureExtension}`
  const picturePath = `/uploads/studentPicture/${pictureName}`

  const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.svg)$/i

  if (picture) {
    if (!allowedExtensions.exec(picture && pictureName)) {
      res.status(400)
      throw new Error('Invalid student picture type')
    }
  }

  if (!picture) {
    res.status(400)
    throw new Error('Student picture is required')
  }

  const exist = await StudentModel.findOne({
    fullName,
    mobileNumber: { $eq: mobileNumber },
  })

  if (exist) {
    res.status(400)
    throw new Error(`This Student ${fullName} already exist`)
  }

  picture &&
    picture.mv(path.join(__dirname, picturePath), (err) => {
      if (err) {
        res.status(500)
        throw new Error(err)
      }
    })

  const pictureData = picture && {
    pictureName,
    picturePath,
  }

  const languageSkills = {
    somali,
    arabic,
    english,
    kiswahili,
  }

  const createObj = await StudentModel.create({
    picture: picture && pictureData,
    studentIdNo,
    isActive,
    fullName,
    placeOfBirth,
    dateOfBirth,
    nationality,
    gender,
    district,
    mobileNumber,
    levelOfEducation,
    contactFullName,
    contactMobileNumber,
    contactEmail,
    contactRelationship,
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
    district,
    mobileNumber,
    levelOfEducation,
    contactFullName,
    contactMobileNumber,
    contactEmail,
    contactRelationship,
    somali,
    arabic,
    english,
    kiswahili,
    comment,
  } = req.body

  const updatedBy = req.user.id
  const fullName = req.body.fullName.toLowerCase()
  const _id = req.params.id

  const picture = req.files && req.files.picture

  const pictureFullName = picture && picture.name.split('.').shift()
  const pictureExtension = picture && picture.name.split('.').pop()
  const pictureName =
    picture && `${pictureFullName}-${Date.now()}.${pictureExtension}`
  const picturePath = `/uploads/studentPicture/${pictureName}`

  const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.svg)$/i

  if (picture) {
    if (!allowedExtensions.exec(picture && pictureName)) {
      res.status(400)
      throw new Error('Invalid student picture type')
    }
  }

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

      if (req.files) {
        obj.picture.picturePath &&
          req.files &&
          req.files.picture &&
          fs.unlink(path.join(__dirname, obj.picture.picturePath), (err) => {
            if (err) {
              res.status(500)
              throw new Error(err)
            }
          })
      }

      picture &&
        picture.mv(path.join(__dirname, picturePath), (err) => {
          if (err) {
            res.status(500)
            throw new Error(err)
          }
        })

      const pictureData = picture && {
        pictureName,
        picturePath,
      }

      const oldPictureData = !picture && {
        pictureName: obj.picture.pictureName,
        picturePath: obj.picture.picturePath,
      }

      obj.picture = picture ? pictureData : oldPictureData
      obj.isActive = isActive
      obj.placeOfBirth = placeOfBirth
      obj.dateOfBirth = dateOfBirth
      obj.nationality = nationality
      obj.gender = gender
      obj.district = district
      obj.mobileNumber = mobileNumber
      obj.contactFullName = contactFullName
      obj.fullName = fullName
      obj.contactMobileNumber = contactMobileNumber
      obj.contactEmail = contactEmail
      obj.contactRelationship = contactRelationship
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
  let query = StudentModel.find({})

  const page = parseInt(req.params.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize
  const total = await StudentModel.countDocuments()

  const pages = Math.ceil(total / pageSize)

  query = query
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 })
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

export const getStudentDetails = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await StudentModel.findById(_id)
    .sort({ createdAt: -1 })
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
    fs.unlink(path.join(__dirname, obj.picture.picturePath), (err) => {
      if (err) {
        res.status(500)
        throw new Error(err)
      }
    })
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
