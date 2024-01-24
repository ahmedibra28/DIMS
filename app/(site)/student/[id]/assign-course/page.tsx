'use client'

import React, { useState, useEffect, FormEvent, useTransition } from 'react'
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
})

const Page = ({ params }: { params: { id: string } }) => {
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

  const { dialogOpen, setDialogOpen } = useDataStore((state) => state)

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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      semester: '',
      shift: '',
      discount: '',
      status: '',
      courseId: '',
    },
  })

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
      getApi?.refetch()
      setDialogOpen(false)
    }

    // eslint-disable-next-line
  }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess])

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
        getCoursesById({ courseId: form.watch().courseId }).then((res) => {
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

  const formFields = (
    <Form {...form}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4'>
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

      <TopLoadingBar
        isFetching={
          getApi?.isFetching ||
          getApi?.isPending ||
          isPending ||
          getStudent?.isPending
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
        <div className='p-3 mt-2 mb-10 flex flex-wrap flex-col md:flex-row gap-2 bg-white'>
          <div className='w-full'>
            <div className='flex justify-between items-center'>
              <div className='p-2 relative w-44'>
                <Image
                  src={getStudent?.data?.image || '/images/placeholder.png'}
                  alt='student'
                  width={200}
                  height={200}
                  className='rounded m-auto w-44'
                />
                <div className='absolute -top-2 right-0'>
                  {student?.status === 'ACTIVE' ? (
                    <Badge
                      className='bg-green-500 h-[22px] w-5 rounded-full'
                      title={student?.status}
                    />
                  ) : (
                    <Badge
                      className='bg-red-500 h-[22px] w-5 rounded-full'
                      title={student?.status}
                    />
                  )}
                </div>
              </div>
              <h1
                className={`text-5xl md:text-6xl lg:text-8xl duration-1000 ${
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
          <div className='p-2 bg-white shadow sm:w-full md:w-[48%] lg:w-[32%]'>
            <h4 className='font-bold text-primary'>PERSONAL INFORMATION</h4>
            <Table>
              <TableBody>
                {[
                  { label: 'Name', value: student?.name },
                  { label: 'Place of Birth', value: student?.placeOfBirth },
                  { label: 'Date of Birth', value: student?.dateOfBirth },
                  { label: 'Nationality', value: student?.nationality },
                  { label: 'Sex', value: student?.sex },
                  { label: 'Education', value: student?.education },
                ].map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className='font-medium py-1'>
                      {item?.label}
                    </TableCell>
                    <TableCell className='font-light py-1'>
                      {item?.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='p-2 bg-white shadow sm:w-full md:w-[48%] lg:w-[32%]'>
            <h4 className='font-bold text-primary'>PERMANENT ADDRESS</h4>
            <Table>
              <TableBody>
                {[
                  { label: 'District', value: student?.district },
                  { label: 'Mobile', value: student?.mobile },
                ].map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className='font-medium py-1'>
                      {item?.label}
                    </TableCell>
                    <TableCell className='font-light py-1'>
                      {item?.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='p-2 bg-white shadow sm:w-full md:w-[48%] lg:w-[32%]'>
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
                    <TableCell className='font-medium py-1'>
                      {item?.label}
                    </TableCell>
                    <TableCell className='font-light py-1'>
                      {item?.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='p-2 bg-white shadow sm:w-full md:w-[48%] lg:w-[32%]'>
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
                    <TableCell className='font-medium py-1'>
                      {item?.label}
                    </TableCell>
                    <TableCell className='font-light py-1'>
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
        <div className='overflow-x-auto bg-white p-3 mt-2'>
          <RTable
            data={getApi?.data}
            columns={columns({
              editHandler,
              isPending: deleteApi?.isPending || false,
              deleteHandler,
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
