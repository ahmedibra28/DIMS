import asyncHandler from 'express-async-handler'
import TicketModel from '../models/ticketModel.js'
import TicketActivationModel from '../models/ticketActivationModel.js'

export const addTicket = asyncHandler(async (req, res) => {
  const { ticket, course, description, isActive } = req.body
  const user = req.user.id

  const date = new Date()

  const startDate = moment(date).clone().startOf('month').format()
  const endDate = moment(date).clone().endOf('month').format()

  const exist = await TicketModel.find({ createdAt })

  const createObj = await TicketModel.create({
    ticket,
    description,
    course,
    isActive,
    user,
  })
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

export const updateTicket = asyncHandler(async (req, res) => {
  const updatedBy = req.user.id
  const { title, description, isActive } = req.body
  const _id = req.params.id

  const obj = await TicketModel.findById(_id)

  if (obj) {
    obj.title = title
    obj.description = description
    obj.isActive = isActive
    obj.updatedBy = updatedBy
    await obj.save()
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Ticket  not found')
  }
})

export const getTicket = asyncHandler(async (req, res) => {
  const obj = await TicketModel.find({})
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
  res.status(201).json(obj)
})

export const deleteTicket = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await TicketModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('Ticket not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})

// Ticket Activation
export const addTicketActivation = asyncHandler(async (req, res) => {
  const { course, subject, shift, semester, isActive } = req.body

  const exist = await TicketActivationModel.find({
    course,
    subject,
    shift,
    semester,
  })

  if (exist.length === 0) {
    const createObj = await TicketActivationModel.create({
      course,
      subject,
      shift,
      semester,
      isActive,
    })
    if (createObj) {
      const ticket = await TicketModel.findOne({ course })
      if (ticket) {
        await ticket.remove()
      }
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error('Invalid data')
    }
  } else {
    res.status(400)
    throw new Error('Subject ticket already exist, please update')
  }
})

export const updateTicketActivation = asyncHandler(async (req, res) => {
  const { isActive } = req.body

  const obj = await TicketActivationModel.findOne({
    _id: req.params.id,
  })

  if (obj) {
    obj.isActive = isActive
    await obj.save()
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Ticket activation  not found')
  }
})

export const getTicketActivation = asyncHandler(async (req, res) => {
  const obj = await TicketActivationModel.find({})
    .sort({ createdAt: -1 })
    .populate('course', 'name')
  res.status(201).json(obj)
})

export const deleteTicketActivation = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await TicketActivationModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('Ticket activation not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
