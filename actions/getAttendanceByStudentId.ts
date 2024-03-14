'use server'

import { prisma } from '@/lib/prisma.db'
import { AttendanceSummaryProp } from '@/types'

export default async function getAttendanceByStudentId({
  studentId,
}: {
  studentId: string
}) {
  try {
    if (!studentId) return null

    const activeCourses = await prisma.assignCourse.findMany({
      where: {
        studentId,
        status: 'ACTIVE',
      },
      select: {
        studentId: true,
      },
    })

    if (activeCourses.length === 0) return null

    const attendances = await prisma.attendance.findMany({
      where: {
        assignCourse: {
          studentId: {
            in: activeCourses.map(item => item.studentId),
          },
        },
      },
      select: {
        id: true,
        isPresent: true,
        createdAt: true,
        assignSubject: {
          select: {
            subject: {
              select: { name: true, course: { select: { name: true } } },
            },
          },
        },
      },
    })

    const attSummary: any = []

    attendances?.forEach(att => {
      const item = attSummary.find(
        (i: any) => i?.subject === att?.assignSubject?.subject?.name
      )

      if (item) {
        item.present += att?.isPresent ? 1 : 0
        item.absent += att?.isPresent ? 0 : 1
      } else {
        attSummary.push({
          course: att?.assignSubject?.subject?.course?.name,
          subject: att?.assignSubject?.subject?.name,
          present: att?.isPresent ? 1 : 0,
          absent: att?.isPresent ? 0 : 1,
        })
      }
    })

    return attSummary as AttendanceSummaryProp[]
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
