import { ActionButton } from '@/components/ui/CustomForm'
import { Badge } from '@/components/ui/badge'
import DateTime from '@/lib/dateTime'
import { UserInfo } from '@/zustand/userStore'
import { FaBell } from 'react-icons/fa6'

type Column = {
  editHandler: (item: any) => void
  isPending: boolean
  deleteHandler: (item: any) => void
  userInfo: UserInfo
}

export const columns = ({
  editHandler,
  isPending,
  deleteHandler,
  userInfo,
}: Column) => {
  return [
    {
      header: 'Title',
      accessorKey: 'title',
      active: true,
    },
    { header: 'Subject', accessorKey: 'subject.name', active: true },
    { header: 'Semester', accessorKey: 'subject.semester', active: true },
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
