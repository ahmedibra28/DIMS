'use server'

import { prisma } from '@/lib/prisma.db'
import { AttendanceSummaryProp } from '@/types'

export default async function getAttendanceByInstructorId({
  instructorId,
}: {
  instructorId: string
}) {
  try {
    if (!instructorId) return null

    const activeCourses = await prisma.assignSubject.findMany({
      where: {
        instructorId,
        status: 'ACTIVE',
      },
      select: {
        instructorId: true,
      },
    })

    if (activeCourses.length === 0) return null

    const attendances = await prisma.attendance.findMany({
      where: {
        assignSubject: {
          instructorId: {
            in: activeCourses.map(item => item.instructorId),
          },
        },
        assignCourse: {
          status: 'ACTIVE',
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
        assignCourse: {
          select: {
            student: {
              select: { name: true, rollNo: true },
            },
            semester: true,
          },
        },
      },
    })

    const attSummary: any = []

    attendances?.forEach(att => {
      const item = attSummary.find(
        (i: any) => i?.student?.rollNo === att?.assignCourse?.student?.rollNo
      )

      if (item) {
        item.present += att?.isPresent ? 1 : 0
        item.absent += att?.isPresent ? 0 : 1
      } else {
        attSummary.push({
          student: {
            name: att?.assignCourse?.student?.name,
            rollNo: att?.assignCourse?.student?.rollNo,
          },
          semester: att?.assignCourse?.semester,
          course: att?.assignSubject?.subject?.course?.name,
          subject: att?.assignSubject?.subject?.name,
          present: att?.isPresent ? 1 : 0,
          absent: att?.isPresent ? 0 : 1,
        })
      }
    })

    const att = attSummary as AttendanceSummaryProp[]

    att?.sort((a, b) => b?.absent - a?.absent)

    return att.slice(0, 10)
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
