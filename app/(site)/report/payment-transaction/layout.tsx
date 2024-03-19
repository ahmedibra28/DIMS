import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Payment Transaction',
  }),
}

export default function PaymentTransactionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
