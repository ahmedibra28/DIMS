'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getSubjectsByInstructor({
  instructorId,
}: {
  instructorId: string
}) {
  try {
    if (!instructorId) return []

    const subjects = await prisma.assignSubject.findMany({
      where: {
        instructorId: `${instructorId}`,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        semester: true,
        shift: true,
        subject: {
          select: {
            id: true,
            name: true,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    const activeCourses: any[] = []

    await Promise.all(
      subjects.map(async item => {
        const student = await prisma.assignCourse.findFirst({
          where: {
            semester: Number(item.semester),
            shift: `${item.shift}`,
            courseId: `${item.subject.course.id}`,
            status: 'ACTIVE',
          },
          select: {
            studentId: true,
          },
        })

        activeCourses.push({
          ...item,
          hasStudents: Boolean(student?.studentId),
        })
      })
    )

    return activeCourses
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
