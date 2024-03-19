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
  paymentDate: z.string(),
  paymentType: z.string(),
  paymentMethod: z.string(),
  paymentStatus: z.string(),
  course: z.string(),
  student: z.string(),
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
      paymentDate: '',
      paymentType: '',
      paymentMethod: '',
      paymentStatus: '',
      course: '',
      student: '',
    },
  })

  const param = {
    paymentDate: form.watch('paymentDate'),
    paymentType: form.watch('paymentType'),
    paymentMethod: form.watch('paymentMethod'),
    paymentStatus: form.watch('paymentStatus'),
    course: form.watch('course'),
    student: form.watch('student'),
  }

  const getReport = useApi({
    key: ['payment-transaction'],
    method: 'GET',
    url: `reports/payment-transactions?page=${page}&limit=${limit}&${new URLSearchParams(
      param
    )}`,
  })?.get

  const [value] = useDebounce(form.watch('student'), 1000)

  useEffect(() => {
    getReport?.refetch()
    setPage(1)
    // eslint-disable-next-line
  }, [
    // eslint-disable-next-line
    form.watch('paymentDate'),
    // eslint-disable-next-line
    form.watch('paymentType'),
    // eslint-disable-next-line
    form.watch('paymentMethod'),
    // eslint-disable-next-line
    form.watch('paymentStatus'),
    // eslint-disable-next-line
    form.watch('course'),
    // eslint-disable-next-line
    value,
  ])

  useEffect(() => {
    getReport?.refetch()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    getReport?.refetch()
    // eslint-disable-next-line
  }, [limit])

  const paymentTypes = [
    { label: 'Enrollment', value: 'ENROLLMENT_FEE' },
    { label: 'Tuition', value: 'TUITION_PAYMENT' },
  ]
  const paymentMethods = [
    { label: 'Cash', value: 'CASH' },
    { label: 'EVC Wallet', value: 'EVC_WALLET' },
    { label: 'System', value: 'SYSTEM' },
  ]

  const paymentStatus = [
    { label: 'Paid', value: 'PAID' },
    { label: 'Unpaid', value: 'UNPAID' },
  ]

  return (
    <>
      <TopLoadingBar
        isFetching={getReport?.isFetching || getReport?.isPending}
      />

      <Card className='border-none'>
        <CardHeader>
          <Form {...form}>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <CustomFormField
                form={form}
                name='student'
                label='Student'
                placeholder='Student'
                type='text'
              />
              <CustomFormField
                form={form}
                name='course'
                label='Course'
                placeholder='Course'
                fieldType='command'
                data={[]}
                key='courses'
                url='courses?page=1&limit=10&status=ACTIVE'
              />
              <CustomFormField
                form={form}
                name='paymentMethod'
                label='Payment Method'
                placeholder='Payment Method'
                fieldType='select'
                data={paymentMethods}
              />
              <CustomFormField
                form={form}
                name='paymentType'
                label='Payment Type'
                placeholder='Payment Type'
                fieldType='select'
                data={paymentTypes}
              />
              <CustomFormField
                form={form}
                name='paymentStatus'
                label='Payment Status'
                placeholder='Payment Status'
                fieldType='select'
                data={paymentStatus}
              />
              <div className='flex items-center gap-2'>
                <div className='w-full'>
                  <CustomFormField
                    form={form}
                    name='paymentDate'
                    label='Payment Date'
                    placeholder='Payment Date'
                    type='date'
                  />
                </div>
                <Button
                  onClick={() => form.reset()}
                  variant='destructive'
                  className='mt-2 w-24'
                >
                  Reset
                </Button>
              </div>
            </div>
          </Form>
        </CardHeader>
      </Card>

      {getReport?.isPending ? (
        <Spinner />
      ) : getReport?.isError ? (
        <Message value={getReport?.error} />
      ) : (
        <div className='mt-2 overflow-x-auto bg-white p-3'>
          <RTable
            data={getReport?.data}
            columns={columns()}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            caption='Payment Transaction Report'
            searchType='date'
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
