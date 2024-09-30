import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

export async function POST(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { assignCourseId, studentId } = await req.json()

    if (!assignCourseId || !studentId)
      return getErrorResponse('Please fill the form', 400)

    const assignCourse = await prisma.assignCourse.findFirst({
      where: {
        id: `${assignCourseId}`,
        student: {
          id: `${studentId}`,
          status: 'ACTIVE',
        },
        course: {
          status: 'ACTIVE',
        },
        status: 'ACTIVE',
      },
      select: {
        studentId: true,
        shift: true,
        semester: true,
        courseId: true,
        discount: true,
        course: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    })

    if (!assignCourse)
      return getErrorResponse('No student found in this course', 404)

    await prisma.$transaction(async prisma => {
      const discount = assignCourse.course.price * (assignCourse.discount / 100)
      const amount = assignCourse.course.price - discount

      const hasPaid = await prisma.transaction.findFirst({
        where: {
          studentId: `${assignCourse.studentId}`,
          courseId: `${assignCourse.courseId}`,
          semester: Number(assignCourse.semester),
          //   shift: assignCourse.shift,
          type: 'TUITION_PAYMENT',
          status: 'ACTIVE',
          createdAt: {
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ).toISOString(),
            lte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0,
              23,
              59,
              59
            ).toISOString(),
          },
        },
      })

      if (hasPaid) return null

      await prisma.transaction.create({
        data: {
          amount: Number(amount.toFixed(2)),
          discount,
          studentId: assignCourse.studentId,
          courseId: assignCourse.courseId,
          semester: assignCourse.semester,
          shift: assignCourse.shift,
          type: 'TUITION_PAYMENT',
          status: 'ACTIVE',
          createdById: req.user.id,
          description: `Tuition fee for ${assignCourse.course.name} in ${
            assignCourse.semester
          } semester ${assignCourse.shift} shift at ${new Date().toLocaleString()}`,
          paymentStatus: Number(amount) === 0 ? 'PAID' : 'UNPAID',
          ...(Number(amount) === 0 && { paymentMethod: 'SYSTEM' }),
        },
      })

      await prisma.student.update({
        where: {
          id: assignCourse.studentId,
        },
        data: {
          balance: {
            increment: Number(amount.toFixed(2)),
          },
        },
      })
    })

    return NextResponse.json({
      ...assignCourse,
      message: 'Student tuition fee generated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
