'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'
import PrintDialog from '@/components/PrintDialog'
import useDataStore from '@/zustand/dataStore'
import { SubjectProp } from '@/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FaFile, FaPrint } from 'react-icons/fa6'
import DateTime from '@/lib/dateTime'
import { Capitalize } from '@/lib/capitalize'
import Skeleton from '@/components/dashboard/Skeleton'
import { FormButton } from '@/components/ui/CustomForm'
import Image from 'next/image'
import getClearanceCardByStudentRollNo from '@/actions/getClearanceCardByStudentRollNo'
import Search from '@/components/Search'

const Page = () => {
  const [q, setQ] = useState('')
  const { setDialogOpen } = useDataStore(state => state)
  const [isPendingSubject, startTransitionSubject] = React.useTransition()
  const [subject, setSubject] = React.useState<SubjectProp[]>([])
  const [printItem, setPrintItem] = React.useState<SubjectProp>()
  const [studentId, setStudentId] = React.useState('')

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  React.useEffect(() => {
    if (studentId) {
      startTransitionSubject(() => {
        getClearanceCardByStudentRollNo({ studentRollNo: studentId }).then(
          res => {
            setSubject((res as SubjectProp[]) || [])
          }
        )
      })
    }
  }, [studentId])

  React.useEffect(() => {
    if (!q) {
      setSubject([])
      setStudentId('')
      setQ('')
    }
  }, [q])

  // React.useEffect(() => {
  //   if (!dialogOpen) {
  //     setItem(undefined)
  //     setPrintItem(undefined)
  //   }
  // }, [dialogOpen])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    setStudentId(q)
  }

  const ClearanceCard = ({ data }: { data?: SubjectProp }) => {
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
            <div className='p-1 bg-gray-100 rounded borders'>
              <Image
                src={data?.student?.image || '/avatar.png'}
                alt='logo'
                width={100}
                height={100}
                className='object-cover w-24 h-24 mx-auto rounded'
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
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Clearance Card</CardTitle>
        <CardDescription>Get clearance card for exams</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
        {subject?.map((item, i: number) => (
          <FormButton
            key={i}
            onClick={() => {
              setPrintItem(item)
              setDialogOpen(true)
            }}
            label={item.course.name}
            icon={<FaPrint />}
            className='flex flex-col text-xs'
          />
        ))}
      </CardContent>
    </Card>
  )

  return (
    <div className='p-3 mt-2 overflow-x-auto bg-white'>
      <div className='mx-auto mb-5 w-full sm:w-[80%] md:w-[50%] lg:w-[30%]'>
        <h1 className='mb-3 text-2xl font-bold'>Clearance Card</h1>
        <Search
          searchHandler={searchHandler}
          placeholder='Search by student roll no'
          q={q}
          setQ={setQ}
          type={'text'}
        />
      </div>

      {printItem && (
        <PrintDialog
          data={<ClearanceCard data={printItem} />}
          label='Clearance Card'
        />
      )}

      {isPendingSubject ? (
        <Skeleton />
      ) : (
        subject?.length > 0 && clearanceCardCard()
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
