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

    const courseObj = await prisma.course.findUnique({
      where: { id: `${params.id}` },
    })

    if (!courseObj) return getErrorResponse('Course not found', 404)

    const checkExistence =
      name &&
      params.id &&
      (await prisma.course.findFirst({
        where: {
          name,
          id: { not: params.id },
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

    await prisma.course.update({
      where: { id: params.id },
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
      message: 'Course has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const courseObj = await prisma.course.delete({
      where: { id: params.id },
    })

    if (!courseObj) return getErrorResponse('Course not removed', 404)

    return NextResponse.json({
      ...courseObj,
      message: 'Course has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
