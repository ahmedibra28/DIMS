import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Print Clearance Card',
  }),
}

export default function PrintClearanceCardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
