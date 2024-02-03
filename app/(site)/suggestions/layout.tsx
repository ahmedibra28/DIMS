import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Suggestions',
  }),
}

export default function SuggestionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
