'use server'

import DateTime from '@/lib/dateTime'
import { prisma } from '@/lib/prisma.db'

export default async function getCounts() {
  try {
    const thisMonth = {
      s: DateTime().utc().startOf('month').format(),
      e: DateTime().utc().endOf('month').format(),
    }

    const lastSixMonths = {
      s: DateTime().utc().subtract(6, 'month').startOf('month').format(),
      e: DateTime().utc().endOf('month').format(),
    }

    const lastMonth = {
      s: DateTime().utc().subtract(1, 'month').startOf('month').format(),
      e: DateTime().utc().subtract(1, 'month').endOf('month').format(),
    }

    const lastYear = {
      s: DateTime().utc().subtract(1, 'year').startOf('year').format(),
      e: DateTime().utc().subtract(1, 'year').endOf('year').format(),
    }

    const schools = await prisma.school.count({
      where: { status: 'ACTIVE' },
    })

    const sponsors = await prisma.sponsor.count({
      where: { status: 'ACTIVE' },
    })

    const activeStudents = await prisma.student.count({
      where: { status: 'ACTIVE' },
    })

    const graduatedStudents = await prisma.assignCourse.count({
      where: { status: 'GRADUATED' },
    })

    const dropOutStudents = await prisma.student.count({
      where: { status: 'INACTIVE' },
    })

    const thisMonthStudents = await prisma.student.count({
      where: {
        status: 'ACTIVE',
        createdAt: { gte: thisMonth.s, lte: thisMonth.e },
      },
    })

    const last6MonthStudents = await prisma.student.count({
      where: {
        status: 'ACTIVE',
        createdAt: { gte: lastSixMonths.s, lte: lastSixMonths.e },
      },
    })

    const activeInstructors = await prisma.instructor.count({
      where: { status: 'ACTIVE' },
    })

    const inActiveInstructors = await prisma.instructor.count({
      where: { status: 'INACTIVE' },
    })

    const todayIncome = await prisma.transaction.aggregate({
      where: {
        paymentStatus: 'PAID',
        status: 'ACTIVE',
        createdAt: {
          gte: thisMonth.s,
          lte: thisMonth.e,
        },
      },
      _sum: {
        amount: true,
      },
    })

    const thisMonthIncome = await prisma.transaction.aggregate({
      where: {
        paymentStatus: 'PAID',
        status: 'ACTIVE',
        createdAt: {
          gte: thisMonth.s,
          lte: thisMonth.e,
        },
      },
      _sum: {
        amount: true,
      },
    })

    const lastMonthIncome = await prisma.transaction.aggregate({
      where: {
        paymentStatus: 'PAID',
        status: 'ACTIVE',
        createdAt: {
          gte: lastMonth.s,
          lte: lastMonth.e,
        },
      },
      _sum: {
        amount: true,
      },
    })

    const last6MonthsIncome = await prisma.transaction.aggregate({
      where: {
        paymentStatus: 'PAID',
        status: 'ACTIVE',
        createdAt: {
          gte: lastSixMonths.s,
          lte: lastSixMonths.e,
        },
      },
      _sum: {
        amount: true,
      },
    })

    const lastYearIncome = await prisma.transaction.aggregate({
      where: {
        paymentStatus: 'PAID',
        status: 'ACTIVE',
        createdAt: {
          gte: lastYear.s,
          lte: lastYear.e,
        },
      },
      _sum: {
        amount: true,
      },
    })

    const unpaidFee = await prisma.transaction.aggregate({
      where: {
        paymentStatus: 'UNPAID',
        status: 'ACTIVE',
        type: 'TUITION_PAYMENT',
      },
      _sum: {
        amount: true,
      },
    })

    const unpaidAdmission = await prisma.transaction.aggregate({
      where: {
        paymentStatus: 'UNPAID',
        status: 'ACTIVE',
        type: 'ENROLLMENT_FEE',
      },
      _sum: {
        amount: true,
      },
    })

    const refundedPayments = await prisma.transaction.aggregate({
      where: {
        type: {
          in: ['REFUND_ENROLLMENT_FEE', 'REFUND_TUITION_PAYMENT'],
        },
      },
      _sum: {
        amount: true,
      },
    })

    const counts = [
      {
        label: 'Active Students',
        count: activeStudents || 0,
        isCurrency: false,
      },
      {
        label: 'Graduated Students',
        count: graduatedStudents || 0,
        isCurrency: false,
      },
      {
        label: 'Sponsors',
        count: sponsors || 0,
        isCurrency: false,
      },
      {
        label: 'This Month Students',
        count: thisMonthStudents || 0,
        isCurrency: false,
      },
      {
        label: 'Last 6 Months Students',
        count: last6MonthStudents || 0,
        isCurrency: false,
      },
      {
        label: 'Active Instructors',
        count: activeInstructors || 0,
        isCurrency: false,
      },
      {
        label: 'Inactive Instructors',
        count: inActiveInstructors || 0,
        isCurrency: false,
      },

      {
        label: "Today's Income",
        count: todayIncome?._sum?.amount || 0,
        isCurrency: true,
      },
      {
        label: 'This Month Income',
        count: thisMonthIncome?._sum?.amount || 0,
        isCurrency: true,
      },
      {
        label: 'Last Month Income',
        count: lastMonthIncome?._sum?.amount || 0,
        isCurrency: true,
      },
      {
        label: 'Last 6 Months Income',
        count: last6MonthsIncome?._sum?.amount || 0,
        isCurrency: true,
      },
      {
        label: 'Last Year Income',
        count: lastYearIncome?._sum?.amount || 0,
        isCurrency: true,
      },
      {
        label: 'Refunded',
        count: refundedPayments?._sum?.amount || 0,
        isCurrency: true,
      },
      {
        label: 'Unpaid Fee',
        count: unpaidFee?._sum?.amount || 0,
        isCurrency: true,
      },
      {
        label: 'Unpaid Admission',
        count: unpaidAdmission?._sum?.amount || 0,
        isCurrency: true,
      },
    ]

    return counts
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
