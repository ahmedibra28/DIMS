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
          subject: {
            name: { contains: q, mode: QueryMode.insensitive },
          },
          ...status,
        }
      : { ...status }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.assignSubject.findMany({
        where: query,
        include: {
          subject: {
            select: {
              id: true,
              name: true,
              course: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          instructor: {
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
      prisma.assignSubject.count({ where: query }),
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

    const { semester, shift, status, instructorId, subjectId } =
      await req.json()

    const checkSubjectStatus = await prisma.assignSubject.findFirst({
      where: {
        subjectId: `${subjectId}`,
        semester: parseInt(semester),
        status: 'ACTIVE',
        shift,
      },
    })

    if (checkSubjectStatus) return getErrorResponse(`Subject already assigned`)

    const checkInstructor = await prisma.instructor.findFirst({
      where: {
        id: `${instructorId}`,
        status: 'ACTIVE',
      },
    })
    if (!checkInstructor)
      return getErrorResponse('Instructor does not exist or is not active')

    const checkSubject = await prisma.subject.findFirst({
      where: {
        id: `${subjectId}`,
        status: 'ACTIVE',
        semester: parseInt(semester),
      },
    })
    if (!checkSubject)
      return getErrorResponse(
        'Subject has already been assigned to another instructor or is not active'
      )

    const assignSubjectObj = await prisma.assignSubject.create({
      data: {
        semester: parseInt(semester),
        shift,
        status,
        subjectId,
        instructorId,
        createdById: req.user.id,
      },
    })

    return NextResponse.json({
      ...assignSubjectObj,
      message: 'Assign subject created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
