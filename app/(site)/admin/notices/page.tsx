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
import type { Notice as INotice, Role as IRole } from '@prisma/client'
import RTable from '@/components/RTable'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import useDataStore from '@/zustand/dataStore'
import { columns } from './columns'
import { MultiSelect } from '@/components/ui/multi-select'

const FormSchema = z.object({
  title: z.string().min(1),
  note: z.string().min(1),
  roles: z.array(z.string()).min(1),
  userId: z.string(),
  status: z.string().min(1),
})

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')
  const [selectedRoles, setSelectedRoles] = React.useState<
    { label: string; value: string }[]
  >([])

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const { dialogOpen, setDialogOpen } = useDataStore((state) => state)

  const getApi = useApi({
    key: ['notices'],
    method: 'GET',
    url: `notices?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const getRoles = useApi({
    key: ['roles'],
    method: 'GET',
    url: `roles?page=1&q=&limit=10`,
  })?.get

  const postApi = useApi({
    key: ['notices'],
    method: 'POST',
    url: `notices`,
  })?.post

  const updateApi = useApi({
    key: ['notices'],
    method: 'PUT',
    url: `notices`,
  })?.put

  const deleteApi = useApi({
    key: ['notices'],
    method: 'DELETE',
    url: `notices`,
  })?.deleteObj

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      note: '',
      roles: [],
      userId: '',
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

  let multiRoles = React.useMemo(() => {
    return getRoles?.data?.data?.map((item: any) => ({
      label: item.name,
      value: item.id,
    }))
  }, [getRoles?.data?.data])

  const editHandler = (item: INotice & { roles: IRole[] }) => {
    setId(item.id!)
    setEdit(true)
    form.setValue('title', item?.title)
    form.setValue('note', item?.note)
    const roles = item?.roles?.map((item) => ({
      label: item.name,
      value: item.id,
    }))

    setSelectedRoles(roles)
    form.setValue('userId', item?.userId as string)
    form.setValue('status', item?.status)
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'Notice'
  const modal = 'notice'

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEdit(false)
      setId(null)
      setSelectedRoles([])
    }
    // eslint-disable-next-line
  }, [dialogOpen])

  const status = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' },
  ]

  const formFields = (
    <Form {...form}>
      <div className='grid grid-cols-1 gap-x-4'>
        <CustomFormField
          form={form}
          name='title'
          label='Title'
          placeholder='Title'
          type='text'
        />
        <CustomFormField
          form={form}
          name='note'
          label='Note'
          placeholder='Note'
          cols={5}
          rows={2}
        />
        <MultiSelect
          data={multiRoles}
          selected={selectedRoles}
          setSelected={setSelectedRoles}
          label='Roles'
          form={form}
          name='roles'
        />

        <CustomFormField
          form={form}
          name='userId'
          label='User'
          placeholder='User'
          fieldType='command'
          data={[]}
          key='users'
          url='users?page=1&limit=10&status=ACTIVE'
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
            caption='Notices List'
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
