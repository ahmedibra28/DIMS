import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Students',
  }),
}

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
