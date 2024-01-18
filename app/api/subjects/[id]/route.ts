import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const { name, semester, theoryMarks, practicalMarks, status, courseId } =
      await req.json()

    const subjectObj = await prisma.subject.findUnique({
      where: { id: `${params.id}` },
    })

    if (!subjectObj) return getErrorResponse('Subject not found', 404)

    const checkExistence =
      name &&
      courseId &&
      semester &&
      params.id &&
      (await prisma.subject.findFirst({
        where: {
          name,
          courseId,
          semester: parseInt(semester),
          id: { not: params.id },
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

    await prisma.subject.update({
      where: { id: params.id },
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
      message: 'Subject has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const subjectObj = await prisma.subject.delete({
      where: { id: params.id },
    })

    if (!subjectObj) return getErrorResponse('Subject not removed', 404)

    return NextResponse.json({
      ...subjectObj,
      message: 'Subject has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
