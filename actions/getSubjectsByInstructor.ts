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

    return subjects
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
