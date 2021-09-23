import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Course from '../../../../models/Course'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()

  const {
    isActive,
    courseType,
    price,
    duration,
    certificationIssued,
    enrolmentRequirement,
  } = req.body
  const exam = !Array.isArray(req.body.exam)
    ? req.body.exam.split(',')
    : req.body.exam

  const updatedBy = req.user.id
  const name = req.body.name.toLowerCase()
  const _id = req.query.id

  const obj = await Course.findById(_id)

  if (obj) {
    const exist = await Course.find({ _id: { $ne: _id }, name, courseType })
    if (exist.length === 0) {
      obj.name = name
      obj.courseType = courseType
      obj.price = price
      obj.duration = duration
      obj.certificationIssued = certificationIssued
      obj.enrolmentRequirement = enrolmentRequirement
      obj.exam = exam
      obj.isActive = isActive
      obj.updatedBy = updatedBy
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${name} Course already exist`)
    }
  } else {
    return res.status(404).send('Course not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Course.findById(_id)
  if (!obj) {
    return res.status(404).send('Course not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
