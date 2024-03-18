'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getTop10UnpaidStudents() {
  try {
    const students = await prisma.student.findMany({
      where: {
        status: 'ACTIVE',
        balance: {
          gt: 0,
        },
      },
      select: {
        id: true,
        name: true,
        rollNo: true,
        balance: true,
        mobile: true,
      },
      take: 10,
      orderBy: {
        balance: 'desc',
      },
    })

    return students
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
