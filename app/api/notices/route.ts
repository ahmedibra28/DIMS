import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/lib/prisma.db'

import type { Status as IStatus } from '@prisma/client'

export async function GET(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const status = {
      ...(searchParams.get('status') && {
        status: searchParams.get('status')?.toUpperCase(),
      }),
    } as { status: IStatus }

    const user =
      req.user.role === 'SUPER_ADMIN'
        ? {}
        : {
            OR: [
              {
                createdById: req.user.id,
              },
              {
                roles: {
                  some: {
                    type: req.user.role,
                  },
                },
              },
            ],
          }

    const query = q
      ? {
          title: { contains: q, mode: QueryMode.insensitive },
          ...status,
          ...user,
        }
      : { ...status, ...user }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.notice.findMany({
        where: query,
        include: {
          roles: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notice.count({ where: query }),
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

export async function POST(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { title, note, roles, status } = await req.json()

    const checkRoles = await prisma.role.findMany({
      where: {
        id: {
          in: roles,
        },
      },
    })
    if (checkRoles.length !== roles.length)
      return getErrorResponse('One or more roles do not exist')

    const noticeObj = await prisma.notice.create({
      data: {
        title,
        note,
        status,
        roles: {
          connect: [...roles.map((role: string) => ({ id: role }))],
        },
        createdById: req.user.id,
      },
    })

    return NextResponse.json({
      ...noticeObj,
      message: 'Notice created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
