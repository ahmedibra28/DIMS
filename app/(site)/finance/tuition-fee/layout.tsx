import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Tuition Fee',
  }),
}

export default function TuitionFeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
