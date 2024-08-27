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

    const temporaryTransactionObj =
      await prisma.temporaryTransaction.findUnique({
        where: { id: `${params.id}` },
      })

    if (!temporaryTransactionObj)
      return getErrorResponse('Temporary transaction not found', 404)

    await prisma.temporaryTransaction.update({
      where: { id: params.id },
      data: {
        paymentStatus: status,
      },
    })

    return NextResponse.json({
      ...temporaryTransactionObj,
      message: 'Temporary transaction has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const temporaryTransactionObj = await prisma.temporaryTransaction.delete({
      where: { id: params.id },
    })

    if (!temporaryTransactionObj)
      return getErrorResponse('Temporary transaction not removed', 404)

    return NextResponse.json({
      ...temporaryTransactionObj,
      message: 'Temporary transaction has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
