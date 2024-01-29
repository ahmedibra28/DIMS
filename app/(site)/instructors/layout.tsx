import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Instructors',
  }),
}

export default function InstructorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
