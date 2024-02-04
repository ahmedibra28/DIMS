import { isAuth } from '@/lib/auth'
import { allowedRoles, getErrorResponse } from '@/lib/helpers'
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
    const isEditAllowed = allowedRoles.includes(role)

    const resourceObj = await prisma.resource.findUnique({
      where: { id: params.id },
    })

    if (!resourceObj) return getErrorResponse('Resource not found', 404)

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

      await prisma.resource.update({
        where: {
          id: params.id,
          createdById: req.user.id,
        },
        data: {
          note,
          title: `Resource for ${check.subject.name} semester ${check.subject.semester} ${check.shift} shift by ${check.instructor.name}`,
          file,
          subjectId,
          status,
        },
      })
    }

    return NextResponse.json({
      ...resourceObj,
      message: 'Resource has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const resourceObj = await prisma.resource.delete({
      where: { id: params.id },
    })

    if (!resourceObj) return getErrorResponse('Resource not removed', 404)

    return NextResponse.json({
      ...resourceObj,
      message: 'Resource has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
