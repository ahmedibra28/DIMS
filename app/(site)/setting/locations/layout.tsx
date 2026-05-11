import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Locations',
  }),
}

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
