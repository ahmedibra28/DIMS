import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Resources',
  }),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
