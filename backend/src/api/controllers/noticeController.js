import asyncHandler from 'express-async-handler'
import NoticeModel from '../models/noticeModel.js'

export const addNotice = asyncHandler(async (req, res) => {
  const createdBy = req.user.id
  const { title, description, isActive } = req.body

  const createObj = await NoticeModel.create({
    title,
    description,
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

export const updateNotice = asyncHandler(async (req, res) => {
  const updatedBy = req.user.id
  const { title, description, isActive } = req.body
  const _id = req.params.id

  const obj = await NoticeModel.findById(_id)

  if (obj) {
    obj.title = title
    obj.description = description
    obj.isActive = isActive
    obj.updatedBy = updatedBy
    await obj.save()
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Notice  not found')
  }
})

export const getNotice = asyncHandler(async (req, res) => {
  const obj = await NoticeModel.find({})
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
  res.status(201).json(obj)
})

export const deleteNotice = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await NoticeModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('Notice not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
