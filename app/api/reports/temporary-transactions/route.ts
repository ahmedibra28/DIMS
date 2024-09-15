import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/lib/prisma.db'

export async function GET(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const course = searchParams.get('course')
    const student = searchParams.get('student')
    const rollNo = searchParams.get('rollNo')

    const query = {
      ...(course && {
        courseId: course,
      }),
      ...(student && {
        student: student,
      }),
      ...(rollNo && {
        rollNo: rollNo.toUpperCase(),
      }),
    }
    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.temporaryTransaction.findMany({
        where: query,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.temporaryTransaction.count({ where: query }),
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
