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
      prisma.examination.findMany({
        where: query,
        include: {
          subject: {
            select: {
              name: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.examination.count({ where: query }),
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
      examination,
      semester,
      theoryMarks,
      practicalMarks,
      status,
      assignCourseId,
      subjectId,
      studentId,
    } = await req.json()

    const checkExistence =
      examination &&
      subjectId &&
      semester &&
      (await prisma.examination.findFirst({
        where: {
          semester: parseInt(semester),
          examination,
          subjectId,
          assignCourse: {
            id: assignCourseId,
            studentId,
          },
        },
      }))
    if (checkExistence)
      return getErrorResponse('Examination result already exists')

    const checkAssignCourse = await prisma.assignCourse.findFirst({
      where: {
        id: `${assignCourseId}`,
        status: 'ACTIVE',
        student: {
          id: `${studentId}`,
          status: 'ACTIVE',
        },
        course: {
          status: 'ACTIVE',
          duration: { gte: Number(semester) },
        },
      },
    })
    if (!checkAssignCourse)
      return getErrorResponse(
        'Assign course does not exist or student is inactive or course is inactive'
      )

    const subjectCheckMarks = await prisma.subject.findUnique({
      where: {
        id: subjectId,
      },
    })

    if (!subjectCheckMarks) return getErrorResponse('Subject does not exist')

    if (subjectCheckMarks?.theoryMarks < Number(theoryMarks))
      return getErrorResponse(
        `Theory marks cannot be greater than ${subjectCheckMarks?.theoryMarks}`
      )
    if (subjectCheckMarks?.practicalMarks < Number(practicalMarks))
      return getErrorResponse(
        `Practical marks cannot be greater than ${subjectCheckMarks?.practicalMarks}`
      )

    const examinationObj = await prisma.examination.create({
      data: {
        examination,
        semester: parseInt(semester),
        theoryMarks: parseFloat(theoryMarks),
        practicalMarks: parseFloat(practicalMarks),
        status,
        subjectId,
        assignCourseId,
        createdById: req.user.id,
      },
    })

    return NextResponse.json({
      ...examinationObj,
      message: 'Examination created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
