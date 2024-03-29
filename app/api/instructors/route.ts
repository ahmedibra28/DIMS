import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/lib/prisma.db'

import type { Status as IStatus } from '@prisma/client'
import { rollNoGenerator } from '@/lib/rollNoGenerator'

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
              name: { contains: q, mode: QueryMode.insensitive },
            },
            {
              rollNo: { contains: q, mode: QueryMode.insensitive },
            },
          ],
          ...status,
        }
      : { ...status }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.instructor.findMany({
        where: query,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.instructor.count({ where: query }),
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

export async function POST(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const {
      name,
      placeOfBirth,
      dateOfBirth,
      nationality,
      sex,
      email,
      qualification,
      experience,
      district,
      mobile,
      contactName,
      contactMobile,
      contactEmail,
      contactRelation,
      image,
      note,
      status,
    } = await req.json()

    const count = await prisma.instructor.count()
    const rollNo = rollNoGenerator('instructor', count)

    const checkExistence =
      rollNo &&
      (await prisma.instructor.findFirst({
        where: {
          rollNo,
        },
      }))
    if (checkExistence) return getErrorResponse('Instructor already exist')

    const instructorObj = await prisma.instructor.create({
      data: {
        rollNo,
        name,
        placeOfBirth,
        dateOfBirth,
        nationality,
        sex,
        email,
        qualification,
        experience,
        district,
        mobile: Number(mobile),
        contactName,
        contactMobile: Number(contactMobile),
        contactEmail,
        contactRelation,
        image,
        note,
        status,
        createdById: req.user.id,
      },
    })

    return NextResponse.json({
      ...instructorObj,
      message: 'Instructor created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
