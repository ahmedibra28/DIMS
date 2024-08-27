import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import { initPayment } from '@/lib/waafipay'

export async function POST(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { transactionId } = await req.json()
    const studentId = req.user.studentId

    const getTransaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        studentId,
      },
    })

    if (!getTransaction) return getErrorResponse('Transaction not found', 404)

    if (getTransaction.paymentStatus === 'PAID')
      return getErrorResponse('Transaction already paid', 400)

    if (!req.user?.mobile)
      return getErrorResponse(
        'Please update your profile with your mobile number to proceed with payment',
        400
      )

    const payment = await initPayment({
      amount: getTransaction.amount,
      mobile: req.user.mobile?.toString(),
    })
    console.log()

    if (payment?.error) return getErrorResponse(payment?.error, 400)

    await prisma.$transaction(async prisma => {
      await prisma.transaction.update({
        where: {
          id: transactionId,
        },
        data: {
          paymentStatus: 'PAID',
          paymentMethod: 'EVC_WALLET',
          reference: payment.transactionId,
        },
      }),
        await prisma.student.update({
          where: {
            id: studentId,
          },
          data: {
            balance: {
              decrement: Number(getTransaction.amount.toFixed(2)),
            },
          },
        })
    })

    return NextResponse.json({
      ...getTransaction,
      message: 'Student payment successful',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
