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

    const { name, status } = await req.json()

    const sponsorObj = await prisma.sponsor.findUnique({
      where: { id: params.id },
    })

    if (!sponsorObj) return getErrorResponse('Sponsor not found', 404)

    const checkExistence =
      name &&
      params.id &&
      (await prisma.sponsor.findFirst({
        where: {
          name,
          id: { not: params.id },
        },
      }))
    if (checkExistence) return getErrorResponse('Sponsor already exist')

    await prisma.sponsor.update({
      where: { id: params.id },
      data: {
        name,
        status,
      },
    })

    return NextResponse.json({
      ...sponsorObj,
      message: 'Sponsor has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const sponsorObj = await prisma.sponsor.delete({
      where: { id: params.id },
    })

    if (!sponsorObj) return getErrorResponse('Sponsor not removed', 404)

    return NextResponse.json({
      ...sponsorObj,
      message: 'Sponsor has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
