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

    const { name, status } = await req.json()

    const locationObj = await prisma.location.findUnique({
      where: { id: params.id },
    })

    if (!locationObj) return getErrorResponse('Location not found', 404)

    const checkExistence =
      name &&
      params.id &&
      (await prisma.location.findFirst({
        where: {
          name,
          id: { not: params.id },
        },
      }))
    if (checkExistence) return getErrorResponse('Location already exist')

    await prisma.location.update({
      where: { id: params.id },
      data: {
        name,
        status,
      },
    })

    return NextResponse.json({
      ...locationObj,
      message: 'Location has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, props: Params) {
  const params = await props.params
  try {
    await isAuth(req, params)

    const locationObj = await prisma.location.delete({
      where: { id: params.id },
    })

    if (!locationObj) return getErrorResponse('Location not removed', 404)

    return NextResponse.json({
      ...locationObj,
      message: 'Location has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
