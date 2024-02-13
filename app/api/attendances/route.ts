import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/lib/prisma.db'

import type { Status as IStatus, Shift as IShift } from '@prisma/client'
import DateTime from '@/lib/dateTime'

export async function GET(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const semester = searchParams.get('semester') || ''
    const shift = searchParams.get('shift') || ''
    const course_id = searchParams.get('course_id') || ''
    const subject_id = searchParams.get('subject_id') || ''

    const status = {
      ...(searchParams.get('status') && {
        status: searchParams.get('status')?.toUpperCase(),
      }),
    } as { status: IStatus }

    const doesSubjectBelongToInstructor = await prisma.assignSubject.findFirst({
      where: {
        instructorId: req.user.instructorId,
        subjectId: subject_id,
        status: 'ACTIVE',
      },
    })

    if (!doesSubjectBelongToInstructor)
      return getErrorResponse(
        'You are not authorized to view this subject',
        403
      )

    const query = q
      ? {
          student: {
            name: { contains: q, mode: QueryMode.insensitive },
            status: 'ACTIVE',
          },
          shift,
          semester: parseInt(semester),
          courseId: course_id,
          course: {
            subject: {
              some: {
                id: subject_id,
              },
            },
          },
          ...status,
        }
      : {
          shift,
          semester: parseInt(semester),
          courseId: course_id,
          student: {
            status: 'ACTIVE',
          },
          course: {
            subject: {
              some: {
                id: subject_id,
              },
            },
          },
          ...status,
        }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.assignCourse.findMany({
        where: query as any,
        select: {
          id: true,
          semester: true,
          shift: true,
          student: {
            select: {
              name: true,
              id: true,
              rollNo: true,
            },
          },
          course: {
            select: {
              name: true,
              id: true,
              subject: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.assignCourse.count({ where: query as any }),
    ])

    const pages = Math.ceil(total / pageSize)

    const newResult = result.map(item => {
      const newCourse = item.course.subject.filter(
        (subject: any) => subject.id === subject_id
      )
      return {
        ...item,
        course: {
          ...item.course,
          subject: newCourse,
        },
      }
    })

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + newResult.length,
      count: newResult.length,
      page,
      pages,
      total,
      data: newResult,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function POST(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    interface ISelect {
      id: string
      semester: string
      shift: IShift
      student: string
      studentId: string
      courseId: string
      subjectId: string
      present: boolean
    }

    const body: ISelect[] = await req.json()

    if (!Array.isArray(body) || body.length === 0)
      return getErrorResponse('You must select students for attendance')

    await Promise.all(
      body.map(async item => {
        const doesStudentBelongToCourse = await prisma.assignCourse.findFirst({
          where: {
            courseId: item.courseId,
            studentId: item.studentId,
            status: 'ACTIVE',
            semester: parseInt(item.semester),
            shift: item.shift,
          },
        })

        if (!doesStudentBelongToCourse)
          throw {
            message: 'Student does not belong to the course',
            status: 404,
          }

        const checkExistence = await prisma.attendance.findFirst({
          where: {
            assignCourse: {
              studentId: item.studentId,
            },
            assignSubject: {
              subjectId: item.subjectId,
            },
            status: 'ACTIVE',
            createdAt: {
              gte: DateTime().utc().startOf('day').toDate(),
              lte: DateTime().utc().endOf('day').toDate(),
            },
          },
        })

        if (checkExistence)
          throw {
            message: 'Attendance already taken for the student',
            status: 400,
          }
      })
    )

    const doesInstructorBelongToSubject = await prisma.assignSubject.findFirst({
      where: {
        instructorId: req.user.instructorId,
        subjectId: body[0].subjectId,
        status: 'ACTIVE',
        semester: parseInt(body[0].semester),
        shift: body[0].shift,
      },
    })

    if (!doesInstructorBelongToSubject)
      return getErrorResponse('Instructor does not belong to the subject')

    const unattendedStudentsFromAssignCourse =
      await prisma.assignCourse.findMany({
        where: {
          id: {
            notIn: body.map(item => item.id),
          },
          semester: parseInt(body[0].semester),
          shift: body[0].shift,
          courseId: body[0].courseId,
        },
        select: {
          id: true,
        },
      })
    const unattendedStudents = unattendedStudentsFromAssignCourse.map(item => ({
      present: false,
      id: item.id,
    }))

    await prisma.$transaction(async prisma => {
      await Promise.all(
        [...body, ...unattendedStudents].map(async item => {
          await prisma.attendance.create({
            data: {
              status: 'ACTIVE',
              isPresent: item.present,
              assignCourseId: item.id,
              assignSubjectId: doesInstructorBelongToSubject.id,
              createdById: req.user.id,
            },
          })
        })
      )
    })

    return NextResponse.json({
      message: 'Attendance taken successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
