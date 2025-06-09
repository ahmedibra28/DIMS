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
  const params = await props.params;
  try {
    await isAuth(req, params)

    const { title, note, roles, status } = await req.json()

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
        status,
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

export async function DELETE(req: Request, props: Params) {
  const params = await props.params;
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
