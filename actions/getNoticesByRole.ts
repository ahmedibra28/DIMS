'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getNoticesByRole({ role }: { role: string }) {
  try {
    if (!role) return null

    const notices = await prisma.notice.findMany({
      where: {
        ...(role !== 'SUPER_ADMIN' && { roles: { some: { type: role } } }),
        status: 'ACTIVE',
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
      orderBy: {
        createdAt: 'desc',
      },
      take: 4,
    })

    return notices
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
