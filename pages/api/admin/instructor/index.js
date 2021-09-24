import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Instructor from '../../../../models/Instructor'
import { isAdmin, isAuth } from '../../../../utils/auth'
import fileUpload from 'express-fileupload'
import { upload } from '../../../../utils/fileManager'
export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(fileUpload())

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()
  if (req.user.instructor) {
    let query = Instructor.find({ _id: req.user.instructor })

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 50
    const skip = (page - 1) * pageSize
    const total = await Instructor.countDocuments({ _id: req.user.instructor })

    const pages = Math.ceil(total / pageSize)

    query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 })

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
  } else {
    let query = Instructor.find({})

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 50
    const skip = (page - 1) * pageSize
    const total = await Instructor.countDocuments()

    const pages = Math.ceil(total / pageSize)

    query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 })

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
  }
})

handler.use(isAdmin)
handler.post(async (req, res) => {
  await dbConnect()
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

  const email = req.body.email.toLowerCase()
  const picture = req.files && req.files.picture

  const instructorIdNo = (await Instructor.countDocuments()) + 1

  const exist = await Instructor.findOne({ email })
  if (exist) {
    return res.status(400).send('Instructor already exist')
  }
  if (picture) {
    const profile = await upload({
      fileName: picture,
      fileType: 'image',
      pathName: 'instructor',
    })

    if (profile) {
      const createObj = await Instructor.create({
        isActive,
        placeOfBirth,
        dateOfBirth,
        nationality,
        instructorIdNo,
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
        email,
        picture: {
          pictureName: profile.fullFileName,
          picturePath: profile.filePath,
        },
      })

      if (createObj) {
        res.status(201).json({ status: 'success' })
      } else {
        return res.status(400).send('Invalid data')
      }
    }
  } else {
    const createObj = await Instructor.create({
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
      instructorIdNo,
      contactEmail,
      contactRelationship,
      experience,
      comment,
      fullName,
      email,
    })

    if (createObj) {
      res.status(201).json({ status: 'success' })
    } else {
      return res.status(400).send('Invalid data')
    }
  }
})

export default handler
