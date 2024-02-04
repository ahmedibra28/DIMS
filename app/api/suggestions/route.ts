import { isAuth } from '@/lib/auth'
import { allowedRoles, getErrorResponse } from '@/lib/helpers'
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

    const { role } = req.user
    const isAllowed = allowedRoles.includes(role)

    const query = q
      ? {
          name: { contains: q, mode: QueryMode.insensitive },
          ...status,
          ...(!isAllowed && { createdById: req.user.id }),
        }
      : { ...status, ...(!isAllowed && { createdById: req.user.id }) }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.suggestion.findMany({
        where: query,
        include: {
          createdBy: {
            select: {
              name: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.suggestion.count({ where: query }),
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

    const { title, body, status } = await req.json()

    const suggestionObj = await prisma.suggestion.create({
      data: {
        title,
        body,
        status,
        createdById: req.user.id,
      },
    })

    return NextResponse.json({
      ...suggestionObj,
      message: 'Suggestion created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
