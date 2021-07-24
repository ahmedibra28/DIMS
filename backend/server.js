import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import instructorRoutes from './routes/instructorRoutes.js'
import courseTypeRoutes from './routes/courseTypeRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import subjectRoutes from './routes/subjectRoutes.js'
import assignToCourseRoutes from './routes/assignToCourseRoutes.js'
import assignToSubjectRoutes from './routes/assignToSubjectRoutes.js'
import marksRoutes from './routes/marksRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import feeRoutes from './routes/feeRoutes.js'
import noticeRoutes from './routes/noticeRoutes.js'
import groupRoutes from './routes/groupRoutes.js'
import routeRoutes from './routes/routeRoutes.js'

dotenv.config()

connectDB()

const app = express()
app.use(fileUpload())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/instructors', instructorRoutes)
app.use('/api/courseTypes', courseTypeRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/assign-to-courses', assignToCourseRoutes)
app.use('/api/assign-to-subjects', assignToSubjectRoutes)
app.use('/api/marks', marksRoutes)
app.use('/api/attendances', attendanceRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/fees', feeRoutes)
app.use('/api/notices', noticeRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/routes', routeRoutes)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running ${process.env.NODE_ENV} mode on post ${PORT}`.yellow.bold
  )
)
