'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getClearanceCardByStudentId({
  studentId,
}: {
  studentId: string
}) {
  try {
    if (!studentId) return null

    const subjects = await prisma.assignCourse.findMany({
      where: {
        student: {
          id: studentId,
          balance: {
            lte: 0,
          },
        },
        course: {
          subject: {
            some: {
              hasActiveExam: true,
            },
          },
        },
      },
      select: {
        semester: true,
        shift: true,
        course: {
          select: {
            name: true,
            subject: {
              select: {
                name: true,
                examDescription: true,
                examDate: true,
                hasActiveExam: true,
              },
            },
          },
        },
        student: {
          select: {
            rollNo: true,
            image: true,
            name: true,
          },
        },
      },
    })

    const newSubjects =
      subjects?.map(subject => {
        const newSubject = subject.course.subject.filter(
          sub => sub.hasActiveExam
        )

        return {
          ...subject,
          course: {
            ...subject.course,
            subject: newSubject,
          },
        }
      }) || []

    return newSubjects
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
