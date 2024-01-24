import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Lesson Plans',
  }),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
