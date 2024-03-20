import DateTime from '@/lib/dateTime'

const getColor = (status: string | boolean) => {
  switch (status) {
    case true:
      return 'text-green-500'
    case false:
      return 'text-red-500'
    case 'MORNING':
      return 'text-blue-500'
    case 'AFTERNOON':
      return 'text-yellow-500'
    default:
      return ''
  }
}

export const columns = () => {
  return [
    {
      header: 'Roll No',
      accessorKey: 'assignCourse.student.rollNo',
      active: true,
    },
    { header: 'Name', accessorKey: 'assignCourse.student.name', active: true },
    { header: 'Course', accessorKey: 'assignCourse.course.name', active: true },
    {
      header: 'Subject',
      accessorKey: 'assignSubject.subject.name',
      active: true,
    },
    { header: 'Semester', accessorKey: 'assignCourse.semester', active: true },
    {
      header: 'Shift',
      accessorKey: 'assignCourse.shift',
      active: true,
      cell: ({ row: { original } }: any) => (
        <span className={getColor(original?.assignCourse.shift)}>
          {original?.assignCourse.shift}
        </span>
      ),
    },

    {
      header: 'Ins. Roll No',
      accessorKey: 'assignSubject.instructor.rollNo',
      active: true,
    },
    {
      header: 'Ins. Name',
      accessorKey: 'assignSubject.instructor.name',
      active: true,
    },
    {
      header: 'Is Attended',
      accessorKey: 'type',
      active: true,
      cell: ({ row: { original } }: any) => (
        <span className={getColor(original?.isPresent)}>
          {original?.isPresent ? 'YES' : 'NO'}
        </span>
      ),
    },
    {
      header: 'Attendance Date',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) =>
        DateTime(original?.createdAt).format('DD-MM-YYYY'),
    },
  ]
}
