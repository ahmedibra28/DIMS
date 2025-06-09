import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: Promise<{
    id: string
  }>
}
export async function PUT(req: Request, props: Params) {
  const params = await props.params;
  try {
    await isAuth(req, params)

    const { hasActiveExam, examDescription, examDate } = await req.json()

    const obj = await prisma.subject.findUnique({
      where: { id: `${params.id}` },
    })

    if (!obj) return getErrorResponse('Subject not found', 404)

    const subjectObj = await prisma.subject.update({
      where: { id: params.id },
      data: {
        hasActiveExam,
        examDescription,
        examDate: new Date(examDate),
      },
    })

    return NextResponse.json({
      ...subjectObj,
      message: 'Subject has updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
