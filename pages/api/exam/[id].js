import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Exam from '../../../models/Exam'
import AssignCourse from '../../../models/AssignCourse'
import { isAuth } from '../../../utils/auth'
import Subject from '../../../models/Subject'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()
  const { id: assignId } = req.query
  const assign = await AssignCourse.findById(assignId)

  const exams = await Exam.find({
    course: assign.course,
    courseType: assign.courseType,
    shift: assign.shift,
    semester: assign.semester,
    student: assign.student,
    isActive: true,
  })
    .sort({ subject: -1 })
    .populate('student', ['fullName', 'rollNo'])
    .populate('courseType', ['name'])
    .populate('course', ['name'])
    .populate('subject', ['name', 'theoryMarks', 'practicalMarks'])
    .populate('instructor', ['fullName'])

  res.status(200).json(exams)
})

handler.put(async (req, res) => {
  await dbConnect()

  const { subject, theoryMarks, practicalMarks, exam, courseId } = req.body
  const _id = req.query.id

  const obj = await Exam.findById(_id)

  if (obj) {
    const subjects = await Subject.findOne({
      _id: subject,
      isActive: true,
      course: courseId,
    })

    const exist = await Exam.find({
      _id: { $ne: _id },
      subject,
      shift: obj.shift,
      semester: obj.semester,
    })

    const checkExist = exist.map((e) => e.exam === exam)

    if (checkExist.includes(true)) {
      return res.status(400).send('Subject exam already taken')
    }

    if (exist.length === 0) {
      if (
        subjects.theoryMarks < Number(theoryMarks) ||
        subjects.practicalMarks < Number(practicalMarks)
      ) {
        return res
          .status(400)
          .send('Please check theory and practical marks you entered')
      } else {
        obj.theoryMarks = theoryMarks
        obj.practicalMarks = practicalMarks
        obj.subject = subject
        obj.exam = exam
        await obj.save()

        return res.json({ status: 'success' })
      }
    }

    const totalPracticalMarks = exist.reduce(
      (acc, curr) => acc + Number(curr.practicalMarks),
      0
    )
    const totalTheoryMarks = exist.reduce(
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
      obj.theoryMarks = theoryMarks
      obj.practicalMarks = practicalMarks
      obj.subject = subject
      obj.exam = exam

      const updateExam = await obj.save()

      if (updateExam) {
        res.status(201).json({ status: 'success' })
      } else {
        return res.status(400).send('Something wrong with saving exam result')
      }
    }
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Exam.findById(_id)
  if (!obj) {
    return res.status(404).send('Exam record not found')
  } else {
    await obj.remove()
    res.json({ status: 'success' })
  }
})

export default handler