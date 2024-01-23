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
import type { Subject as ISubject } from '@prisma/client'
import RTable from '@/components/RTable'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import useDataStore from '@/zustand/dataStore'
import { columns } from './columns'
import getCoursesById from '@/actions/getCoursesById'

interface DataProp {
  label: string
  value: string
}

const FormSchema = z.object({
  name: z.string().min(1),
  semester: z.string().min(1),
  theoryMarks: z.string().min(1),
  practicalMarks: z.string().min(1),
  status: z.string().min(1),
  courseId: z.string().min(1),
})

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')
  const [semester, setSemester] = useState<DataProp[]>([])

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const { dialogOpen, setDialogOpen } = useDataStore((state) => state)
  const [isPending, startTransition] = useTransition()

  const getApi = useApi({
    key: ['subjects'],
    method: 'GET',
    url: `subjects?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const postApi = useApi({
    key: ['subjects'],
    method: 'POST',
    url: `subjects`,
  })?.post

  const updateApi = useApi({
    key: ['subjects'],
    method: 'PUT',
    url: `subjects`,
  })?.put

  const deleteApi = useApi({
    key: ['subjects'],
    method: 'DELETE',
    url: `subjects`,
  })?.deleteObj

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      semester: '',
      theoryMarks: '',
      practicalMarks: '',
      courseId: '',
      status: '',
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

  const editHandler = (item: ISubject) => {
    setId(item.id!)
    setEdit(true)
    form.setValue('name', item?.name)
    form.setValue('semester', String(item?.semester))
    form.setValue('theoryMarks', String(item?.theoryMarks))
    form.setValue('practicalMarks', String(item?.practicalMarks))
    form.setValue('courseId', item?.courseId)
    form.setValue('status', item?.status)
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'Subject'
  const modal = 'subject'

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
          name='name'
          label='Name'
          placeholder='Name'
          type='text'
        />
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
          name='theoryMarks'
          label='Theory Marks'
          placeholder='Theory marks'
          type='number'
        />
        <CustomFormField
          form={form}
          name='practicalMarks'
          label='Practical Marks'
          placeholder='Practical marks'
          type='number'
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

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    edit
      ? updateApi?.mutateAsync({
          id: id,
          ...values,
        })
      : postApi?.mutateAsync(values)
  }

  return (
    <>
      {deleteApi?.isSuccess && <Message value={deleteApi?.data?.message} />}
      {deleteApi?.isError && <Message value={deleteApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}

      <TopLoadingBar
        isFetching={getApi?.isFetching || getApi?.isPending || isPending}
      />

      <FormView
        form={formFields}
        loading={updateApi?.isPending || postApi?.isPending}
        handleSubmit={form.handleSubmit}
        submitHandler={onSubmit}
        label={label}
        edit={edit}
      />

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
            caption='Subjects List'
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
