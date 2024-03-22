import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import { ITranscript } from '@/types'

export async function GET(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const student = searchParams.get('student')
    const course = searchParams.get('course')
    const semester = searchParams.get('semester')

    if (!student || !course) return NextResponse.json([])

    const transcript = await prisma.examination.findMany({
      where: {
        status: 'ACTIVE',
        ...(semester && {
          semester: Number(semester),
        }),
        assignCourse: {
          status: { not: 'INACTIVE' },
          courseId: course,
          student: {
            rollNo: student?.toUpperCase(),
          },
        },
      },
      select: {
        id: true,
        semester: true,
        theoryMarks: true,
        practicalMarks: true,
        subject: {
          select: {
            id: true,
            name: true,
            theoryMarks: true,
            practicalMarks: true,
          },
        },
        assignCourse: {
          select: {
            student: {
              select: { rollNo: true, name: true, image: true, sex: true },
            },
            course: {
              select: { name: true },
            },
            createdAt: true,
          },
        },
      },
    })

    const newTranscript: ITranscript[] = []
    transcript?.forEach(trans => {
      const find = newTranscript?.find(
        t =>
          t.subject?.id === trans?.subject?.id && t.semester === trans.semester
      )

      if (find) {
        find.theoryMarks += trans.theoryMarks
        find.practicalMarks += trans.practicalMarks
      } else {
        newTranscript.push(trans)
      }
    })

    interface IGroupBySemester {
      semester: number
      data: ITranscript[]
    }

    const groupBySemester = () => {
      return newTranscript.reduce((groups: IGroupBySemester[], item) => {
        const semester = item.semester

        // Check if group already exists
        let group = groups.find(g => g.semester === semester)

        if (!group) {
          // Create new group object
          group = {
            semester,
            data: [],
          }

          // Add to groups array
          groups.push(group)
        }

        // Add item to data array
        group.data.push(item)

        return groups
      }, [])
    }

    return NextResponse.json(groupBySemester())
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
