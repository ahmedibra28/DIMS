'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getSponsorsById({
  sponsorId,
}: {
  sponsorId: string
}) {
  try {
    if (!sponsorId) return null

    const sponsor = await prisma.sponsor.findFirst({
      where: {
        id: `${sponsorId}`,
      },
      select: {
        name: true,
        id: true,
      },
    })

    return sponsor
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
