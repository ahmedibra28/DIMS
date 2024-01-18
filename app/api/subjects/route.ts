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
      prisma.subject.findMany({
        where: query,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.subject.count({ where: query }),
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

    const { name, semester, theoryMarks, practicalMarks, status, courseId } =
      await req.json()

    const checkExistence =
      name &&
      courseId &&
      semester &&
      (await prisma.subject.findFirst({
        where: {
          name,
          courseId,
          semester: parseInt(semester),
        },
      }))
    if (checkExistence) return getErrorResponse('Subject already exist')

    const checkCourse = await prisma.course.findFirst({
      where: {
        id: `${courseId}`,
        status: 'ACTIVE',
      },
    })
    if (!checkCourse)
      return getErrorResponse('Course does not exist or is not active')

    const subjectObj = await prisma.subject.create({
      data: {
        name,
        semester: parseInt(semester),
        theoryMarks: parseInt(theoryMarks),
        practicalMarks: parseInt(practicalMarks),
        status,
        courseId,
      },
    })

    return NextResponse.json({
      ...subjectObj,
      message: 'Subject created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
