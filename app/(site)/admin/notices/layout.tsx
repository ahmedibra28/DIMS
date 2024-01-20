import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Notices',
  }),
}

export default function NoticesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
