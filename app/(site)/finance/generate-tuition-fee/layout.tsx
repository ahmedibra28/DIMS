import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Generate Tuition Fee',
  }),
}

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
