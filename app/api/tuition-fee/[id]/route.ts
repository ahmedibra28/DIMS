import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const { status } = await req.json()

    const transactionObj = await prisma.transaction.findUnique({
      where: { id: `${params.id}` },
    })

    if (!transactionObj) return getErrorResponse('Transaction not found', 404)

    const checkExistStudent = await prisma.student.findFirst({
      where: {
        id: transactionObj.studentId,
        status: 'ACTIVE',
      },
    })
    if (!checkExistStudent) return getErrorResponse('Student not found', 404)

    await prisma.$transaction(async prisma => {
      await prisma.transaction.update({
        where: { id: params.id },
        data: {
          paymentStatus: status,
          ...(status === 'PAID' && { paymentMethod: 'CASH' }),
        },
      })

      await prisma.student.update({
        where: { id: transactionObj.studentId },
        data: {
          balance:
            status === 'PAID'
              ? { decrement: transactionObj.amount }
              : { increment: transactionObj.amount },
        },
      })
    })

    return NextResponse.json({
      ...transactionObj,
      message: 'Transaction has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
