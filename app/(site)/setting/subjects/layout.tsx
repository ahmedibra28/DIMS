import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Subjects',
  }),
}

export default function SubjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
