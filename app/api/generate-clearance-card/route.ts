import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/lib/prisma.db'
import type { Status as IStatus } from '@prisma/client'

export async function GET(req: Request) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const status = {
      ...(searchParams.get('status') && {
        status: searchParams.get('status')?.toUpperCase(),
      }),
    } as { status: IStatus }

    const query = q
      ? {
          OR: [
            {
              subject: {
                course: {
                  name: { contains: q, mode: QueryMode.insensitive },
                  status: 'ACTIVE' as IStatus,
                },
              },
            },
            {
              subject: {
                name: { contains: q, mode: QueryMode.insensitive },
                status: 'ACTIVE' as IStatus,
              },
            },
          ],
          ...status,
        }
      : {
          ...status,
          subject: {
            status: 'ACTIVE' as IStatus,
          },
        }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.assignSubject.findMany({
        where: query,
        select: {
          id: true,
          semester: true,
          shift: true,
          subject: {
            select: {
              id: true,
              name: true,
              hasActiveExam: true,
              examDescription: true,
              examDate: true,
              course: {
                select: { name: true },
              },
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.assignSubject.count({ where: query }),
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
