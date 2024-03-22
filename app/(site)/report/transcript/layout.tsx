import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Transcript',
  }),
}

export default function TranscriptLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
