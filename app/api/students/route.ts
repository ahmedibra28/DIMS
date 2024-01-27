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
      prisma.student.findMany({
        where: query,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.student.count({ where: query }),
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
      education,
      district,
      mobile,
      contactName,
      contactMobile,
      contactEmail,
      contactRelation,
      somaliLanguage,
      arabicLanguage,
      englishLanguage,
      kiswahiliLanguage,
      image,
      note,
      status,
      admission,
    } = await req.json()

    const count = await prisma.student.count()
    const rollNo = rollNoGenerator('student', count)

    const checkExistence =
      rollNo &&
      (await prisma.student.findFirst({
        where: {
          rollNo,
        },
      }))
    if (checkExistence) return getErrorResponse('Student already exist')

    const studentObj = await prisma.$transaction(async (prisma) => {
      const studentObj = await prisma.student.create({
        data: {
          rollNo,
          name,
          placeOfBirth,
          dateOfBirth,
          nationality,
          sex,
          education,
          district,
          mobile: Number(mobile),
          contactName,
          contactMobile: Number(contactMobile),
          contactEmail,
          contactRelation,
          somaliLanguage,
          arabicLanguage,
          englishLanguage,
          kiswahiliLanguage,
          image,
          note,
          status,
          createdById: req.user.id,
          ...(admission && {
            balance: parseFloat('5.00'),
          }),
        },
      })

      if (admission) {
        await prisma.transaction.create({
          data: {
            amount: parseFloat('5.00'),
            discount: parseFloat('0.00'),
            studentId: studentObj.id,
            type: 'ENROLLMENT_FEE',
            status: 'ACTIVE',
            createdById: req.user.id,
            description: `Enrollment fee for ${
              studentObj.name
            } at ${new Date().toLocaleString()}`,
            paymentStatus: 'UNPAID',
          },
        })
      }

      return studentObj
    })

    return NextResponse.json({
      ...studentObj,
      message: 'Student created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
