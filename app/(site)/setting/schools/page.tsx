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
import type { School as ISchool } from '@prisma/client'
import RTable from '@/components/RTable'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import useEditStore from '@/zustand/editStore'
import { useColumn } from './hook/useColumn'
import { TopLoadingBar } from '@/components/TopLoadingBar'

const FormSchema = z.object({
  name: z.string().refine((value) => value !== '', {
    message: 'Name is required',
  }),
  status: z.string().refine((value) => value !== '', {
    message: 'Status is required',
  }),
})

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const { edit, setEdit } = useEditStore((state) => state)
  const [q, setQ] = useState('')

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = useApi({
    key: ['schools'],
    method: 'GET',
    url: `schools?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const postApi = useApi({
    key: ['schools'],
    method: 'POST',
    url: `schools`,
  })?.post

  const updateApi = useApi({
    key: ['schools'],
    method: 'PUT',
    url: `schools`,
  })?.put

  const deleteApi = useApi({
    key: ['schools'],
    method: 'DELETE',
    url: `schools`,
  })?.deleteObj

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      status: '',
    },
  })

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess)
      formCleanHandler()
    getApi?.refetch()
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

  const refEdit = React.useRef(edit)
  const refId = React.useRef(id)

  const editHandler = (item: ISchool) => {
    setId(item.id!)
    setEdit(true)

    refEdit.current = true
    refId.current = item.id!
    form.setValue('name', item?.name)
    form.setValue('status', item?.status)
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'School'
  const modal = 'school'

  const formCleanHandler = () => {
    form.reset()
    setEdit(false)
    setId(null)
    refEdit.current = false
    refId.current = null

    window.document.getElementById('dialog-close')?.click()
  }

  const status = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' },
  ]

  const formFields = (
    <Form {...form}>
      <CustomFormField
        form={form}
        name='name'
        label='Name'
        placeholder='Name'
        type='text'
      />
      <CustomFormField
        form={form}
        name='status'
        label='Status'
        placeholder='Status'
        fieldType='command'
        data={status}
      />
    </Form>
  )

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    refEdit.current
      ? updateApi?.mutateAsync({
          id: refId.current,
          ...values,
        })
      : postApi?.mutateAsync(values)
  }

  const formChildren = (
    <FormView
      formCleanHandler={formCleanHandler}
      form={formFields}
      loading={updateApi?.isPending || postApi?.isPending}
      handleSubmit={form.handleSubmit}
      submitHandler={onSubmit}
      label={label}
    />
  )

  const { columns } = useColumn({
    editHandler,
    isPending: deleteApi?.isPending || false,
    deleteHandler,
    formChildren,
  })

  return (
    <>
      {deleteApi?.isSuccess && <Message value={deleteApi?.data?.message} />}
      {deleteApi?.isError && <Message value={deleteApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message value={getApi?.error} />
      ) : (
        <div className='overflow-x-auto bg-white p-3 mt-2'>
          <RTable
            data={getApi?.data}
            columns={columns}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            modal={modal}
            caption='Schools List'
          >
            {formChildren}
          </RTable>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
