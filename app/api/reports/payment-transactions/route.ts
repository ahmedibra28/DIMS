import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

import type {
  TransactionType as ITransactionType,
  PaymentMethod as IPaymentMethod,
  PaymentStatus as IPaymentStatus,
} from '@prisma/client'
import DateTime from '@/lib/dateTime'

export async function GET(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const paymentDate = searchParams.get('paymentDate')
    const paymentType = searchParams.get('paymentType')
    const paymentMethod = searchParams.get('paymentMethod')
    const paymentStatus = searchParams.get('paymentStatus')
    const course = searchParams.get('course')
    const student = searchParams.get('student')

    const query = {
      ...(paymentDate && {
        createdAt: {
          gte: DateTime(paymentDate)
            .add(1, 'day')
            .utc()
            .startOf('day')
            .toDate(),
          lte: DateTime(paymentDate).add(1, 'day').utc().endOf('day').toDate(),
        },
      }),
      ...(paymentType && {
        type: paymentType as ITransactionType,
      }),
      ...(paymentMethod && {
        paymentMethod: paymentMethod as IPaymentMethod,
      }),
      ...(paymentStatus && {
        paymentStatus: paymentStatus as IPaymentStatus,
      }),
      ...(course && {
        courseId: course,
      }),
      ...(student && {
        student: {
          rollNo: student?.toUpperCase(),
        },
      }),
    }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { ...query, status: 'ACTIVE' },
        select: {
          student: {
            select: {
              rollNo: true,
              name: true,
            },
          },
          course: {
            select: {
              name: true,
            },
          },
          shift: true,
          semester: true,
          discount: true,
          amount: true,
          createdAt: true,
          paymentMethod: true,
          paymentStatus: true,
          type: true,
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where: { ...query, status: 'ACTIVE' } }),
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
