import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/lib/prisma.db'

import type { Status as IStatus } from '@/prisma/generated/client'

export async function GET(req: Request) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const status = {
      ...(searchParams.get('status') && {
        status: searchParams.get('status')?.toUpperCase(),
      }),
    } as { status: IStatus }

    const query = q
      ? {
          name: { contains: q, mode: QueryMode.insensitive },
          ...status,
        }
      : { ...status }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.location.findMany({
        where: query,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.location.count({ where: query }),
    ])

    const pages = Math.ceil(total / pageSize)

    const locationsWithTotalStudents = await Promise.all(
      result.map(async location => {
        const totalStudents = await prisma.assignCourse.count({
          where: {
            locationId: location.id,
            status: 'ACTIVE',
          },
        })
        return {
          ...location,
          totalActiveCourses: totalStudents,
        }
      })
    )

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: locationsWithTotalStudents,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function POST(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { name, status } = await req.json()

    const checkExistence =
      name &&
      (await prisma.location.findFirst({
        where: {
          name,
        },
      }))
    if (checkExistence) return getErrorResponse('Location already exist')

    const locationObj = await prisma.location.create({
      data: {
        name,
        status,
        createdById: req.user.id,
      },
    })

    return NextResponse.json({
      ...locationObj,
      message: 'Location created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
