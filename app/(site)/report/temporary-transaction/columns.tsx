import { FormatNumber } from '@/components/FormatNumber'
import { ActionButton } from '@/components/ui/CustomForm'
import DateTime from '@/lib/dateTime'

export const columns = ({
  updateStatusHandler,
  deleteHandler,
  isPending,
}: {
  updateStatusHandler: ({
    id,
    status,
  }: {
    id: string
    status: 'PAID' | 'UNPAID'
  }) => void
  deleteHandler: (item: any) => void
  isPending: boolean
}) => {
  return [
    { header: 'Roll No', accessorKey: 'rollNo', active: true },
    { header: 'Student', accessorKey: 'student', active: true },
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
      header: 'Payment Date',
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
          handleUpdate={updateStatusHandler}
          deleteHandler={deleteHandler}
        />
      ),
    },
  ]
}
