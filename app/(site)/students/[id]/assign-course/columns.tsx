import { FormatNumber } from '@/components/FormatNumber'
import { ActionButton } from '@/components/ui/CustomForm'
import DateTime from '@/lib/dateTime'

type Column = {
  editHandler: (item: any) => void
  isPending: boolean
  generateTuitionFeeHandler: (item: any) => void
  deleteHandler: (item: any) => void
  upgradeClass: (id: string) => void
}

export const columns = ({
  editHandler,
  isPending,
  generateTuitionFeeHandler,
  deleteHandler,
  upgradeClass,
}: Column) => {
  return [
    { header: 'Course', accessorKey: 'course.name', active: true },
    { header: 'Semester', accessorKey: 'semester', active: true },
    { header: 'Shift', accessorKey: 'shift', active: true },
    { header: 'Sponsor', accessorKey: 'sponsor.name', active: true },

    {
      header: 'Discount',
      accessorKey: 'discount',
      active: true,
      cell: ({ row: { original } }: any) => (
        <>
          <FormatNumber value={original?.discount} isCurrency={false} />%
        </>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.status === 'ACTIVE' ? (
          <span className='text-green-500'>{original?.status}</span>
        ) : original?.status === 'PASSED' ? (
          <span className='text-purple-500'>{original?.status}</span>
        ) : original?.status === 'GRADUATED' ? (
          <span className='text-blue-500'>{original?.status}</span>
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
          upgradeClass={upgradeClass}
          generateTuitionFeeHandler={generateTuitionFeeHandler}
          navigateToExam={true}
        />
      ),
    },
  ]
}
