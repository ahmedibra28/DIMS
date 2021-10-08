import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Exam from '../../../models/Exam'
import AssignCourse from '../../../models/AssignCourse'
import AssignSubject from '../../../models/AssignSubject'
import Subject from '../../../models/Subject'
import { isAuth } from '../../../utils/auth'

const handler = nc()

handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()
  const {
    exam,
    subject,
    theoryMarks,
    practicalMarks,
    assignCourseId,
    courseId,
  } = req.body

  const assign = await AssignCourse.findOne({
    _id: assignCourseId,
    isActive: true,
    isGraduated: false,
  })

  const assignSub = await AssignSubject.findOne({
    subject,
    course: courseId,
    shift: assign.shift,
    semester: assign.semester,
    isActive: true,
  })
  if (!assignSub)
    res.status(400).send('There is no instructor with the subject you selected')

  const subjects = await Subject.findOne({
    _id: subject,
    isActive: true,
    course: courseId,
  })

  const prevExams = await Exam.find({
    subject,
    course: courseId,
    shift: assign.shift,
    semester: assign.semester,
    student: assign.student,
  })

  const checkExist = prevExams.map((e) => e.exam === exam)

  if (checkExist.includes(true)) {
    return res.status(400).send('Subject exam already taken')
  }
  if (prevExams.length > 0) {
    const totalPracticalMarks = prevExams.reduce(
      (acc, curr) => acc + Number(curr.practicalMarks),
      0
    )
    const totalTheoryMarks = prevExams.reduce(
      (acc, curr) => acc + Number(curr.theoryMarks),
      0
    )

    if (
      subjects.theoryMarks < Number(totalTheoryMarks) + Number(theoryMarks) ||
      subjects.practicalMarks <
        Number(totalPracticalMarks) + Number(practicalMarks)
    ) {
      return res
        .status(400)
        .send('Please check theory and practical marks you entered')
    } else {
      const createExam = await Exam.create({
        course: courseId,
        courseType: subjects.courseType,
        exam,
        subject,
        student: assign.student,
        instructor: assignSub.instructor,
        shift: assign.shift,
        semester: assign.semester,
        isActive: true,
        theoryMarks,
        practicalMarks,
      })
      if (createExam) {
        res.status(201).json({ status: 'success' })
      } else {
        return res.status(400).send('Something wrong with saving exam result')
      }
    }
  } else {
    if (
      subjects.theoryMarks < Number(theoryMarks) ||
      subjects.practicalMarks < Number(practicalMarks)
    ) {
      return res
        .status(400)
        .send('Please check theory and practical marks you entered')
    } else {
      const createExam = await Exam.create({
        course: courseId,
        courseType: subjects.courseType,
        exam,
        subject,
        student: assign.student,
        instructor: assignSub.instructor,
        shift: assign.shift,
        semester: assign.semester,
        isActive: true,
        theoryMarks,
        practicalMarks,
      })
      if (createExam) {
        res.status(201).json({ status: 'success' })
      } else {
        return res.status(400).send('Something wrong with saving exam result')
      }
    }
  }
})

export default handler
