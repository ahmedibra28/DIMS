'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getCoursesById({ id }: { id: string }) {
  try {
    if (!id) return null

    const course = await prisma.course.findFirst({
      where: {
        id,
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
