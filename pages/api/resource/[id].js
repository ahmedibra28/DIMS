import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import { isAuth } from '../../../../utils/auth'
import fileUpload from 'express-fileupload'
import { upload, deleteFile } from '../../../../utils/fileManager'
import Resource from '../../../../models/Resource'
export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(fileUpload())

handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()
  const { courseType, course, subject, instructor, semester, shift, isActive } =
    req.body

  const _id = req.query.id
  const file = req.files && req.files.file

  const obj = await Resource.findById(_id)

  if (obj) {
    if (file) {
      if (obj && obj.file) {
        deleteFile({
          pathName: obj.file.filePath,
        })
      }

      const document = await upload({
        fileName: file,
        fileType: 'image',
        pathName: 'resource',
      })
      obj.isActive = isActive
      obj.courseType = courseType
      obj.course = course
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
        pathName: obj.file.filePath,
      })
    }
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
