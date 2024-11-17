'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getTransactionsByStudentId({
  studentId,
}: {
  studentId: string
}) {
  try {
    if (!studentId) return null

    const transactions = await prisma.transaction.findMany({
      where: {
        studentId,
        status: 'ACTIVE',
        type: {
          in: ['ENROLLMENT_FEE', 'TUITION_PAYMENT'],
        },
      },
      select: {
        id: true,
        amount: true,
        paymentStatus: true,
        type: true,
        shift: true,
        createdAt: true,
        updatedAt: true,
        student: {
          select: {
            name: true,
            rollNo: true,
          },
        },
        semester: true,
        course: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

    return transactions
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
