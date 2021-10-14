import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Resource from '../../../models/Resource'
import { isAuth } from '../../../utils/auth'
import fileUpload from 'express-fileupload'
import { upload } from '../../../utils/fileManager'
import AssignSubject from '../../../models/AssignSubject'
export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(fileUpload())

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Resource.find({ student: req.query.id })
    .sort({ createdAt: -1 })
    .populate('student', 'fullName')
    .populate('courseType', 'name')
    .populate('subject', 'name')
    .populate('course', ['name', 'price', 'duration', 'isActive'])

  res.send(obj)
})

handler.post(async (req, res) => {
  await dbConnect()
  const {
    courseType,
    course,
    subject,
    description,
    semester,
    shift,
    isActive,
  } = req.body
  const instructor = req.user.instructor

  const assign = await AssignSubject.find({
    subject,
    instructor,
    shift,
    isActive: true,
  })

  if (assign.length === 0)
    return res.status(400).send('You do not belong the subject you selected')

  const file = req.files && req.files.file

  if (!file) return res.status(400).send('File upload is required')

  if (file) {
    const document = await upload({
      fileName: file,
      fileType: 'file',
      pathName: 'resource',
    })

    if (document) {
      const createObj = await Resource.create({
        courseType,
        course,
        subject,
        instructor,
        semester,
        shift,
        description,
        isActive,
        file: {
          fileName: document.fullFileName,
          filePath: document.filePath,
        },
      })

      if (createObj) {
        res.status(201).json({ status: 'success' })
      } else {
        return res.status(400).send('Invalid data')
      }
    }
  } else {
    const createObj = await Resource.create({
      courseType,
      course,
      subject,
      instructor,
      semester,
      shift,
      isActive,
    })

    if (createObj) {
      res.status(201).json({ status: 'success' })
    } else {
      return res.status(400).send('Invalid data')
    }
  }
})

export default handler
