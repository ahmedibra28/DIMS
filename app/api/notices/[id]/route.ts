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

    const { title, note, roles, userId, status } = await req.json()

    const noticeObj = await prisma.notice.findUnique({
      where: { id: `${params.id}` },
      include: {
        roles: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!noticeObj) return getErrorResponse('Notice not found', 404)

    const checkUser = await prisma.user.findFirst({
      where: {
        id: `${userId}`,
        confirmed: true,
        blocked: false,
      },
    })
    if (!checkUser)
      return getErrorResponse('User does not exist or is not active')

    const checkRoles = await prisma.role.findMany({
      where: {
        id: {
          in: roles,
        },
      },
    })

    if (checkRoles.length !== roles.length)
      return getErrorResponse('One or more roles do not exist')

    await prisma.notice.update({
      where: { id: params.id },
      data: {
        title,
        note,
        roles: {
          disconnect: noticeObj.roles.map((role: any) => ({ id: role.id })),
          connect: [...roles.map((role: string) => ({ id: role }))],
        },
        ...(userId && { userId }),
        status,
        userId,
      },
    })

    return NextResponse.json({
      ...noticeObj,
      message: 'Notice has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const noticeObj = await prisma.notice.delete({
      where: { id: params.id },
    })

    if (!noticeObj) return getErrorResponse('Notice not removed', 404)

    return NextResponse.json({
      ...noticeObj,
      message: 'Notice has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
