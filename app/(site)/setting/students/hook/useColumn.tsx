import { ActionButton } from '@/components/ui/CustomForm'
import DateTime from '@/lib/dateTime'

type Column = {
  editHandler: (item: any) => void
  isPending: boolean
  deleteHandler: (item: any) => void
  formChildren: React.ReactNode
}

export const useColumn = ({
  editHandler,
  isPending,
  deleteHandler,
  formChildren,
}: Column) => {
  const actionDropdown = (original: any) => (
    <ActionButton
      {...{
        editHandler,
        isPending,
        deleteHandler,
        original,
        formChildren,
      }}
    />
  )

  const columns = [
    { header: 'Roll No', accessorKey: 'rollNo', active: true },
    { header: 'Name', accessorKey: 'name', active: true },
    { header: 'Place of Birth', accessorKey: 'placeOfBirth', active: false },
    { header: 'Date of Birth', accessorKey: 'dateOfBirth', active: false },
    { header: 'Sex', accessorKey: 'sex', active: true },
    { header: 'District', accessorKey: 'district', active: true },
    { header: 'Mobile', accessorKey: 'mobile', active: true },
    { header: 'Nationality', accessorKey: 'nationality', active: false },
    { header: 'Education', accessorKey: 'education', active: false },
    { header: 'Contact Name', accessorKey: 'contactName', active: false },
    { header: 'Contact Mobile', accessorKey: 'contactMobile', active: true },
    {
      header: 'Contact Relationship',
      accessorKey: 'contactRelationship',
      active: false,
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
      cell: ({ row: { original } }: any) => actionDropdown(original),
    },
  ]

  return { columns }
}
