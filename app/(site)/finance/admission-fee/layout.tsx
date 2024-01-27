import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Admission Fee',
  }),
}

export default function AdmissionFeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
