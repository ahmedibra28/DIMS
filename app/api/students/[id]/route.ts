import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

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
    } = await req.json()

    const studentObj = await prisma.student.findUnique({
      where: { id: params.id },
    })

    if (!studentObj) return getErrorResponse('Student not found', 404)

    await prisma.student.update({
      where: { id: params.id },
      data: {
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
      },
    })

    return NextResponse.json({
      ...studentObj,
      message: 'Student has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const studentObj = await prisma.student.delete({
      where: { id: params.id },
    })

    if (!studentObj) return getErrorResponse('Student not removed', 404)

    return NextResponse.json({
      ...studentObj,
      message: 'Student has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
