'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import Spinner from '@/components/Spinner'
import RTable from '@/components/RTable'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import { columns } from './columns'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardHeader } from '@/components/ui/card'
import CustomFormField from '@/components/ui/CustomForm'
import { Form } from '@/components/ui/form'
import { useDebounce } from 'use-debounce'
import { Button } from '@/components/ui/button'

const FormSchema = z.object({
  course: z.string(),
  student: z.string(),
  rollNo: z.string(),
})

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      course: '',
      student: '',
      rollNo: '',
    },
  })

  const param = {
    course: form.watch('course'),
    student: form.watch('student'),
    rollNo: form.watch('rollNo'),
  }

  const getApi = useApi({
    key: ['temporary-transaction'],
    method: 'GET',
    url: `reports/temporary-transactions?page=${page}&limit=${limit}&${new URLSearchParams(
      param
    )}`,
  })?.get

  const updateApi = useApi({
    key: ['temporary-transaction'],
    method: 'PUT',
    url: `reports/temporary-transactions`,
  })?.put

  const deleteApi = useApi({
    key: ['temporary-transaction'],
    method: 'DELETE',
    url: `reports/temporary-transactions`,
  })?.deleteObj

  useEffect(() => {
    if (updateApi?.isSuccess || deleteApi?.isSuccess) {
      getApi?.refetch()
    }

    // eslint-disable-next-line
  }, [updateApi?.isSuccess, deleteApi?.isSuccess])

  const updateStatusHandler = ({
    id,
    status,
  }: {
    id: string
    status: 'PAID' | 'UNPAID'
  }) => {
    updateApi?.mutateAsync({
      id,
      status,
    })
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const [student] = useDebounce(form.watch('student'), 1000)
  const [rollNo] = useDebounce(form.watch('rollNo'), 1000)
  const [course] = useDebounce(form.watch('course'), 1000)

  useEffect(() => {
    getApi?.refetch()
    setPage(1)
    // eslint-disable-next-line
  }, [course, student, rollNo])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [limit])

  return (
    <>
      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      <Card className='border-none'>
        <CardHeader>
          <Form {...form}>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <CustomFormField
                form={form}
                name='student'
                label='Student'
                placeholder='Student'
                type='text'
              />
              <CustomFormField
                form={form}
                name='rollNo'
                label='Roll No'
                placeholder='Roll No'
                type='text'
              />
              <CustomFormField
                form={form}
                name='course'
                label='Course'
                placeholder='Course'
                type='text'
              />
              <Button
                onClick={() => form.reset()}
                variant='destructive'
                className='mt-5 w-full'
              >
                Reset
              </Button>
            </div>
          </Form>
        </CardHeader>
      </Card>

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message value={getApi?.error} />
      ) : (
        <div className='mt-2 overflow-x-auto bg-white p-3'>
          <RTable
            data={getApi?.data}
            columns={columns({
              updateStatusHandler,
              deleteHandler,
              isPending: updateApi?.isPending || deleteApi?.isPending || false,
            })}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            caption='Temporary Transaction Report'
            searchType='date'
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
