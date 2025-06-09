import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/lib/prisma.db'
import type { Status as IStatus } from '@prisma/client'

interface Params {
  params: Promise<{
    id: string
  }>
}

export async function GET(req: Request, props: Params) {
  const params = await props.params;
  try {
    await isAuth(req, params)

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
          instructorId: params.id,
          ...status,
        }
      : { ...status, instructorId: params.id }

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

export async function PUT(req: Request, props: Params) {
  const params = await props.params;
  try {
    await isAuth(req, params)

    const { semester, shift, status, instructorId, subjectId } =
      await req.json()

    const assignSubjectObj = await prisma.assignSubject.findUnique({
      where: { id: `${params.id}` },
    })

    if (!assignSubjectObj)
      return getErrorResponse('Assign subject not found', 404)

    const checkSubjectStatus = await prisma.assignSubject.findFirst({
      where: {
        subjectId: `${subjectId}`,
        status: 'ACTIVE',
        semester: parseInt(semester),
        shift,
        id: { not: params.id },
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

    await prisma.assignSubject.update({
      where: { id: params.id },
      data: {
        semester: parseInt(semester),
        shift,
        status,
        subjectId,
        instructorId,
      },
    })

    return NextResponse.json({
      ...assignSubjectObj,
      message: 'Assign subject has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, props: Params) {
  const params = await props.params;
  try {
    await isAuth(req, params)

    const assignSubjectObj = await prisma.assignSubject.delete({
      where: { id: params.id },
    })

    if (!assignSubjectObj)
      return getErrorResponse('Assign subject not removed', 404)

    return NextResponse.json({
      ...assignSubjectObj,
      message: 'Assign subject has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
