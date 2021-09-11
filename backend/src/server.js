import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import { notFound, errorHandler } from './api/middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import userRoutes from './api/routes/userRoutes.js'
import studentRoutes from './api/routes/studentRoutes.js'
import instructorRoutes from './api/routes/instructorRoutes.js'
import courseTypeRoutes from './api/routes/courseTypeRoutes.js'
import courseRoutes from './api/routes/courseRoutes.js'
import subjectRoutes from './api/routes/subjectRoutes.js'
import assignToCourseRoutes from './api/routes/assignToCourseRoutes.js'
import assignToSubjectRoutes from './api/routes/assignToSubjectRoutes.js'
import marksRoutes from './api/routes/marksRoutes.js'
import attendanceRoutes from './api/routes/attendanceRoutes.js'
import reportRoutes from './api/routes/reportRoutes.js'
import feeRoutes from './api/routes/feeRoutes.js'
import noticeRoutes from './api/routes/noticeRoutes.js'
import groupRoutes from './api/routes/groupRoutes.js'
import routeRoutes from './api/routes/routeRoutes.js'
import ticketRoutes from './api/routes/ticketRoutes.js'

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
app.use('/api/tickets', ticketRoutes)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
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
