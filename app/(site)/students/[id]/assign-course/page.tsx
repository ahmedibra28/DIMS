'use client'

import React, {
  useState,
  useEffect,
  FormEvent,
  useTransition,
  use,
} from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import FormView from '@/components/FormView'
import Spinner from '@/components/Spinner'
import type {
  AssignCourse as IAssignCourse,
  Student as IStudent,
} from '@prisma/client'
import RTable from '@/components/RTable'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import useDataStore from '@/zustand/dataStore'
import { columns } from './columns'
import getCoursesById from '@/actions/getCoursesById'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { FormatNumber } from '@/components/FormatNumber'

const FormSchema = z.object({
  semester: z.string().min(1),
  shift: z.string().min(1),
  discount: z.string().min(1),
  status: z.string().min(1),
  courseId: z.string().min(1),
  sponsorId: z.string().optional(),
})

interface Props {
  params: Promise<{
    id: string
  }>
}

const Page = (props: Props) => {
  const params = use(props.params)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')
  const [semester, setSemester] = useState<{ label: string; value: string }[]>(
    []
  )

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const [isPending, startTransition] = useTransition()

  const { dialogOpen, setDialogOpen } = useDataStore(state => state)

  const getStudent = useApi({
    key: ['student', params.id],
    method: 'GET',
    url: `students/${params.id}`,
  })?.get

  const getApi = useApi({
    key: ['assign-courses', params.id],
    method: 'GET',
    url: `assign-student-to-course/${params.id}?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const postApi = useApi({
    key: ['assign-courses'],
    method: 'POST',
    url: `assign-student-to-course`,
  })?.post

  const updateApi = useApi({
    key: ['assign-courses'],
    method: 'PUT',
    url: `assign-student-to-course`,
  })?.put

  const deleteApi = useApi({
    key: ['assign-courses'],
    method: 'DELETE',
    url: `assign-student-to-course`,
  })?.deleteObj

  const upgradeClassApi = useApi({
    key: ['assign-courses'],
    method: 'POST',
    url: `upgrade-class-to-next-level`,
  })?.post

  const generateTuitionFeeApi = useApi({
    key: ['assign-courses'],
    method: 'POST',
    url: `generate-tuition-fee/student`,
  })?.post

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      semester: '',
      shift: '',
      discount: '',
      status: '',
      courseId: '',
      sponsorId: '',
    },
  })

  useEffect(() => {
    if (
      postApi?.isSuccess ||
      updateApi?.isSuccess ||
      deleteApi?.isSuccess ||
      upgradeClassApi?.isSuccess
    ) {
      getApi?.refetch()
      setDialogOpen(false)
    }

    // eslint-disable-next-line
  }, [
    postApi?.isSuccess,
    updateApi?.isSuccess,
    deleteApi?.isSuccess,
    upgradeClassApi?.isSuccess,
  ])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [limit])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const editHandler = (item: IAssignCourse) => {
    setId(item.id!)
    setEdit(true)
    form.setValue('semester', String(item?.semester))
    form.setValue('shift', item?.shift)
    form.setValue('discount', String(item?.discount))
    form.setValue('status', item?.status)
    form.setValue('courseId', item?.courseId)
    item?.sponsorId && form.setValue('sponsorId', item?.sponsorId)
  }

  const generateTuitionFeeHandler = (item: IAssignCourse) => {
    console.log('Generate Tuition Fee')
    console.log(item)
    generateTuitionFeeApi?.mutateAsync({
      assignCourseId: item.id,
      studentId: item.studentId,
    })
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'Assign Course'
  const modal = 'assignCourse'

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEdit(false)
      setId(null)
      setSemester([])
    }
    // eslint-disable-next-line
  }, [dialogOpen])

  const status = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' },
  ]

  const shift = [
    { label: 'Morning', value: 'MORNING' },
    { label: 'Afternoon', value: 'AFTERNOON' },
  ]

  useEffect(() => {
    if (form.watch().courseId) {
      startTransition(() => {
        getCoursesById({ courseId: form.watch().courseId }).then(res => {
          const numberToArray = Array.from(
            { length: res?.duration || 0 },
            (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })
          )

          // form.setValue('semester', '')
          setSemester(numberToArray)
        })
      })
    }

    // eslint-disable-next-line
  }, [form.watch().courseId])

  const upgradeClass = (id: string) => upgradeClassApi?.mutateAsync({ id })

  const formFields = (
    <Form {...form}>
      <div className='grid grid-cols-1 gap-x-4 md:grid-cols-2'>
        <CustomFormField
          form={form}
          name='courseId'
          label='Course'
          placeholder='Course'
          fieldType='command'
          data={[]}
          key='courses'
          url='courses?page=1&limit=10&status=ACTIVE'
        />
        <CustomFormField
          form={form}
          name='semester'
          label='Semester'
          placeholder='Semester'
          fieldType='select'
          data={semester}
        />

        <CustomFormField
          form={form}
          name='discount'
          label='Discount'
          placeholder='Discount'
          type='number'
        />

        <CustomFormField
          form={form}
          name='shift'
          label='Shift'
          placeholder='Shift'
          fieldType='command'
          data={shift}
        />
        <CustomFormField
          form={form}
          name='sponsorId'
          label='Sponsor'
          placeholder='Sponsor'
          fieldType='command'
          data={[]}
          key='sponsors'
          url='sponsors?page=1&limit=10&status=ACTIVE'
        />

        <CustomFormField
          form={form}
          name='status'
          label='Status'
          placeholder='Status'
          fieldType='command'
          data={status}
        />
      </div>
    </Form>
  )

  const onSubmit = (
    values: z.infer<typeof FormSchema> & { studentId: string }
  ) => {
    values.studentId = params.id
    edit
      ? updateApi?.mutateAsync({
          id: id,
          ...values,
        })
      : postApi?.mutateAsync(values)
  }

  const student = getStudent?.data as IStudent | undefined

  return (
    <>
      {deleteApi?.isSuccess && <Message value={deleteApi?.data?.message} />}
      {deleteApi?.isError && <Message value={deleteApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}
      {upgradeClassApi?.isSuccess && (
        <Message value={upgradeClassApi?.data?.message} />
      )}
      {upgradeClassApi?.isError && <Message value={upgradeClassApi?.error} />}
      {generateTuitionFeeApi?.isSuccess && (
        <Message value={generateTuitionFeeApi?.data?.message} />
      )}
      {generateTuitionFeeApi?.isError && (
        <Message value={generateTuitionFeeApi?.error} />
      )}

      <TopLoadingBar
        isFetching={
          getApi?.isFetching ||
          getApi?.isPending ||
          isPending ||
          getStudent?.isPending ||
          upgradeClassApi?.isPending ||
          deleteApi?.isPending ||
          generateTuitionFeeApi?.isPending
        }
      />

      <FormView
        form={formFields}
        loading={updateApi?.isPending || postApi?.isPending || isPending}
        handleSubmit={form.handleSubmit}
        submitHandler={onSubmit}
        label={label}
        edit={edit}
      />

      {getStudent?.isPending ? (
        <Spinner />
      ) : getStudent?.isError ? (
        <Message value={getStudent?.error} />
      ) : (
        <div className='mb-10 mt-2 flex flex-col flex-wrap gap-2 bg-white p-3 md:flex-row'>
          <div className='w-full'>
            <div className='flex items-center justify-between'>
              <div className='relative w-44 p-2'>
                <Image
                  src={getStudent?.data?.image || '/avatar.png'}
                  alt='student'
                  width={200}
                  height={200}
                  className='m-auto w-44 rounded'
                />
                <div className='absolute -top-2 right-0'>
                  {student?.status === 'ACTIVE' ? (
                    <Badge
                      className='h-[22px] w-5 rounded-full bg-green-500'
                      title={student?.status}
                    />
                  ) : (
                    <Badge
                      className='h-[22px] w-5 rounded-full bg-red-500'
                      title={student?.status}
                    />
                  )}
                </div>
              </div>
              <h1
                className={`text-5xl duration-1000 md:text-6xl lg:text-8xl ${
                  Number(student?.balance || 0) > 0 ? 'text-red-500' : ''
                }`}
              >
                <h6 className='text-sm text-primary'>Student Balance</h6>
                <FormatNumber value={student?.balance || 0} />
              </h1>
            </div>

            {student?.note && (
              <div className='font-mono text-sm'>
                <p>{student?.note}</p>
              </div>
            )}
          </div>
          <div className='bg-white p-2 shadow sm:w-full md:w-[48%] lg:w-[32%]'>
            <h4 className='font-bold text-primary'>PERSONAL INFORMATION</h4>
            <Table>
              <TableBody>
                {[
                  { label: 'Roll No', value: student?.rollNo },
                  { label: 'Name', value: student?.name },
                  { label: 'Place of Birth', value: student?.placeOfBirth },
                  { label: 'Date of Birth', value: student?.dateOfBirth },
                  { label: 'Nationality', value: student?.nationality },
                  { label: 'Sex', value: student?.sex },
                  { label: 'Education', value: student?.education },
                ].map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className='py-1 font-medium'>
                      {item?.label}
                    </TableCell>
                    <TableCell className='py-1 font-light'>
                      {item?.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='bg-white p-2 shadow sm:w-full md:w-[48%] lg:w-[32%]'>
            <h4 className='font-bold text-primary'>PERMANENT ADDRESS</h4>
            <Table>
              <TableBody>
                {[
                  { label: 'District', value: student?.district },
                  { label: 'Mobile', value: student?.mobile },
                ].map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className='py-1 font-medium'>
                      {item?.label}
                    </TableCell>
                    <TableCell className='py-1 font-light'>
                      {item?.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='bg-white p-2 shadow sm:w-full md:w-[48%] lg:w-[32%]'>
            <h4 className='font-bold text-primary'>
              CONTACT PERSON IN CASE OF EMERGENCY
            </h4>
            <Table>
              <TableBody>
                {[
                  { label: 'Contact Name', value: student?.contactName },
                  { label: 'Contact Mobile', value: student?.contactMobile },
                  { label: 'Contact Email', value: student?.contactEmail },
                  {
                    label: 'Contact Relation',
                    value: student?.contactRelation,
                  },
                ].map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className='py-1 font-medium'>
                      {item?.label}
                    </TableCell>
                    <TableCell className='py-1 font-light'>
                      {item?.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='bg-white p-2 shadow sm:w-full md:w-[48%] lg:w-[32%]'>
            <h4 className='font-bold text-primary'>LANGUAGE SKILLS</h4>
            <Table>
              <TableBody>
                {[
                  { label: 'Somali Language', value: student?.somaliLanguage },
                  { label: 'Arabic Language', value: student?.arabicLanguage },
                  {
                    label: 'English Language',
                    value: student?.englishLanguage,
                  },
                  {
                    label: 'Kiswahili Language',
                    value: student?.kiswahiliLanguage,
                  },
                ].map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className='py-1 font-medium'>
                      {item?.label}
                    </TableCell>
                    <TableCell className='py-1 font-light'>
                      {item?.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message value={getApi?.error} />
      ) : (
        <div className='mt-2 overflow-x-auto bg-white p-3'>
          <RTable
            data={getApi?.data}
            columns={columns({
              editHandler,
              isPending: deleteApi?.isPending || false,
              deleteHandler,
              upgradeClass,
              generateTuitionFeeHandler,
            })}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            modal={modal}
            caption='Assign Courses List'
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
