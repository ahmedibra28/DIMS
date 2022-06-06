import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Student from '../../../../models/Student'
import { isAdmin, isAuth } from '../../../../utils/auth'
import fileUpload from 'express-fileupload'
import { upload } from '../../../../utils/fileManager'
import autoIncrement from '../../../../utils/autoIncrement'
export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(fileUpload())

handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()

  const rollNo = req.query && req.query.search
  let query = Student.find(rollNo ? { rollNo: rollNo.toUpperCase() } : {})
  const total = await Student.countDocuments(
    rollNo ? { rollNo: rollNo.toUpperCase() } : {}
  )

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize

  const pages = Math.ceil(total / pageSize)

  query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 })

  const result = await query

  res.send({
    startIndex: skip + 1,
    endIndex: skip + result.length,
    count: result.length,
    page,
    pages,
    total,
    data: result,
  })
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
    isRegFeeRequired,
  } = req.body

  const languageSkills = {
    somali,
    arabic,
    english,
    kiswahili,
  }

  const fullName = req.body.fullName.toLowerCase()
  const picture = req.files && req.files.picture

  const lastRecord = await Student.findOne(
    {},
    { rollNo: 1 },
    { sort: { createdAt: -1 } }
  )

  const rollNo = lastRecord
    ? autoIncrement(lastRecord.rollNo)
    : autoIncrement('STD000000')

  const exist = await Student.findOne({ fullName, mobileNumber })
  if (exist) {
    return res.status(400).send('Student already exist')
  }
  if (picture) {
    const profile = await upload({
      fileName: picture,
      fileType: 'image',
      pathName: 'student',
    })

    if (profile) {
      const createObj = await Student.create({
        isActive,
        rollNo,
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
        fullName,
        languageSkills,
        comment,
        picture: {
          pictureName: profile.fullFileName,
          picturePath: profile.filePath,
        },
        isRegFeeRequired,
        isRegFeePaid: isRegFeeRequired ? false : true,
      })

      if (createObj) {
        res.status(201).json({ status: 'success' })
      } else {
        return res.status(400).send('Invalid data')
      }
    }
  } else {
    return res.status(400).send('Please upload a student photo')
  }
})

export default handler
