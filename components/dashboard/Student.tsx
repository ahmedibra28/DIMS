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
import { FaDollarSign, FaFile, FaPrint } from 'react-icons/fa6'

import PrintDialog from '../PrintDialog'
import useDataStore from '@/zustand/dataStore'
import Image from 'next/image'
import DateTime from '@/lib/dateTime'
import useUserInfoStore from '@/zustand/userStore'
import getClearanceCardByStudentId from '@/actions/getClearanceCardByStudentId'
import { Capitalize } from '@/lib/capitalize'
import getNoticesByRole from '@/actions/getNoticesByRole'
import getExamResultByStudentId from '@/actions/getExamResultByStudentId'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import getTransactionsByStudentId from '@/actions/getTransactionsByStudentId'
import { FormatNumber } from '../FormatNumber'
import { Badge } from '@/components/ui/badge'
import { InvoiceCard } from '@/components/InvoiceCard'

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

interface TransactionProp {
  id: string
  amount: number
  paymentStatus: 'UNPAID' | 'PAID'
  type: 'TUITION_PAYMENT' | 'ENROLLMENT_FEE'
  semester?: number
  shift?: 'MORNING' | 'AFTERNOON'
  createdAt: Date
  student?: {
    rollNo?: string
    name?: string
  }
  course?: {
    name?: string
  }
}

interface ExamProp {
  course: string
  semester: number
  subjects: {
    name: string
    originalTheoryMarks: number
    originalPracticalMarks: number
    marks: Array<{
      examination: string
      theoryMarks: number
      practicalMarks: number
    }>
  }[]
}

export default function Student() {
  const { setDialogOpen, dialogOpen } = useDataStore(state => state)
  const { userInfo } = useUserInfoStore(state => state)
  const [item, setItem] = React.useState<DataProp>()

  const [subject, setSubject] = React.useState<DataProp[]>([])
  const [notes, setNotes] = React.useState<NoticeProp[]>([])
  const [exam, setExam] = React.useState<ExamProp[]>([])
  const [transactions, setTransactions] = React.useState<TransactionProp[]>([])
  const [printItem, setPrintItem] = React.useState<TransactionProp>()

  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    if (!dialogOpen) {
      setItem(undefined)
      setPrintItem(undefined)
    }
  }, [dialogOpen])

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

    if (userInfo.studentId) {
      startTransition(() => {
        getExamResultByStudentId({ studentId: userInfo.studentId! }).then(
          res => {
            setExam(res || [])
          }
        )
      })
    }

    if (userInfo.studentId) {
      startTransition(() => {
        getTransactionsByStudentId({ studentId: userInfo.studentId! }).then(
          res => {
            setTransactions((res as TransactionProp[]) || [])
          }
        )
      })
    }

    // eslint-disable-next-line
  }, [])

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
                src={data?.student?.image || '/avatar.png'}
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
    <Card className='w-full md:w-[48%] lg:w-[48%]'>
      <CardHeader>
        <CardTitle>Clearance Card</CardTitle>
        <CardDescription>Get your clearance card for exams</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-2 gap-2'>
        {isPending ? (
          <FormButton loading label='Loading...' />
        ) : (
          subject?.map((item, i: number) => (
            <FormButton
              key={i}
              onClick={() => {
                setItem(item)
                setDialogOpen(true)
              }}
              label={item.course.name}
              icon={<FaPrint />}
              className='text-xs'
            />
          ))
        )}
      </CardContent>
    </Card>
  )

  const noticeCard = () => (
    <Card className='w-full md:w-[48%] lg:w-[48%]'>
      <CardHeader>
        <CardTitle>Notice Board</CardTitle>
        <CardDescription>Get all the latest updates here.</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-2'>
        {isPending ? (
          <FormButton loading label='Loading...' />
        ) : (
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
        )}
      </CardContent>
    </Card>
  )

  const examCard = () => (
    <Card className='w-full md:w-[48%] lg:w-[48%]'>
      <CardHeader>
        <CardTitle>Exam Results</CardTitle>
        <CardDescription>Get all exam results here.</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-2'>
        {isPending ? (
          <FormButton loading label='Loading...' />
        ) : (
          exam?.map((item, i: number) => (
            <Table key={i}>
              <TableCaption>
                {item?.course} - Semester {item?.semester}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='ps-0 text-xs'>Exam</TableHead>
                  <TableHead className='ps-0 text-xs'>Subject</TableHead>
                  <TableHead className='ps-0 text-xs'>T. Marks</TableHead>
                  <TableHead className='ps-0 text-xs'>P. Marks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {item?.subjects?.map((sub, i: number) =>
                  sub?.marks?.map((mark, i: number) => (
                    <TableRow key={i}>
                      <TableCell className='px-2 py-1 text-xs'>
                        {mark.examination}
                      </TableCell>
                      <TableCell className='px-2 py-1 text-xs'>
                        {sub.name}
                      </TableCell>
                      <TableCell className='px-2 py-1 text-xs'>
                        {mark.theoryMarks}/{sub.originalTheoryMarks}
                      </TableCell>
                      <TableCell className='px-2 py-1 text-xs'>
                        {mark.practicalMarks}/{sub.originalPracticalMarks}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ))
        )}
      </CardContent>
    </Card>
  )

  const transactionCard = () => (
    <Card className='w-full md:w-[48%] lg:w-[48%]'>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Get all transactions results here.</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-2'>
        {isPending ? (
          <FormButton loading label='Loading...' />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='ps-0 text-xs'>Course</TableHead>
                  <TableHead className='ps-0 text-xs'>Semester</TableHead>
                  <TableHead className='ps-0 text-xs'>Amount</TableHead>
                  <TableHead className='ps-0 text-xs'>Type</TableHead>
                  <TableHead className='ps-0 text-xs'>P. Status</TableHead>
                  <TableHead className='ps-0 text-xs'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((item, i: number) => (
                  <TableRow key={i}>
                    <TableCell className='px-2 py-1 text-xs'>
                      {item?.course?.name}
                    </TableCell>
                    <TableCell className='px-2 py-1 text-xs'>
                      {item?.semester}
                    </TableCell>
                    <TableCell className='px-2 py-1 text-xs'>
                      <FormatNumber value={item?.amount} />
                    </TableCell>
                    <TableCell className='px-2 py-1 text-xs'>
                      {item?.type === 'TUITION_PAYMENT' ? (
                        <span className='text-green-500'>{item?.type}</span>
                      ) : (
                        <span className='text-blue-500'>{item?.type}</span>
                      )}
                    </TableCell>
                    <TableCell className='px-2 py-1 text-xs'>
                      {item?.paymentStatus === 'PAID' ? (
                        <span className='text-green-500'>
                          {item?.paymentStatus}
                        </span>
                      ) : (
                        <span className='text-red-500'>
                          {item?.paymentStatus}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className='flex items-center gap-x-2 py-1 text-xs'>
                      {item?.paymentStatus === 'UNPAID' ? (
                        <Badge
                          onClick={() => console.log('Paid')}
                          className='flex cursor-pointer items-center rounded text-white'
                        >
                          <FaDollarSign className='text-lg' /> Pay
                        </Badge>
                      ) : (
                        <Badge
                          onClick={() => {
                            setPrintItem(item)
                            setDialogOpen(true)
                          }}
                          className='flex cursor-pointer items-center gap-x-1 rounded bg-green-500 text-white'
                        >
                          <FaPrint className='text-lg' /> Print
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className='flex flex-wrap justify-start gap-4'>
      {item && (
        <PrintDialog
          data={<ClearanceCard data={item} />}
          label='Clearance Card'
        />
      )}
      {printItem && (
        <PrintDialog
          data={<InvoiceCard data={printItem} />}
          label='Invoice'
          width='md:min-w-[800px]'
          size='A4'
        />
      )}
      {transactions?.length > 0 && transactionCard()}
      {notes?.length > 0 && noticeCard()}
      {subject?.length > 0 && clearanceCardCard()}
      {exam?.length > 0 && examCard()}
    </div>
  )
}
