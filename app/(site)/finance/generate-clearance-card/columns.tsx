import { ActionButton } from '@/components/ui/CustomForm'
import DateTime from '@/lib/dateTime'

type Column = {
  editHandler: (item: any) => void
  isPending: boolean
}

export const columns = ({ editHandler, isPending }: Column) => {
  return [
    { header: 'Course', accessorKey: 'subject.course.name', active: true },
    { header: 'Subject', accessorKey: 'subject.name', active: true },
    { header: 'Semester', accessorKey: 'semester', active: true },
    { header: 'Shift', accessorKey: 'shift', active: true },
    {
      header: 'Has Active Exam',
      accessorKey: 'subject.hasActiveExam',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.subject.hasActiveExam ? (
          <span className='text-green-500'>ACTIVE</span>
        ) : (
          <span className='text-red-500'>INACTIVE</span>
        ),
    },
    {
      header: 'Description',
      accessorKey: 'subject.examDescription',
      active: true,
    },
    {
      header: 'Exam Date',
      accessorKey: 'subject.examDate',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.subject?.hasActiveExam
          ? DateTime(original?.subject?.examDate).format('DD-MM-YYYY')
          : '-',
    },
    {
      header: 'Action',
      active: true,
      cell: ({ row: { original } }: any) => (
        <ActionButton
          editHandler={editHandler}
          isPending={isPending}
          original={original}
        />
      ),
    },
  ]
}
