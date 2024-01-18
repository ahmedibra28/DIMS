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

    const schoolObj = await prisma.school.findUnique({
      where: { id: params.id },
    })

    if (!schoolObj) return getErrorResponse('School not found', 404)

    const checkExistence =
      name &&
      params.id &&
      (await prisma.school.findFirst({
        where: {
          name,
          id: { not: params.id },
        },
      }))
    if (checkExistence) return getErrorResponse('School already exist')

    await prisma.school.update({
      where: { id: params.id },
      data: {
        name,
        status,
      },
    })

    return NextResponse.json({
      ...schoolObj,
      message: 'School has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const schoolObj = await prisma.school.delete({
      where: { id: params.id },
    })

    if (!schoolObj) return getErrorResponse('School not removed', 404)

    return NextResponse.json({
      ...schoolObj,
      message: 'School has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
