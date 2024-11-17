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
import type { Subject as ISubject } from '@prisma/client'
import RTable from '@/components/RTable'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import useDataStore from '@/zustand/dataStore'
import { columns } from './columns'
import DateTime from '@/lib/dateTime'

const FormSchema = z.object({
  examDescription: z.string().min(1),
  hasActiveExam: z.boolean().default(false),
  examDate: z.string(),
})

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const { dialogOpen, setDialogOpen } = useDataStore(state => state)

  const getApi = useApi({
    key: ['generate-clearance-card'],
    method: 'GET',
    url: `generate-clearance-card?page=${page}&q=${q}&limit=${limit}&status=ACTIVE`,
  })?.get

  const updateApi = useApi({
    key: ['generate-clearance-card'],
    method: 'PUT',
    url: `generate-clearance-card`,
  })?.put

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      examDescription: '',
      hasActiveExam: false,
      examDate: '',
    },
  })

  useEffect(() => {
    if (updateApi?.isSuccess) {
      getApi?.refetch()
      setDialogOpen(false)
    }

    // eslint-disable-next-line
  }, [updateApi?.isSuccess])

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

  const editHandler = (item: { subject: ISubject }) => {
    setId(item.subject.id!)
    setEdit(true)
    form.setValue('examDescription', item?.subject?.examDescription!)
    form.setValue('hasActiveExam', item?.subject?.hasActiveExam!)
    form.setValue(
      'examDate',
      DateTime(item?.subject?.examDate!).format('YYYY-MM-DD')
    )
  }

  const label = 'Generate Clearance Card'
  const modal = 'generate-clearance-card'

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEdit(false)
      setId(null)
    }
    // eslint-disable-next-line
  }, [dialogOpen])

  const formFields = (
    <Form {...form}>
      <CustomFormField
        form={form}
        name='examDescription'
        label='Description'
        placeholder='Description'
        cols={6}
        rows={3}
      />
      <CustomFormField
        form={form}
        name='examDate'
        label='Exam Date'
        placeholder='Exam Date'
        type='date'
      />
      <CustomFormField
        form={form}
        name='hasActiveExam'
        label='Has Active Exam'
        placeholder='Has Active Exam'
        fieldType='checkbox'
      />
    </Form>
  )

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    edit &&
      updateApi?.mutateAsync({
        id: id,
        ...values,
      })
  }

  return (
    <>
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      <FormView
        form={formFields}
        loading={updateApi?.isPending}
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
        <div className='p-3 mt-2 overflow-x-auto bg-white'>
          <RTable
            data={getApi?.data}
            columns={columns({
              editHandler,
              isPending: false,
            })}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            modal={modal}
            caption='Generable Clearance Card List'
            hasAdd={false}
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
