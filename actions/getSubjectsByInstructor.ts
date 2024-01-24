'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getSubjectsByInstructor({
  instructorId,
}: {
  instructorId: string
}) {
  try {
    console.log('--------', instructorId)
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
          },
        },
      },
    })

    console.log(subjects)

    return subjects
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
