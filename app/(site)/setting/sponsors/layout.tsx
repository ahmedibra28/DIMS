import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Sponsors',
  }),
}

export default function SponsorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
