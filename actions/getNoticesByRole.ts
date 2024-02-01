'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getNoticesByRole({ role }: { role: string }) {
  try {
    if (!role) return null

    const notices = await prisma.notice.findMany({
      where: {
        roles: {
          some: {
            type: role,
          },
        },
      },
      select: {
        id: true,
        title: true,
        note: true,
        createdAt: true,
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    })

    return notices
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
