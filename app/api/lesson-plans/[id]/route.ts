import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: NextApiRequestExtended, { params }: Params) {
  try {
    await isAuth(req, params)

    const { note, file, status, subjectId, isApproved } = await req.json()

    const lessonPlanObj = await prisma.lessonPlan.findUnique({
      where: { id: params.id },
    })

    if (!lessonPlanObj) return getErrorResponse('Lesson plan not found', 404)

    const check = await prisma.assignSubject.findFirst({
      where: {
        status: 'ACTIVE',
        instructor: {
          id: `${req.user.id}`,
          status: 'ACTIVE',
        },
        subject: {
          id: `${subjectId}`,
          status: 'ACTIVE',
        },
      },
      include: {
        subject: {
          select: {
            name: true,
            semester: true,
          },
        },
        instructor: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!check) return getErrorResponse('Subject or Instructor not found', 404)

    const { role } = req.user
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN']
    const isEditAllowed = allowedRoles.includes(role)

    await prisma.lessonPlan.update({
      where: {
        id: params.id,
        ...(!allowedRoles.includes(role) && {
          createdById: req.user.id,
        }),
      },
      data: {
        note,
        ...(isEditAllowed
          ? {
              isApproved,
              isAdminRead: true,
              isCreatedRead: false,
            }
          : {
              title: `Lesson Plan for ${check.subject.name} semester ${check.subject.semester} ${check.shift} shift by ${check.instructor.name}`,
              file,
              subjectId,
              status,
              isAdminRead: false,
              isApproved: false,
              isCreatedRead: true,
            }),
      },
    })

    return NextResponse.json({
      ...lessonPlanObj,
      message: 'Lesson plan has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const lessonPlanObj = await prisma.lessonPlan.delete({
      where: { id: params.id },
    })

    if (!lessonPlanObj) return getErrorResponse('Lesson plan not removed', 404)

    return NextResponse.json({
      ...lessonPlanObj,
      message: 'Lesson plan has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
