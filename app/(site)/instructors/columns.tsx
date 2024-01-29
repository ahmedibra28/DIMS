import { ActionButton } from '@/components/ui/CustomForm'
import DateTime from '@/lib/dateTime'
import Image from 'next/image'
import Link from 'next/link'

type Column = {
  editHandler: (item: any) => void
  isPending: boolean
  deleteHandler: (item: any) => void
}

export const columns = ({ editHandler, isPending, deleteHandler }: Column) => {
  return [
    {
      header: 'Image',
      accessorKey: 'image',
      active: true,
      cell: ({ row }: any) => (
        <Image
          src={row.original?.image || '/avatar.png'}
          alt={row.original?.name}
          className='h-10 w-10 rounded-full object-cover'
          width={40}
          height={40}
        />
      ),
    },
    {
      header: 'Roll No',
      accessorKey: 'rollNo',
      active: true,
      cell: ({ row }: any) => (
        <Link
          className='underline'
          href={`/instructors/${row.original.id}/assign-subject`}
        >
          {row.original.rollNo}
        </Link>
      ),
    },
    {
      header: 'Name',
      accessorKey: 'name',
      active: true,
      cell: ({ row }: any) => (
        <Link
          className='underline'
          href={`/instructors/${row.original.id}/assign-subject`}
        >
          {row.original.name}
        </Link>
      ),
    },
    { header: 'Place of Birth', accessorKey: 'placeOfBirth', active: false },
    { header: 'Date of Birth', accessorKey: 'dateOfBirth', active: false },
    { header: 'Sex', accessorKey: 'sex', active: false },
    { header: 'Email', accessorKey: 'email', active: false },
    { header: 'Qualification', accessorKey: 'qualification', active: false },
    { header: 'Experience', accessorKey: 'experience', active: true },
    { header: 'District', accessorKey: 'district', active: true },
    { header: 'Mobile', accessorKey: 'mobile', active: true },
    { header: 'Nationality', accessorKey: 'nationality', active: false },
    { header: 'Contact Name', accessorKey: 'contactName', active: false },
    { header: 'Contact Mobile', accessorKey: 'contactMobile', active: false },
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
