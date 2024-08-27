import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Temporary Transaction',
  }),
}

export default function TemporaryTransactionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
