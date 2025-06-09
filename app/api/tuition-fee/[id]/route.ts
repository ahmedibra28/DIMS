import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: Promise<{
    id: string
  }>
}

export async function PUT(req: Request, props: Params) {
  const params = await props.params
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
              ? { decrement: Number(transactionObj.amount.toFixed(2)) }
              : { increment: Number(transactionObj.amount.toFixed(2)) },
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

export async function DELETE(req: NextApiRequestExtended, props: Params) {
  const params = await props.params
  try {
    await isAuth(req, params)

    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
    })

    if (!transaction) return getErrorResponse('Transaction not found', 404)

    await prisma.$transaction(async prisma => {
      const transactionObj = await prisma.transaction.update({
        where: { id: transaction.id, type: 'TUITION_PAYMENT' },
        data: {
          status: 'DELETED',
          createdById: req.user.id,
        },
      })

      await prisma.student.update({
        where: { id: transactionObj.studentId },
        data: {
          ...(transactionObj.paymentStatus === 'UNPAID' && {
            balance: {
              decrement: Number(transactionObj.amount.toFixed(2)),
            },
          }),
        },
      })

      transaction.id = undefined as any

      if (transactionObj.paymentStatus === 'PAID') {
        const createNewTrans = await prisma.transaction.create({
          data: {
            ...transaction,
            status: 'ACTIVE',
            createdById: req.user.id,
            type: 'REFUND_TUITION_PAYMENT',
            createdAt: new Date(),
          },
        })

        if (!createNewTrans)
          throw { status: 404, message: 'Transaction not removed' }
      }

      if (!transactionObj)
        throw { status: 404, message: 'Transaction not removed' }
    })

    return NextResponse.json({
      message: 'Transaction has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
