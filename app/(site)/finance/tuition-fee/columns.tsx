import { FormatNumber } from '@/components/FormatNumber'
import { ActionButton } from '@/components/ui/CustomForm'
import DateTime from '@/lib/dateTime'

type Column = {
  isPending: boolean
  handleUpdate: ({
    id,
    status,
  }: {
    id: string
    status: 'PAID' | 'UNPAID'
  }) => void
}

export const columns = ({ isPending, handleUpdate }: Column) => {
  return [
    { header: 'Roll No', accessorKey: 'student.rollNo', active: true },
    { header: 'Name', accessorKey: 'student.name', active: true },
    { header: 'Course', accessorKey: 'course.name', active: true },
    { header: 'Semester', accessorKey: 'semester', active: true },
    { header: 'Shift', accessorKey: 'shift', active: true },
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
      header: 'Status',
      accessorKey: 'status',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.status === 'ACTIVE' ? (
          <span className='text-green-500'>{original?.status}</span>
        ) : (
          <span className='text-red-500'>{original?.status}</span>
        ),
    },
    {
      header: 'Tuition Date',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) =>
        DateTime(original?.createdAt).format('DD-MM-YYYY'),
    },
    {
      header: 'Action',
      active: true,
      cell: ({ row: { original } }: any) => (
        <ActionButton
          isPending={isPending}
          original={original}
          handleUpdate={handleUpdate}
        />
      ),
    },
  ]
}
