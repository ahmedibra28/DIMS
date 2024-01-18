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
      prisma.course.findMany({
        where: query,
        include: {
          school: {
            select: {
              name: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.course.count({ where: query }),
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

export async function POST(req: Request) {
  try {
    await isAuth(req)

    const {
      name,
      price,
      duration,
      examinations,
      certificate,
      enrolment,
      status,
      schoolId,
    } = await req.json()

    const checkExistence =
      name &&
      (await prisma.course.findFirst({
        where: {
          name,
        },
      }))
    if (checkExistence) return getErrorResponse('Course already exist')

    const checkSchool = await prisma.school.findFirst({
      where: {
        id: `${schoolId}`,
        status: 'ACTIVE',
      },
    })
    if (!checkSchool)
      return getErrorResponse('School does not exist or is not active')

    const courseObj = await prisma.course.create({
      data: {
        name,
        price: parseFloat(price),
        duration: parseInt(duration),
        examinations: examinations.split(',').map((e: string) => e.trim()),
        certificate,
        enrolment,
        status,
        schoolId,
      },
    })

    return NextResponse.json({
      ...courseObj,
      message: 'Course created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
