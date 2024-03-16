'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getCounts() {
  try {
    const schools = await prisma.school.count({
      where: {
        status: 'ACTIVE',
      },
    })

    const counts = [
      { label: 'Schools', count: schools || 0, isCurrency: false },
      {
        label: 'Active Students',
        count: schools || 0,
        isCurrency: false,
      },
      {
        label: 'Graduated Students',
        count: schools || 0,
        isCurrency: false,
      },
      {
        label: 'Dropout Students',
        count: schools || 0,
        isCurrency: false,
      },
      {
        label: 'This Month Students',
        count: schools || 0,
        isCurrency: false,
      },
      {
        label: 'Last 6 Months Students',
        count: schools || 0,
        isCurrency: false,
      },
      {
        label: 'Active Instructors',
        count: schools || 0,
        isCurrency: false,
      },
      {
        label: 'Inactive Instructors',
        count: schools || 0,
        isCurrency: false,
      },

      {
        label: "Today's Income",
        count: schools || 0,
        isCurrency: true,
      },
      {
        label: 'This Month Income',
        count: schools || 0,
        isCurrency: true,
      },
      {
        label: 'Last Month Income',
        count: schools || 0,
        isCurrency: true,
      },
      {
        label: 'Last Year Income',
        count: schools || 0,
        isCurrency: true,
      },
      {
        label: 'Last 6 Months Income',
        count: schools || 0,
        isCurrency: true,
      },
      {
        label: 'Unpaid Fee',
        count: schools || 0,
        isCurrency: true,
      },
      {
        label: 'Unpaid Admission',
        count: schools || 0,
        isCurrency: true,
      },
    ]

    return counts
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
