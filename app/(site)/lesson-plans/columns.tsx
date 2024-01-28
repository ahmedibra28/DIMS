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
      cell: ({ row: { original } }: any) => (
        <div>
          {original?.title}

          {!original?.isApproved && (
            <>
              {userInfo.id === original?.createdById &&
                !original?.isCreatedRead && (
                  <Badge className='ml-1 bg-green-500 text-xs'>unread</Badge>
                )}

              {['ADMIN', 'SUPER_ADMIN'].includes(userInfo?.role) &&
                !original?.isAdminRead && (
                  <Badge className='ml-1 bg-green-500 text-xs'>unread</Badge>
                )}
            </>
          )}
        </div>
      ),
    },
    { header: 'Subject', accessorKey: 'subject.name', active: true },
    { header: 'Semester', accessorKey: 'subject.semester', active: true },
    {
      header: 'Approved',
      accessorKey: 'isApproved',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.isApproved ? (
          <span className='text-green-500'>Approved</span>
        ) : (
          <span className='text-blue-500'>Pending</span>
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
