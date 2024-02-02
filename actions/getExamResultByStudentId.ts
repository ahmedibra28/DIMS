'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getExamResultByStudentId({
  studentId,
}: {
  studentId: string
}) {
  try {
    if (!studentId) return null

    const exams = await prisma.examination.findMany({
      where: {
        assignCourse: {
          studentId,
          status: 'ACTIVE',
        },
      },
      select: {
        id: true,
        examination: true,
        semester: true,
        theoryMarks: true,
        practicalMarks: true,
        subject: {
          select: {
            name: true,
            theoryMarks: true,
            practicalMarks: true,
            course: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        examination: 'asc',
      },
    })

    const transformedData: any[] = exams.reduce((result: any[], item) => {
      const existingCourseIndex = result.findIndex(
        course => course.course === item.subject.course.name
      )

      if (existingCourseIndex !== -1) {
        const existingCourse = result[existingCourseIndex]
        const existingSubjectIndex = existingCourse.subjects.findIndex(
          (subject: any) => subject.name === item.subject.name
        )

        if (existingSubjectIndex !== -1) {
          existingCourse.subjects[existingSubjectIndex].marks.push({
            examination: item.examination,
            theoryMarks: item.theoryMarks,
            practicalMarks: item.practicalMarks,
          })
        } else {
          existingCourse.subjects.push({
            name: item.subject.name,
            originalTheoryMarks: item.subject.theoryMarks,
            originalPracticalMarks: item.subject.practicalMarks,
            marks: [
              {
                examination: item.examination,
                theoryMarks: item.theoryMarks,
                practicalMarks: item.practicalMarks,
              },
            ],
          })
        }
      } else {
        result.push({
          course: item.subject.course.name,
          semester: item.semester,
          subjects: [
            {
              name: item.subject.name,
              originalTheoryMarks: item.subject.theoryMarks,
              originalPracticalMarks: item.subject.practicalMarks,
              marks: [
                {
                  examination: item.examination,
                  theoryMarks: item.theoryMarks,
                  practicalMarks: item.practicalMarks,
                },
              ],
            },
          ],
        })
      }

      return result
    }, [])

    return transformedData
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
