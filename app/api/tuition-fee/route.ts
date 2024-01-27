import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

import type {
  Status as IStatus,
  TransactionType as ITransactionType,
} from '@prisma/client'
import DateTime from '@/lib/dateTime'

export async function GET(req: Request) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const status = {
      ...(searchParams.get('status') && {
        status: searchParams.get('status')?.toUpperCase(),
      }),
    } as { status: IStatus }

    const startDate = DateTime(q).utc().startOf('month').toDate()
    const endDate = DateTime(q).utc().endOf('month').toDate()

    const query = q
      ? {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          type: 'TUITION_PAYMENT' as ITransactionType,
          ...status,
        }
      : { ...status, type: 'TUITION_PAYMENT' as ITransactionType }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.transaction.findMany({
        where: query,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              rollNo: true,
            },
          },
          course: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where: query }),
    ])

    const pages = Math.ceil(total / pageSize)

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
