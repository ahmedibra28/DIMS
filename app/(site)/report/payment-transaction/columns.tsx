import { FormatNumber } from '@/components/FormatNumber'
import DateTime from '@/lib/dateTime'

const getColor = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'text-green-500'
    case 'UNPAID':
      return 'text-red-500'
    case 'TUITION_PAYMENT':
      return 'text-blue-500'
    case 'ENROLLMENT_FEE':
      return 'text-yellow-500'
    case 'REFUND_TUITION_PAYMENT':
      return 'text-red-500'
    default:
      return ''
  }
}

export const columns = () => {
  return [
    { header: 'Roll No', accessorKey: 'student.rollNo', active: true },
    { header: 'Name', accessorKey: 'student.name', active: true },
    {
      header: 'Course',
      accessorKey: 'course.name',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.course?.name || (
          <span className='text-xs text-red-500'>EMPTY!</span>
        ),
    },
    {
      header: 'Semester',
      accessorKey: 'semester',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.semester || (
          <span className='text-xs text-red-500'>EMPTY!</span>
        ),
    },
    {
      header: 'Shift',
      accessorKey: 'shift',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.shift || <span className='text-xs text-red-500'>EMPTY!</span>,
    },
    {
      header: 'Discount',
      accessorKey: 'discount',
      active: true,
      cell: ({ row: { original } }: any) => (
        <span className='text-red-500'>
          <FormatNumber value={original.discount} />
        </span>
      ),
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      active: true,
      cell: ({ row: { original } }: any) => (
        <span className='text-green-500'>
          <FormatNumber value={original.amount} />
        </span>
      ),
    },
    {
      header: 'Payment Method',
      accessorKey: 'paymentMethod',
      active: false,
      cell: ({ row: { original } }: any) => (
        <span className='text-green-500'>{original?.paymentMethod}</span>
      ),
    },
    {
      header: 'Transaction',
      accessorKey: 'type',
      active: false,
      cell: ({ row: { original } }: any) => (
        <span className={getColor(original?.type)}>{original?.type}</span>
      ),
    },
    {
      header: 'Payment Status',
      accessorKey: 'paymentStatus',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.paymentStatus === 'PAID' ? (
          <span className='text-green-500'>{original?.paymentStatus}</span>
        ) : (
          <span className='text-red-500'>{original?.paymentStatus}</span>
        ),
    },

    {
      header: 'Payment Date',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) =>
        DateTime(original?.createdAt).format('DD-MM-YYYY'),
    },
  ]
}
