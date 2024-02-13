import { Checkbox } from '@/components/ui/checkbox'

type Column = {
  checkboxHandler: (e: any) => void
}

export const columns = ({ checkboxHandler }: Column) => {
  return [
    {
      header: 'Select',
      id: 'select',
      accessorKey: 'id',
      active: true,
      cell: ({ row }: any) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => {
              row.toggleSelected(!!value)
              checkboxHandler({
                ...row.original,
                present: value,
              })
            }}
            aria-label='Select row'
          />
        )
      },
    },
    { header: 'Roll No', accessorKey: 'student.rollNo', active: true },
    { header: 'Student', accessorKey: 'student.name', active: true },
    { header: 'Course', accessorKey: 'course.name', active: true },
    {
      header: 'Subject',
      accessorKey: 'course.subject.[0].name',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.course?.subject?.[0]?.name,
    },
  ]
}
