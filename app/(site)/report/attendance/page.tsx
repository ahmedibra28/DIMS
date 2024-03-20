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
  status: z.string(),
  course: z.string(),
  student: z.string(),
  shift: z.string(),
  semester: z.string(),
  subject: z.string(),
  instructor: z.string(),
  attendanceDate: z.string(),
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
      status: '',
      course: '',
      student: '',
      shift: '',
      semester: '',
      subject: '',
      instructor: '',
      attendanceDate: '',
    },
  })

  const param = {
    status: form.watch('status'),
    course: form.watch('course'),
    student: form.watch('student'),
    shift: form.watch('shift'),
    semester: form.watch('semester'),
    subject: form.watch('subject'),
    instructor: form.watch('instructor'),
    attendanceDate: form.watch('attendanceDate'),
  }

  const getReport = useApi({
    key: ['attendance'],
    method: 'GET',
    url: `reports/attendances?page=${page}&limit=${limit}&${new URLSearchParams(
      param
    )}`,
  })?.get

  const [student] = useDebounce(form.watch('student'), 1000)
  const [instructor] = useDebounce(form.watch('instructor'), 1000)
  const [semester] = useDebounce(form.watch('semester'), 3000)

  useEffect(() => {
    getReport?.refetch()
    setPage(1)
    // eslint-disable-next-line
  }, [
    // eslint-disable-next-line
    form.watch('status'),
    // eslint-disable-next-line
    form.watch('course'),
    // eslint-disable-next-line
    form.watch('student'),
    // eslint-disable-next-line
    form.watch('shift'),
    // eslint-disable-next-line
    form.watch('semester'),
    // eslint-disable-next-line
    form.watch('subject'),
    // eslint-disable-next-line
    form.watch('instructor'),
    // eslint-disable-next-line
    form.watch('attendanceDate'),
    // eslint-disable-next-line
    student,
    instructor,
    semester,
  ])

  useEffect(() => {
    getReport?.refetch()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    getReport?.refetch()
    // eslint-disable-next-line
  }, [limit])

  const shifts = [
    { label: 'Morning', value: 'MORNING' },
    { label: 'Afternoon', value: 'AFTERNOON' },
  ]
  const status = [
    { label: 'Present', value: 'True' },
    { label: 'Absent', value: 'False' },
  ]

  return (
    <>
      <TopLoadingBar
        isFetching={getReport?.isFetching || getReport?.isPending}
      />

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
                name='subject'
                label='Subject'
                placeholder='Subject'
                fieldType='command'
                data={[]}
                key='subjects'
                url='subjects?page=1&limit=10&status=ACTIVE'
              />
              <CustomFormField
                form={form}
                name='status'
                label='Status'
                placeholder='Status'
                fieldType='select'
                data={status}
              />
              <CustomFormField
                form={form}
                name='semester'
                label='Semester'
                placeholder='Semester'
                type='text'
              />
              <CustomFormField
                form={form}
                name='shift'
                label='Shift'
                placeholder='Shift'
                fieldType='select'
                data={shifts}
              />
              <CustomFormField
                form={form}
                name='instructor'
                label='Instructor'
                placeholder='Instructor'
                type='text'
              />
              <div className='flex items-center gap-2'>
                <div className='w-full'>
                  <CustomFormField
                    form={form}
                    name='attendanceDate'
                    label='Attendance Date'
                    placeholder='Attendance Date'
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
