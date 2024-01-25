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

    const { role } = req.user
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN']
    const isEditAllowed = allowedRoles.includes(role)

    const lessonPlanObj = await prisma.lessonPlan.findUnique({
      where: { id: params.id },
    })

    if (!lessonPlanObj) return getErrorResponse('Lesson plan not found', 404)

    if (!isEditAllowed) {
      const check = await prisma.assignSubject.findFirst({
        where: {
          status: 'ACTIVE',
          instructor: {
            id: `${req.user.instructorId}`,
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

      if (!check)
        return getErrorResponse('Subject or Instructor not found', 404)

      await prisma.lessonPlan.update({
        where: {
          id: params.id,
          createdById: req.user.id,
        },
        data: {
          note,
          title: `Lesson Plan for ${check.subject.name} semester ${check.subject.semester} ${check.shift} shift by ${check.instructor.name}`,
          file,
          subjectId,
          status,
          isAdminRead: false,
          isApproved: false,
          isCreatedRead: true,
        },
      })
    }

    if (isEditAllowed) {
      await prisma.lessonPlan.update({
        where: {
          id: params.id,
        },
        data: {
          note,
          isApproved,
          isAdminRead: true,
          isCreatedRead: false,
        },
      })
    }

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
