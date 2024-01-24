import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

export async function POST(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { courseId, semester, shift } = await req.json()

    if (!courseId || !semester)
      return getErrorResponse('Please fill the form', 400)

    const studentsInCourse = await prisma.assignCourse.findMany({
      where: {
        courseId,
        semester: parseInt(semester),
        ...(shift && { shift }),
        student: {
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

    if (studentsInCourse?.length === 0)
      return getErrorResponse('No student found in this course', 404)

    await prisma.$transaction(async (prisma) => {
      await Promise.all(
        studentsInCourse.map(async (student) => {
          const discount = student.course.price * (student.discount / 100)
          const amount = student.course.price - discount

          const hasPaid = await prisma.transaction.findFirst({
            where: {
              studentId: `${student.studentId}`,
              courseId: `${student.courseId}`,
              semester: Number(student.semester),
              shift: student.shift,
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
              amount,
              discount,
              studentId: student.studentId,
              courseId: student.courseId,
              semester: student.semester,
              shift: student.shift,
              type: 'TUITION_PAYMENT',
              status: 'ACTIVE',
              createdById: req.user.id,
              description: `Tuition fee for ${student.course.name} in ${
                student.semester
              } semester ${
                student.shift
              } shift at ${new Date().toLocaleString()}`,
              paymentStatus: 'UNPAID',
            },
          })

          await prisma.student.update({
            where: {
              id: student.studentId,
            },
            data: {
              balance: {
                increment: amount,
              },
            },
          })
        })
      )
    })

    return NextResponse.json({
      ...studentsInCourse,
      message: 'Tuition fee generated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
