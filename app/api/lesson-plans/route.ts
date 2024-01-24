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

    const { role } = req.user
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN']

    const query = q
      ? {
          title: { contains: q, mode: QueryMode.insensitive },
          ...(!allowedRoles.includes(role) && {
            createdById: req.user.id,
          }),
          ...status,
        }
      : {
          ...status,
          ...(!allowedRoles.includes(role) && {
            createdById: req.user.id,
          }),
        }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.lessonPlan.findMany({
        where: query,
        include: {
          subject: {
            select: {
              id: true,
              name: true,
              semester: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lessonPlan.count({ where: query }),
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

    const { note, file, status, subjectId } = await req.json()

    if (!note || !file || !status || !subjectId)
      return getErrorResponse('All fields are required', 400)

    const check = await prisma.assignSubject.findFirst({
      where: {
        status: 'ACTIVE',
        instructor: {
          id: `${req.user.id}`,
          status: 'ACTIVE',
        },
        subject: {
          id: `${subjectId}`,
          status: 'ACTIVE',
        },
      },
      include: {
        subject: {
          select: {
            name: true,
            semester: true,
          },
        },
        instructor: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!check) return getErrorResponse('Subject or Instructor not found', 404)

    const lessonPlanObj = await prisma.lessonPlan.create({
      data: {
        title: `Lesson Plan for ${check.subject.name} semester ${check.subject.semester} ${check.shift} shift by ${check.instructor.name}`,
        note,
        file,
        subjectId,
        status,
        createdById: req.user.id,
        isApproved: false,
        isCreatedRead: true,
        isAdminRead: false,
      },
    })

    return NextResponse.json({
      ...lessonPlanObj,
      message: 'LessonPlan created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
