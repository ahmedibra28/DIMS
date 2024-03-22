'use client'

import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import Spinner from '@/components/Spinner'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import CustomFormField, { FormButton } from '@/components/ui/CustomForm'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FaSearchengin } from 'react-icons/fa6'
import { Course as ICourse } from '@prisma/client'
import { numberToArray } from '@/lib/numberToArray'
import Image from 'next/image'
import { ITranscript } from '@/types'
import DateTime from '@/lib/dateTime'

const FormSchema = z.object({
  student: z.string().min(1, 'Student is required'),
  course: z.string().min(1, 'Course is required'),
  semester: z.string(),
})

const Page = () => {
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
      student: '',
      course: '',
      semester: '',
    },
  })

  const param = {
    student: form.watch('student'),
    semester: form.watch('semester'),
    course: form.watch('course'),
  }

  const getReport = useApi({
    key: ['transcript'],
    method: 'GET',
    url: `reports/transcripts?${new URLSearchParams(param)}`,
  })?.get

  const getCourses = useApi({
    key: ['course'],
    method: 'GET',
    url: `courses?page=1&limit=30&status=ACTIVE`,
  })?.get

  const submitHandler = (data: z.infer<typeof FormSchema>) => {
    getReport?.refetch()
    return data
  }

  interface IGroupBySemester {
    semester: number
    data: ITranscript[]
  }

  const data = getReport?.data as IGroupBySemester[]

  return (
    <>
      <TopLoadingBar
        isFetching={getReport?.isFetching || getReport?.isPending}
      />

      <Card className='border-none'>
        <CardHeader>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <Form {...form}>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <CustomFormField
                  form={form}
                  name='course'
                  label='Course'
                  placeholder='Course'
                  fieldType='select'
                  data={getCourses?.data?.data?.map((item: ICourse) => ({
                    label: item?.name,
                    value: item?.id,
                  }))}
                  key='courses'
                />
                <CustomFormField
                  form={form}
                  name='student'
                  label='Student'
                  placeholder='Student'
                  type='text'
                />
                <CustomFormField
                  form={form}
                  name='semester'
                  label='Semester'
                  placeholder='Semester'
                  fieldType='select'
                  data={
                    (numberToArray(
                      getCourses?.data?.data?.find(
                        (item: ICourse) => item.id === form.watch('course')
                      )?.duration
                    )?.map(item => ({
                      label: item,
                      value: item,
                    })) as any) || []
                  }
                  key='semester'
                />

                <div className='mt-3.5 grid grid-cols-2 gap-x-4'>
                  <FormButton
                    variant='default'
                    className='mt-2 w-full'
                    label='Search'
                    icon={<FaSearchengin />}
                    type='submit'
                  />

                  <Button
                    onClick={() => form.reset()}
                    variant='destructive'
                    className='mt-2 w-full'
                    type='button'
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </Form>
          </form>
        </CardHeader>
      </Card>

      {getReport?.isPending ? (
        <Spinner />
      ) : getReport?.isError ? (
        <Message value={getReport?.error} />
      ) : (
        <>
          <Card className='mt-2 flex flex-col items-center justify-between gap-x-4 border p-3 lg:flex-row'>
            <Image
              src='/logo.png'
              alt='logo'
              width={500}
              height={500}
              className='size-24 object-cover'
            />
            <CardHeader className='text-center text-primary'>
              <CardTitle className='text-3xl'>
                Sayid Mohamed Technical Education College
              </CardTitle>
              <h1 className='text-2xl'>SaMTEC</h1>
              <h6>Printed Date: {DateTime().format('DD-MM-YYYY')}</h6>
            </CardHeader>
            <Image
              src={
                data?.[0]?.data?.[0]?.assignCourse?.student?.image ||
                '/logo.png'
              }
              alt={data?.[0]?.data?.[0]?.assignCourse?.student?.name}
              width={500}
              height={500}
              className='size-24 rounded-xl object-cover'
            />
          </Card>

          <Card>
            <CardHeader className='flex flex-col items-start gap-4 px-8 py-6 md:flex-row md:items-center'>
              <div className='flex flex-col'>
                <CardTitle className='text-2xl font-bold uppercase'>
                  {data?.[0]?.data?.[0]?.assignCourse?.student?.name}
                </CardTitle>
                <CardDescription className='mt-1'>Transcript</CardDescription>
              </div>
              <div className='ml-auto flex items-center gap-2 md:gap-4'>
                <div className='flex flex-col text-right'>
                  <CardTitle className='text-base font-bold'>Sex</CardTitle>
                  <CardDescription className='text-sm'>
                    {data?.[0]?.data?.[0]?.assignCourse?.student?.sex}
                  </CardDescription>
                </div>
                <div className='flex flex-col text-right'>
                  <CardTitle className='text-base font-bold'>
                    Roll Number
                  </CardTitle>
                  <CardDescription className='text-sm'>
                    {data?.[0]?.data?.[0]?.assignCourse?.student?.rollNo}
                  </CardDescription>
                </div>
                <div className='flex flex-col text-right'>
                  <CardTitle className='text-base font-bold'>Course</CardTitle>
                  <CardDescription className='text-sm'>
                    {data?.[0]?.data?.[0]?.assignCourse?.course?.name?.toUpperCase()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              {data &&
                data?.map((item, i: number) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className='text-md text-center uppercase'>
                        Semester {item?.semester}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableCaption>A list of obtained marks</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Total Marks</TableHead>
                            <TableHead>Marks Obtained</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {item?.data?.map((sub, i) => (
                            <TableRow key={i}>
                              <TableCell>{sub?.subject?.name}</TableCell>
                              <TableCell>
                                {sub?.subject?.theoryMarks +
                                  sub?.subject?.practicalMarks}
                              </TableCell>
                              <TableCell>
                                {sub?.theoryMarks + sub?.practicalMarks}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
