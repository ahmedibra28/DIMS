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
          course: {
            name: { contains: q, mode: QueryMode.insensitive },
          },
          ...status,
        }
      : { ...status }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.assignCourse.findMany({
        where: query,
        include: {
          course: {
            select: {
              id: true,
              name: true,
            },
          },
          sponsor: {
            select: {
              id: true,
              name: true,
            },
          },
          student: {
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
      prisma.assignCourse.count({ where: query }),
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

    const {
      semester,
      shift,
      discount,
      status,
      studentId,
      courseId,
      sponsorId,
    } = await req.json()

    if (Number(discount) > 100 || Number(discount) < 0)
      return getErrorResponse('Discount must be between 0 and 100')

    // if (Number(semester) !== 1)
    //   return getErrorResponse('Semester must be 1 for now')

    const checkExistence =
      shift &&
      studentId &&
      (await prisma.assignCourse.findFirst({
        where: {
          shift,
          studentId,
          status: 'ACTIVE',
        },
      }))
    if (checkExistence)
      return getErrorResponse(
        'Assign course already exist or shift is not available'
      )

    const existSemester = await prisma.assignCourse.findFirst({
      where: {
        courseId,
        studentId,
        semester: parseInt(semester),
      },
    })

    if (existSemester)
      return getErrorResponse(
        'Student already has an active semester with the same course and semester'
      )

    const checkStudent = await prisma.student.findFirst({
      where: {
        id: `${studentId}`,
        status: 'ACTIVE',
      },
    })
    if (!checkStudent)
      return getErrorResponse('Student does not exist or is not active')

    const checkCourse = await prisma.course.findFirst({
      where: {
        id: `${courseId}`,
        status: 'ACTIVE',
        duration: { gte: Number(semester) },
      },
    })
    if (!checkCourse)
      return getErrorResponse(
        'Course with the selected semester does not exist or is not active'
      )

    if (sponsorId) {
      const checkSponsor = await prisma.sponsor.findFirst({
        where: {
          id: `${sponsorId}`,
          status: 'ACTIVE',
        },
      })
      if (!checkSponsor)
        return getErrorResponse('Sponsor does not exist or is not active')
    }

    const checkCourseStatus = await prisma.assignCourse.findFirst({
      where: {
        courseId: `${courseId}`,
        status: 'ACTIVE',
        studentId: checkStudent.id,
      },
    })

    if (checkCourseStatus) return getErrorResponse(`Course already assigned`)

    const assignCourseObj = await prisma.assignCourse.create({
      data: {
        semester: parseInt(semester),
        shift,
        discount: parseFloat(discount),
        status,
        courseId,
        ...(sponsorId && { sponsorId }),
        studentId,
        createdById: req.user.id,
      },
    })

    return NextResponse.json({
      ...assignCourseObj,
      message: 'Assign course created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
