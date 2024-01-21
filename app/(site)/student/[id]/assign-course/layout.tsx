import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Assign Student to Course',
  }),
}

export default function AssignCourseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
