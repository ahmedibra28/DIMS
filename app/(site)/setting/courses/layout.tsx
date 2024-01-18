import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Courses',
  }),
}

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
