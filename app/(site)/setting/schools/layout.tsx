import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Schools',
  }),
}

export default function SchoolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
