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

    const { title, body, status } = await req.json()

    const suggestionObj = await prisma.suggestion.findFirst({
      where: { id: `${params.id}`, createdById: `${req.user.id}` },
    })

    if (!suggestionObj) return getErrorResponse('Suggestion not found', 404)

    await prisma.suggestion.update({
      where: { id: params.id },
      data: {
        body,
        title,
        status,
      },
    })

    return NextResponse.json({
      ...suggestionObj,
      message: 'Suggestion has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: NextApiRequestExtended, { params }: Params) {
  try {
    await isAuth(req, params)

    const suggestionObj = await prisma.suggestion.delete({
      where: { id: params.id, createdById: req.user.id },
    })

    if (!suggestionObj) return getErrorResponse('Suggestion not removed', 404)

    return NextResponse.json({
      ...suggestionObj,
      message: 'Suggestion has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
