import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Assign Instructor to Subject',
  }),
}

export default function AssignSubjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
