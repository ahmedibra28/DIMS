'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import FormView from '@/components/FormView'
import Spinner from '@/components/Spinner'
import type { Course as ICourse } from '@prisma/client'
import RTable from '@/components/RTable'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import useResetStore from '@/zustand/resetStore'
import useDataStore from '@/zustand/dataStore'
import { columns } from './columns'

const FormSchema = z.object({
  name: z.string().min(1),
  price: z.string().min(1),
  duration: z.string().min(1),
  certificate: z.string().min(1),
  enrolment: z.string().min(1),
  examinations: z.string().min(1),
  status: z.string().min(1),
  schoolId: z.string().min(1),
})

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const { reset, setReset } = useResetStore((state) => state)

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const { dialogOpen, setDialogOpen } = useDataStore((state) => state)

  const getApi = useApi({
    key: ['courses'],
    method: 'GET',
    url: `courses?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const postApi = useApi({
    key: ['courses'],
    method: 'POST',
    url: `courses`,
  })?.post

  const updateApi = useApi({
    key: ['courses'],
    method: 'PUT',
    url: `courses`,
  })?.put

  const deleteApi = useApi({
    key: ['courses'],
    method: 'DELETE',
    url: `courses`,
  })?.deleteObj

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      price: '',
      duration: '',
      certificate: '',
      enrolment: '',
      examinations: '',
      schoolId: '',
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

  const editHandler = (item: ICourse) => {
    setId(item.id!)
    setEdit(true)
    form.setValue('name', item?.name)
    form.setValue('price', String(item?.price))
    form.setValue('duration', String(item?.duration))
    form.setValue('examinations', item?.examinations as any)
    form.setValue('certificate', item?.certificate!)
    form.setValue('enrolment', item?.enrolment!)
    form.setValue('schoolId', item?.schoolId!)
    form.setValue('status', item?.status)
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'Course'
  const modal = 'course'

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEdit(false)
      setId(null)
    }
    // eslint-disable-next-line
  }, [dialogOpen])

  const status = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' },
  ]

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
          name='price'
          label='Price'
          placeholder='Price'
          type='number'
        />
        <CustomFormField
          form={form}
          name='duration'
          label='Duration'
          placeholder='Duration'
          type='number'
        />
        <CustomFormField
          form={form}
          name='examinations'
          label='Examinations'
          placeholder='Examinations'
          type='text'
        />
        <CustomFormField
          form={form}
          name='certificate'
          label='Certificate'
          placeholder='Certificate'
          type='text'
        />
        <CustomFormField
          form={form}
          name='enrolment'
          label='Enrolment'
          placeholder='Enrolment'
          type='text'
        />
        <CustomFormField
          form={form}
          name='schoolId'
          label='School'
          placeholder='School'
          fieldType='command'
          data={[]}
          key='schools'
          url='schools?page=1&limit=10'
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

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

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
            caption='Courses List'
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
