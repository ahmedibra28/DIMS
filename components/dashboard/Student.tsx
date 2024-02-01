'use client'

import React, { Fragment } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormButton } from '../ui/CustomForm'
import { FaFile, FaPrint } from 'react-icons/fa6'

import PrintDialog from '../PrintDialog'
import useDataStore from '@/zustand/dataStore'
import Image from 'next/image'
import DateTime from '@/lib/dateTime'
import useUserInfoStore from '@/zustand/userStore'
import getClearanceCardByStudentId from '@/actions/getClearanceCardByStudentId'
import { Capitalize } from '@/lib/capitalize'
import getNoticesByRole from '@/actions/getNoticesByRole'

interface DataProp {
  semester: number
  shift: 'MORNING' | 'AFTERNOON'
  course: {
    name: string
    subject: {
      name: string
      examDescription: string
      examDate: Date
    }[]
  }
  student: {
    rollNo: string
    image: string
    name: string
  }
}

interface NoticeProp {
  id: string
  title: string
  note: string
  createdAt: Date
  createdBy: {
    name: string
  }
}

export default function Student() {
  const { setDialogOpen } = useDataStore(state => state)
  const { userInfo } = useUserInfoStore(state => state)
  const [item, setItem] = React.useState<DataProp>()

  const [subject, setSubject] = React.useState<DataProp[]>([])
  const [notes, setNotes] = React.useState<NoticeProp[]>([])

  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    if (userInfo.studentId) {
      startTransition(() => {
        getClearanceCardByStudentId({ studentId: userInfo.studentId! }).then(
          res => {
            setSubject((res as DataProp[]) || [])
          }
        )
      })
    }
    if (userInfo.role) {
      startTransition(() => {
        getNoticesByRole({ role: userInfo.role! }).then(res => {
          setNotes(res || [])
        })
      })
    }

    // eslint-disable-next-line
  }, [userInfo.studentId, userInfo.role])

  const ClearanceCard = ({ data }: { data?: DataProp }) => {
    return (
      <Card>
        <CardHeader>
          <div className='flex flex-col text-center'>
            <Image
              src='/logo.png'
              alt='logo'
              width={70}
              height={70}
              className='mx-auto'
            />
            <h5 className='font-bold uppercase text-primary'>
              SAYID MOHAMED TECHNICAL EDUCATION COLLEGE <br />
              (SaMTEC)
            </h5>
            <span>
              <FaFile className='inline' /> Exam Clearance Card <br />
            </span>

            <span>{data?.course?.subject?.[0]?.examDescription}</span>
          </div>
          <hr className='mt-2' />
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col'>
              <span className='text-sm'>
                Name: <span className='font-bold'>{data?.student?.name}</span>{' '}
              </span>
              <span className='text-sm'>
                Exam Date:{' '}
                <span className='font-bold'>
                  {DateTime(data?.course?.subject?.[0]?.examDate).format(
                    'YYYY-MM-DD hh:mm:ss'
                  )}
                </span>
              </span>
              <span className='text-sm'>
                Roll No:{' '}
                <span className='font-bold'>{data?.student?.rollNo}</span>
              </span>
              <span className='text-sm'>
                Course: <span className='font-bold'>{data?.course?.name}</span>
              </span>
              <span className='text-sm'>
                Semester: <span className='font-bold'>{data?.semester}</span>
              </span>
              <span className='text-sm'>
                Shift:{' '}
                <span className='font-bold'>
                  {Capitalize(data?.shift?.toLowerCase() || '')}
                </span>
              </span>
            </div>
            <div className='borders rounded bg-gray-100 p-1'>
              <Image
                src={data?.student?.image || 'avatar.png'}
                alt='logo'
                width={100}
                height={100}
                className='mx-auto h-24 w-24 rounded object-cover'
              />
            </div>
          </div>
        </CardContent>
        <hr className='mb-2' />
        <CardFooter>
          <div className='mx-auto my-2 text-center'>
            <span className='text-sm'>
              Generated at: {DateTime(new Date()).format('YYYY-MM-DD hh:mm:ss')}
            </span>
          </div>
        </CardFooter>
      </Card>
    )
  }

  const clearanceCardCard = () => (
    <Card className='h-full w-full md:w-[48%] lg:w-[31%]'>
      <CardHeader>
        <CardTitle>Clearance Card</CardTitle>
        <CardDescription>Get your clearance card for exams</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-2 gap-2'>
        {isPending ? (
          <FormButton loading label='Loading...' />
        ) : (
          <>
            {subject?.length > 0 ? (
              subject?.map((item, i: number) => (
                <FormButton
                  key={i}
                  onClick={() => {
                    setItem(item)
                    setDialogOpen(true)
                  }}
                  label={item.course.name}
                  icon={<FaPrint />}
                />
              ))
            ) : (
              <FormButton
                loading={false}
                label='No data found'
                variant='destructive'
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  )

  const noticeCard = () => (
    <Card className='h-full w-full md:w-[48%] lg:w-[31%]'>
      <CardHeader>
        <CardTitle>Notice Board for Students</CardTitle>
        <CardDescription>Get all the latest updates here.</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-2'>
        {isPending ? (
          <FormButton loading label='Loading...' />
        ) : (
          <>
            {notes?.length > 0 ? (
              notes?.map((item, i: number) => (
                <Fragment key={i}>
                  <div>
                    <span className='font-bold'>{item?.title}</span> -
                    <span className='ms-1 text-xs text-gray-500'>
                      {item?.createdBy?.name}
                    </span>
                    <p className='text-sm text-gray-700'>{item?.note}</p>
                    <span className='text-end text-xs text-gray-500'>
                      {DateTime(item?.createdAt).format('YYYY-MM-DD hh:mm:ss')}
                    </span>
                  </div>
                  <hr />
                </Fragment>
              ))
            ) : (
              <FormButton
                loading={false}
                label='No data found'
                variant='destructive'
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className='items-centers flex flex-wrap justify-start gap-4'>
      <PrintDialog
        data={<ClearanceCard data={item} />}
        label='Clearance Card'
      />
      {clearanceCardCard()}
      {noticeCard()}
    </div>
  )
}
