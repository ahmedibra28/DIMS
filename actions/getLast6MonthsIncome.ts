'use server'

import DateTime from '@/lib/dateTime'
import { prisma } from '@/lib/prisma.db'

export default async function getLast6MonthsIncome() {
  try {
    const months = Array.from({ length: 6 }, (_, i) =>
      DateTime().utc().subtract(5 - i, 'month')
    )

    return await Promise.all(
      months.map(async month => {
        const income = await prisma.transaction.aggregate({
          where: {
            paymentStatus: 'PAID',
            status: 'ACTIVE',
            createdAt: {
              gte: month.startOf('month').format(),
              lte: month.endOf('month').format(),
            },
          },
          _sum: {
            amount: true,
          },
        })

        return {
          month: month.format('MMM'),
          income: income._sum.amount || 0,
        }
      })
    )
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
