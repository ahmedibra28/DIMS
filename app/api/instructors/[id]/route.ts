import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: Promise<{
    id: string
  }>
}

export async function GET(req: Request, props: Params) {
  const params = await props.params;
  try {
    await isAuth(req, params)

    const instructor = await prisma.instructor.findUnique({
      where: { id: params.id },
    })

    return NextResponse.json(instructor)
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function PUT(req: Request, props: Params) {
  const params = await props.params;
  try {
    await isAuth(req, params)

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

    const instructorObj = await prisma.instructor.findUnique({
      where: { id: params.id },
    })

    if (!instructorObj) return getErrorResponse('Instructor not found', 404)

    await prisma.instructor.update({
      where: { id: params.id },
      data: {
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
      },
    })

    return NextResponse.json({
      ...instructorObj,
      message: 'Instructor has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, props: Params) {
  const params = await props.params;
  try {
    await isAuth(req, params)

    const instructorObj = await prisma.instructor.delete({
      where: { id: params.id },
    })

    if (!instructorObj) return getErrorResponse('Instructor not removed', 404)

    return NextResponse.json({
      ...instructorObj,
      message: 'Instructor has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
