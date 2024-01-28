import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

export async function POST(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { id } = await req.json()

    const checkExistence =
      id &&
      (await prisma.assignCourse.findFirst({
        where: {
          id: `${id}`,
          status: 'ACTIVE',
          student: {
            status: 'ACTIVE',
          },
          course: {
            status: 'ACTIVE',
          },
        },
        include: {
          student: true,
          course: true,
        },
      }))
    if (!checkExistence)
      return getErrorResponse(
        'Assign course, student or course does not exist or is inactive'
      )

    const checkExistenceInNextLevel = await prisma.course.findFirst({
      where: {
        id: `${checkExistence.courseId}`,
        status: 'ACTIVE',
        duration: { gte: Number(checkExistence.semester) + 1 },
      },
    })

    if (!checkExistenceInNextLevel)
      return getErrorResponse(
        'Course does not exist or duration is less than semester + 1'
      )

    const checkStudentBalance = await prisma.student.findFirst({
      where: {
        id: `${checkExistence.studentId}`,
        status: 'ACTIVE',
        balance: { lte: 0 },
      },
    })
    if (!checkStudentBalance)
      return getErrorResponse(
        'Student does not exist or is inactive or there is outstanding balance'
      )

    const subjects = await prisma.subject.findMany({
      where: {
        courseId: checkExistence.courseId,
        status: 'ACTIVE',
        semester: checkExistence.semester,
      },
      select: {
        theoryMarks: true,
        practicalMarks: true,
      },
    })

    const totalTheoryMarks = subjects.reduce(
      (acc, curr) => acc + curr.theoryMarks,
      0
    )
    const totalPracticalMarks = subjects.reduce(
      (acc, curr) => acc + curr.practicalMarks,
      0
    )

    const studentMarks = await prisma.examination.findMany({
      where: {
        assignCourseId: checkExistence.id,
        status: 'ACTIVE',
      },
      select: {
        theoryMarks: true,
        practicalMarks: true,
      },
    })

    if (!studentMarks)
      return getErrorResponse('Student marks not found or is inactive')

    const totalStudentTheoryMarks = studentMarks.reduce(
      (acc, curr) => acc + curr.theoryMarks,
      0
    )

    const totalStudentPracticalMarks = studentMarks.reduce(
      (acc, curr) => acc + curr.practicalMarks,
      0
    )

    if (
      totalStudentTheoryMarks < totalTheoryMarks / 2 ||
      totalStudentPracticalMarks < totalPracticalMarks / 2
    )
      return getErrorResponse(
        'Student marks is less than course marks therefore cannot be promoted to next level'
      )

    await prisma.$transaction(async prisma => {
      await prisma.assignCourse.create({
        data: {
          ...checkExistence,
          semester: checkExistence.semester + 1,
          createdById: req.user.id,
        },
      })

      await prisma.assignCourse.update({
        where: {
          id: `${id}`,
        },
        data: {
          status: 'PASSED',
        },
      })
    })

    return NextResponse.json({
      message: 'Student promoted to next level successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
