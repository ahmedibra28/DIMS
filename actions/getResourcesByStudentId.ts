'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getResourcesByStudentId({
  studentId,
}: {
  studentId: string
}) {
  try {
    if (!studentId) return null

    const courses = await prisma.assignCourse.findMany({
      where: {
        studentId,
        status: 'ACTIVE',
      },
      select: {
        semester: true,
        course: {
          select: {
            id: true,
            name: true,
            subject: {
              select: {
                id: true,
                semester: true,
                name: true,
                resources: {
                  select: {
                    file: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    let resources = courses
      ?.map(item => {
        const { course, semester } = item
        return {
          ...item,
          course: {
            ...course,
            subject: course?.subject
              ?.filter(sub => sub.semester === semester)
              ?.map(sub => sub.resources?.length > 0 && sub)
              ?.filter(Boolean),
          },
        }
      })
      ?.filter(course => course?.course?.subject?.length > 0)

    return resources
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
