import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Attendance',
  }),
}

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
