import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

export async function GET(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const activeCourses = await prisma.assignCourse.groupBy({
      where: {
        status: 'ACTIVE',
        student: {
          status: 'ACTIVE',
        },
      },
      by: ['courseId', 'semester', 'shift'],
      _count: {
        studentId: true,
      },
      _sum: {
        discount: true,
      },
    })

    const courses = await prisma.course.findMany({
      where: {
        id: { in: activeCourses.map(s => s.courseId) },
      },
    })

    const detailedSummary = activeCourses.map(item => {
      const course = courses.find(c => c.id === item.courseId)
      return {
        course: {
          id: course?.id,
          name: course?.name,
        },
        shift: item.shift,
        semester: item.semester,
        students: item._count.studentId,
        discount:
          Number(course?.price || 0) * (Number(item._sum.discount || 0) / 100),
        amount: Number(course?.price || 0) * Number(item._count.studentId || 0),
      }
    })

    return NextResponse.json({
      data: detailedSummary,
      message: 'Tuition fee generated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

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
        shift,
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

    await prisma.$transaction(async prisma => {
      await Promise.all(
        studentsInCourse.map(async student => {
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
              amount: Number(amount.toFixed(2)),
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
              paymentStatus: Number(amount) === 0 ? 'PAID' : 'UNPAID',
              ...(Number(amount) === 0 && { paymentMethod: 'SYSTEM' }),
            },
          })

          await prisma.student.update({
            where: {
              id: student.studentId,
            },
            data: {
              balance: {
                increment: Number(amount.toFixed(2)),
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
