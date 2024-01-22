'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getCoursesById({
  courseId,
}: {
  courseId: string
}) {
  try {
    if (!courseId) return null

    const course = await prisma.course.findFirst({
      where: {
        id: `${courseId}`,
      },
      select: {
        duration: true,
      },
    })

    return course
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
