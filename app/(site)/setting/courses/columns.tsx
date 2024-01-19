import { FormatNumber } from '@/components/FormatNumber'
import { ActionButton } from '@/components/ui/CustomForm'
import DateTime from '@/lib/dateTime'

type Column = {
  editHandler: (item: any) => void
  isPending: boolean
  deleteHandler: (item: any) => void
}

export const columns = ({ editHandler, isPending, deleteHandler }: Column) => {
  return [
    { header: 'Name', accessorKey: 'name', active: true },
    { header: 'School', accessorKey: 'school.name', active: true },
    { header: 'Examinations', accessorKey: 'examinations', active: false },
    { header: 'Certificate', accessorKey: 'certificate', active: true },
    { header: 'Enrolment', accessorKey: 'enrolment', active: false },
    {
      header: 'Price',
      accessorKey: 'price',
      active: true,
      cell: ({ row: { original } }: any) => (
        <FormatNumber value={original?.price} />
      ),
    },
    { header: 'Duration', accessorKey: 'duration', active: true },
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
      header: 'CreatedAt',
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
          editHandler={editHandler}
          isPending={isPending}
          deleteHandler={deleteHandler}
          original={original}
        />
      ),
    },
  ]
}
