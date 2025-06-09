import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/lib/prisma.db'
import type { Status as IStatus } from '@prisma/client'
import { getPrismaErrorCode } from '@/lib/prismaErrorCodes'

interface Params {
  params: Promise<{
    id: string
  }>
}

export async function GET(req: NextApiRequestExtended, props: Params) {
  const params = await props.params;
  try {
    await isAuth(req, params)

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const assignCourseId = searchParams.get('assign-course-id') as string
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
          assignCourse: {
            id: assignCourseId,
            studentId: params.id,
          },
          ...status,
        }
      : {
          ...status,
          assignCourse: {
            id: assignCourseId,
            studentId: params.id,
          },
        }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.examination.findMany({
        where: query,
        include: {
          subject: {
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

export async function PUT(req: Request, props: Params) {
  const params = await props.params;
  try {
    await isAuth(req, params)

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

    const examObj = await prisma.examination.findUnique({
      where: { id: `${params.id}` },
    })

    if (!examObj) return getErrorResponse('Examination not found', 404)

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
          id: { not: params.id },
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

    const previousExam =
      subjectId &&
      semester &&
      (await prisma.examination.aggregate({
        where: {
          semester: parseInt(semester),
          subjectId,
          assignCourse: {
            id: assignCourseId,
            studentId,
          },
          id: { not: params.id },
        },
        _sum: {
          theoryMarks: true,
          practicalMarks: true,
        },
      }))

    const prevTotalTheoryMarks = previousExam?._sum.theoryMarks || 0
    const prevTotalPracticalMarks = previousExam?._sum.practicalMarks || 0

    if (
      subjectCheckMarks.theoryMarks - prevTotalTheoryMarks <
      Number(theoryMarks)
    )
      return getErrorResponse(
        `Theory marks cannot be greater than ${subjectCheckMarks.theoryMarks - prevTotalTheoryMarks}`
      )
    if (
      subjectCheckMarks.practicalMarks - prevTotalPracticalMarks <
      Number(practicalMarks)
    )
      return getErrorResponse(
        `Practical marks cannot be greater than ${subjectCheckMarks.practicalMarks - prevTotalPracticalMarks}`
      )

    const examinationObj = await prisma.examination.update({
      where: { id: params.id },
      data: {
        examination,
        semester: parseInt(semester),
        theoryMarks: parseFloat(theoryMarks),
        practicalMarks: parseFloat(practicalMarks),
        status,
        subjectId,
        assignCourseId,
      },
    })

    return NextResponse.json({
      ...examinationObj,
      message: 'Examination has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, props: Params) {
  const params = await props.params;
  try {
    await isAuth(req, params)

    const examinationObj = await prisma.examination.delete({
      where: { id: params.id, assignCourse: { status: 'ACTIVE' } },
    })

    if (!examinationObj) return getErrorResponse('Examination not removed', 404)

    return NextResponse.json({
      ...examinationObj,
      message: 'Examination has been removed successfully',
    })
  } catch ({ status = 500, message, code }: any) {
    const error = getPrismaErrorCode(code)?.description || message
    return getErrorResponse(error, status)
  }
}
