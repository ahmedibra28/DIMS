import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import type { Shift as IShift } from '@prisma/client'
import DateTime from '@/lib/dateTime'

export async function GET(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const course = searchParams.get('course')
    const student = searchParams.get('student')
    const shift = searchParams.get('shift')
    const semester = searchParams.get('semester')
    const subject = searchParams.get('subject')
    const instructor = searchParams.get('instructor')
    const attendanceDate = searchParams.get('attendanceDate')

    const query = {
      ...(attendanceDate && {
        createdAt: {
          gte: DateTime(attendanceDate)
            .add(1, 'day')
            .utc()
            .startOf('day')
            .toDate(),
          lte: DateTime(attendanceDate)
            .add(1, 'day')
            .utc()
            .endOf('day')
            .toDate(),
        },
      }),
      ...(status && {
        isPresent: Boolean(status === 'True'),
      }),
      ...(subject && {
        assignSubject: {
          subjectId: subject,
        },
      }),
      ...(course && {
        assignCourse: {
          courseId: course,
        },
      }),
      ...(instructor && {
        assignSubject: {
          instructor: {
            rollNo: instructor?.toUpperCase(),
          },
        },
      }),
      ...(student && {
        assignCourse: {
          student: {
            rollNo: student?.toUpperCase(),
          },
        },
      }),
      ...(shift && {
        assignCourse: {
          shift: shift as IShift,
        },
      }),
      ...(semester && {
        assignCourse: {
          semester: Number(semester),
        },
      }),
    }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.attendance.findMany({
        where: { ...query, status: 'ACTIVE' },
        select: {
          assignCourse: {
            select: {
              student: {
                select: {
                  rollNo: true,
                  name: true,
                },
              },
              course: {
                select: {
                  name: true,
                },
              },
              shift: true,
              semester: true,
            },
          },
          isPresent: true,
          createdAt: true,
          assignSubject: {
            select: {
              instructor: {
                select: {
                  rollNo: true,
                  name: true,
                },
              },
              subject: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.attendance.count({ where: { ...query, status: 'ACTIVE' } }),
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
