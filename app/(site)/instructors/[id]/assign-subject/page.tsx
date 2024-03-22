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
  AssignSubject as IAssignSubject,
  Instructor as IInstructor,
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
import getSubjectsByCourseSemester from '@/actions/getSubjectsByCourseSemester'
import useUserInfoStore from '@/zustand/userStore'

const FormSchema = z.object({
  semester: z.string().min(1),
  shift: z.string().min(1),
  subjectId: z.string().min(1),
  status: z.string().min(1),
  courseId: z.string().min(1),
})

interface DataProp {
  label: string
  value: string
}

const Page = ({ params }: { params: { id: string } }) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')
  const [semester, setSemester] = useState<DataProp[]>([])
  const [subject, setSubject] = useState<DataProp[]>([])

  const { userInfo } = useUserInfoStore(state => state)

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const [isPending, startTransition] = useTransition()

  const { dialogOpen, setDialogOpen } = useDataStore(state => state)

  const getInstructor = useApi({
    key: ['instructor', params.id],
    method: 'GET',
    url: `instructors/${params.id}`,
  })?.get

  const getApi = useApi({
    key: ['assign-courses', params.id],
    method: 'GET',
    url: `assign-instructor-to-subject/${params.id}?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const postApi = useApi({
    key: ['assign-courses'],
    method: 'POST',
    url: `assign-instructor-to-subject`,
  })?.post

  const updateApi = useApi({
    key: ['assign-courses'],
    method: 'PUT',
    url: `assign-instructor-to-subject`,
  })?.put

  const deleteApi = useApi({
    key: ['assign-courses'],
    method: 'DELETE',
    url: `assign-instructor-to-subject`,
  })?.deleteObj

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      semester: '',
      shift: '',
      subjectId: '',
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

  const editHandler = (
    item: IAssignSubject & { subject: { course: { id: string } } }
  ) => {
    setId(item.id!)
    setEdit(true)
    form.setValue('semester', String(item?.semester))
    form.setValue('shift', item?.shift)
    form.setValue('subjectId', item?.subjectId)
    form.setValue('status', item?.status)
    form.setValue('courseId', item?.subject?.course?.id)
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'Assign Subject'
  const modal = 'assignSubject'

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEdit(false)
      setId(null)
      setSemester([])
      setSubject([])
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

  useEffect(() => {
    if (form.watch().courseId && form.watch().semester) {
      startTransition(() => {
        getSubjectsByCourseSemester({
          courseId: form.watch().courseId,
          semester: form.watch().semester,
        }).then(res => {
          const subject = res?.map(item => ({
            label: item?.name,
            value: item?.id,
          }))

          setSubject(subject)
        })
      })
    }

    // eslint-disable-next-line
  }, [form.watch().courseId, form.watch().semester])

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
          name='subjectId'
          label='Subject'
          placeholder='Subject'
          fieldType='select'
          data={subject}
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
    values: z.infer<typeof FormSchema> & { instructorId: string }
  ) => {
    values.instructorId = params.id
    edit
      ? updateApi?.mutateAsync({
          id: id,
          ...values,
        })
      : postApi?.mutateAsync(values)
  }

  const instructor = getInstructor?.data as IInstructor | undefined

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
          getInstructor?.isPending
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

      {getInstructor?.isPending ? (
        <Spinner />
      ) : getInstructor?.isError ? (
        <Message value={getInstructor?.error} />
      ) : (
        <div className='mb-10 mt-2 flex flex-col flex-wrap gap-2 bg-white p-3 md:flex-row'>
          <div className='w-full'>
            <div className='relative w-44 p-2'>
              <Image
                src={getInstructor?.data?.image || '/avatar.png'}
                alt='instructor'
                width={200}
                height={200}
                className='m-auto w-44 rounded'
              />
              <div className='absolute -top-2 right-0'>
                {instructor?.status === 'ACTIVE' ? (
                  <Badge
                    className='h-[22px] w-5 rounded-full bg-green-500'
                    title={instructor?.status}
                  />
                ) : (
                  <Badge
                    className='h-[22px] w-5 rounded-full bg-red-500'
                    title={instructor?.status}
                  />
                )}
              </div>
            </div>

            {instructor?.note && (
              <div className='font-mono text-sm'>
                <p>{instructor?.note}</p>
              </div>
            )}
          </div>
          <div className='bg-white p-2 shadow sm:w-full md:w-[48%] lg:w-[32%]'>
            <h4 className='font-bold text-primary'>PERSONAL INFORMATION</h4>
            <Table>
              <TableBody>
                {[
                  { label: 'Name', value: instructor?.name },
                  { label: 'Roll No', value: instructor?.rollNo },
                  { label: 'Place of Birth', value: instructor?.placeOfBirth },
                  { label: 'Date of Birth', value: instructor?.dateOfBirth },
                  { label: 'Nationality', value: instructor?.nationality },
                  { label: 'Sex', value: instructor?.sex },
                  { label: 'Qualification', value: instructor?.qualification },
                  { label: 'Experience', value: instructor?.experience },
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
                  { label: 'District', value: instructor?.district },
                  { label: 'Mobile', value: instructor?.mobile },
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
                  { label: 'Contact Name', value: instructor?.contactName },
                  { label: 'Contact Mobile', value: instructor?.contactMobile },
                  { label: 'Contact Email', value: instructor?.contactEmail },
                  {
                    label: 'Contact Relation',
                    value: instructor?.contactRelation,
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
            })}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            modal={modal}
            caption='Assign Subjects List'
            hasAdd={Boolean(userInfo.role !== 'INSTRUCTOR')}
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
