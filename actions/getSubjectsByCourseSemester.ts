'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getSubjectsByCourseSemester({
  courseId,
  semester,
}: {
  courseId: string
  semester: string
}) {
  try {
    if (!courseId || !semester) return []

    const subjects = await prisma.subject.findMany({
      where: {
        semester: parseInt(semester),
        courseId: `${courseId}`,
      },
    })

    return subjects
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
