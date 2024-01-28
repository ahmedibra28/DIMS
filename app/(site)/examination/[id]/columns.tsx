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
    { header: 'Subject', accessorKey: 'subject.name', active: true },
    { header: 'Examination', accessorKey: 'examination', active: true },
    { header: 'Semester', accessorKey: 'semester', active: true },
    {
      header: 'Theory Marks',
      accessorKey: 'theoryMarks',
      active: true,
      cell: ({ row: { original } }: any) => (
        <FormatNumber value={original.theoryMarks} isCurrency={false} />
      ),
    },
    {
      header: 'Practical Marks',
      accessorKey: 'practicalMarks',
      active: true,
      cell: ({ row: { original } }: any) => (
        <FormatNumber value={original.practicalMarks} isCurrency={false} />
      ),
    },
    {
      header: 'Total Marks',
      accessorKey: 'average',
      active: true,
      cell: ({ row: { original } }: any) => (
        <FormatNumber
          value={original.theoryMarks + original.practicalMarks}
          isCurrency={false}
        />
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
