import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/lib/prisma.db'

import type { Status as IStatus } from '@prisma/client'

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
      prisma.sponsor.findMany({
        where: query,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sponsor.count({ where: query }),
    ])

    const pages = Math.ceil(total / pageSize)

    const sponsorsWithTotalStudents = await Promise.all(
      result.map(async sponsor => {
        const totalStudents = await prisma.assignCourse.count({
          where: {
            sponsorId: sponsor.id,
            status: 'ACTIVE',
          },
        })
        return {
          ...sponsor,
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
      data: sponsorsWithTotalStudents,
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
      (await prisma.sponsor.findFirst({
        where: {
          name,
        },
      }))
    if (checkExistence) return getErrorResponse('Sponsor already exist')

    const sponsorObj = await prisma.sponsor.create({
      data: {
        name,
        status,
        createdById: req.user.id,
      },
    })

    return NextResponse.json({
      ...sponsorObj,
      message: 'Sponsor created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
