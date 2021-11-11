import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import fileUpload from 'express-fileupload'
import { upload, deleteFile } from '../../../utils/fileManager'
import Resource from '../../../models/Resource'
import AssignSubject from '../../../models/AssignSubject'
export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(fileUpload())

handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()
  const {
    courseType,
    course,
    description,
    subject,
    semester,
    shift,
    isActive,
  } = req.body
  const _id = req.query.id
  const file = req.files && req.files.file
  const instructor = req.user.instructor

  const obj = await Resource.findById(_id)

  const assign = await AssignSubject.find({
    subject,
    instructor,
    shift,
    isActive: true,
  })

  if (assign.length === 0)
    return res.status(400).send('You do not belong the subject you selected')

  if (obj) {
    if (file) {
      const document = await upload({
        fileName: file,
        fileType: 'file',
        pathName: 'resource',
      })

      if (document) {
        if (obj && obj.file) {
          deleteFile({
            pathName: obj.file.filePath,
          })
        }
      }

      obj.isActive = isActive
      obj.courseType = courseType
      obj.course = course
      obj.description = description
      obj.subject = subject
      obj.instructor = instructor
      obj.semester = semester
      obj.shift = shift

      obj.file = {
        fileName: document.fullFileName,
        filePath: document.filePath,
      }

      await obj.save()
      res.json({ status: 'success' })
    } else {
      obj.isActive = isActive
      obj.courseType = courseType
      obj.course = course
      obj.subject = subject
      obj.instructor = instructor
      obj.description = description
      obj.semester = semester
      obj.shift = shift
      await obj.save()
      res.json({ status: 'success' })
    }
  } else {
    return res.status(404).send('Resource not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Resource.findById(_id)
  if (!obj) {
    return res.status(404).send('Resource not found')
  } else {
    if (obj.file) {
      deleteFile({
        pathName: obj.file.fileName,
      })
    }
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
