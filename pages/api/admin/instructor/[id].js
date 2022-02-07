import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import { isAdmin, isAuth, isSuperAdmin } from '../../../../utils/auth'
import fileUpload from 'express-fileupload'
import { upload, deleteFile } from '../../../../utils/fileManager'
import Instructor from '../../../../models/Instructor'
import AssignSubject from '../../../../models/AssignSubject'
export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(fileUpload())

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const instructor = await Instructor.findById(req.query.id)
  res.send(instructor)
})

handler.use(isAuth, isAdmin)
handler.put(async (req, res) => {
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
  const _id = req.query.id
  const picture = req.files && req.files.picture

  const obj = await Instructor.findById(_id)

  if (obj) {
    const exist = await Instructor.find({
      _id: { $ne: _id },
      fullName,
      mobileNumber,
    })
    if (exist.length === 0) {
      if (picture) {
        const profile = await upload({
          fileName: picture,
          fileType: 'image',
          pathName: 'instructor',
        })
        if (profile) {
          if (obj && obj.picture) {
            deleteFile({
              pathName: obj.picture.pictureName,
            })
          }
        }

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
        obj.picture = {
          pictureName: profile.fullFileName,
          picturePath: profile.filePath,
        }

        await obj.save()
        res.json({ status: 'success' })
      } else {
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
        obj.comment = comment
        await obj.save()
        res.json({ status: 'success' })
      }
    } else {
      return res.status(400).send(`This ${fullName} instructor already exist`)
    }
  } else {
    return res.status(404).send('Instructor not found')
  }
})

handler.use(isSuperAdmin)
handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Instructor.findById(_id)
  if (!obj) {
    return res.status(404).send('Instructor not found')
  } else {
    if (obj.picture) {
      deleteFile({
        pathName: obj.picture.pictureName,
      })
    }

    await AssignSubject.deleteMany({ instructor: _id })
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
