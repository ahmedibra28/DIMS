import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

export async function POST(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { courseId, semester, shift } = await req.json()
    console.log({ courseId, semester, shift })
    const studentsInCourse = await prisma.assignCourse.findMany({
      where: {
        courseId,
        semester: parseInt(semester),
        ...(shift && { shift }),
      },
      select: {
        studentId: true,
        shift: true,
        semester: true,
        courseId: true,
      },
    })

    console.log(studentsInCourse?.length)

    return NextResponse.json({
      ...studentsInCourse,
      message: 'Tuition fee generated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
