import asyncHandler from 'express-async-handler'
import InstructorModel from '../models/instructorModel.js'
import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()

export const addInstructor = asyncHandler(async (req, res) => {
  const {
    isActive,
    placeOfBirth,
    dateOfBirth,
    nationality,
    gender,
    district,
    mobileNumber,
    qualification,
    contactFullName,
    contactMobileNumber,
    contactEmail,
    contactRelationship,
    experience,
    comment,
    fullName,
  } = req.body

  const createdBy = req.user.id
  const email = req.body.email.toLowerCase()
  const picture = req.files && req.files.picture

  const instructorIdNo = (await InstructorModel.countDocuments()) + 1

  const pictureFullName = picture && picture.name.split('.').shift()
  const pictureExtension = picture && picture.name.split('.').pop()
  const pictureName =
    picture && `${pictureFullName}-${Date.now()}.${pictureExtension}`
  const picturePath = `/uploads/instructorPicture/${pictureName}`

  const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.svg)$/i

  if (picture) {
    if (!allowedExtensions.exec(picture && pictureName)) {
      res.status(400)
      throw new Error('Invalid instructor picture type')
    }
  }

  if (!picture) {
    res.status(400)
    throw new Error('Instructor picture is required')
  }

  const exist = await InstructorModel.findOne({
    email,
    mobileNumber: { $eq: mobileNumber },
  })

  if (exist) {
    res.status(400)
    throw new Error(`This Instructor ${fullName} already exist`)
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

  const createObj = await InstructorModel.create({
    picture: picture && pictureData,
    instructorIdNo,
    isActive,
    fullName,
    email,
    placeOfBirth,
    dateOfBirth,
    nationality,
    gender,
    district,
    mobileNumber,
    qualification,
    contactFullName,
    contactMobileNumber,
    contactEmail,
    contactRelationship,
    experience,
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

export const updateInstructor = asyncHandler(async (req, res) => {
  const {
    isActive,
    placeOfBirth,
    dateOfBirth,
    nationality,
    gender,
    district,
    mobileNumber,
    qualification,
    contactFullName,
    contactMobileNumber,
    contactEmail,
    contactRelationship,
    experience,
    comment,
    fullName,
  } = req.body

  const updatedBy = req.user.id
  const email = req.body.email.toLowerCase()
  const _id = req.params.id

  const picture = req.files && req.files.picture

  const pictureFullName = picture && picture.name.split('.').shift()
  const pictureExtension = picture && picture.name.split('.').pop()
  const pictureName =
    picture && `${pictureFullName}-${Date.now()}.${pictureExtension}`
  const picturePath = `/uploads/instructorPicture/${pictureName}`

  const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.svg)$/i

  if (picture) {
    if (!allowedExtensions.exec(picture && pictureName)) {
      res.status(400)
      throw new Error('Invalid instructor picture type')
    }
  }

  const obj = await InstructorModel.findById(_id)

  if (obj) {
    const exist = await InstructorModel.find({
      _id: { $ne: _id },
      email,
      mobileNumber: { $eq: mobileNumber },
    })
    if (exist.length === 0) {
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
      obj.email = email
      obj.contactMobileNumber = contactMobileNumber
      obj.contactEmail = contactEmail
      obj.contactRelationship = contactRelationship
      obj.experience = experience
      obj.qualification = qualification
      obj.comment = comment
      obj.updatedBy = updatedBy

      await obj.save()
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error(`This instructor ${fullName} already exist`)
    }
  } else {
    res.status(400)
    throw new Error('Instructor not found')
  }
})

export const getInstructor = asyncHandler(async (req, res) => {
  let query = InstructorModel.find({})

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize
  const total = await InstructorModel.countDocuments()

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

export const getInstructorDetails = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await InstructorModel.findById(_id)
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
  if (obj) {
    res.status(201).json(obj)
  } else {
    res.status(400)
    throw new Error('Instructor not found')
  }
})

export const deleteInstructor = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await InstructorModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('Instructor not found')
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
