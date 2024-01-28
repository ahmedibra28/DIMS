'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getExamsByAssignCourseId({
  assignCourseId,
}: {
  assignCourseId: string
}) {
  try {
    if (!assignCourseId) return null

    const assignCourse = await prisma.assignCourse.findUnique({
      where: {
        id: assignCourseId,
      },
      select: {
        semester: true,
        course: {
          select: {
            id: true,
            examinations: true,
          },
        },
      },
    })

    const subjects = await prisma.subject.findMany({
      where: {
        courseId: assignCourse?.course?.id,
        semester: assignCourse?.semester,
      },
      select: {
        id: true,
        name: true,
      },
    })

    return { ...assignCourse, subjects }
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
