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
import { FormButton } from '@/components/ui/CustomForm'
import { FaDollarSign, FaFile, FaPaperclip, FaPrint } from 'react-icons/fa6'

import PrintDialog from '@/components/PrintDialog'
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
import getResourcesByStudentId from '@/actions/getResourcesByStudentId'
import {
  AttendanceSummaryProp,
  ExamProp,
  NoticeProp,
  ResourcesProp,
  SubjectProp,
  TransactionProp,
} from '@/types'
import getAttendanceByStudentId from '@/actions/getAttendanceByStudentId'
import Skeleton from '@/components/dashboard/Skeleton'

export default function Student() {
  const { setDialogOpen, dialogOpen } = useDataStore(state => state)
  const { userInfo } = useUserInfoStore(state => state)
  const [item, setItem] = React.useState<SubjectProp>()

  const [subject, setSubject] = React.useState<SubjectProp[]>([])
  const [notes, setNotes] = React.useState<NoticeProp[]>([])
  const [exam, setExam] = React.useState<ExamProp[]>([])
  const [transactions, setTransactions] = React.useState<TransactionProp[]>([])
  const [resources, setResources] = React.useState<ResourcesProp[]>([])
  const [attendances, setAttendances] = React.useState<AttendanceSummaryProp[]>(
    []
  )
  const [printItem, setPrintItem] = React.useState<TransactionProp>()

  const [isPendingSubject, startTransitionSubject] = React.useTransition()
  const [isPendingNote, startTransitionNote] = React.useTransition()
  const [isPendingExam, startTransitionExam] = React.useTransition()
  const [isPendingTrans, startTransitionTrans] = React.useTransition()
  const [isPendingResource, startTransitionResource] = React.useTransition()
  const [isPendingAtt, startTransitionAtt] = React.useTransition()

  React.useEffect(() => {
    if (!dialogOpen) {
      setItem(undefined)
      setPrintItem(undefined)
    }
  }, [dialogOpen])

  React.useEffect(() => {
    if (userInfo.studentId) {
      startTransitionSubject(() => {
        getClearanceCardByStudentId({ studentId: userInfo.studentId! }).then(
          res => {
            setSubject((res as SubjectProp[]) || [])
          }
        )
      })
    }
    if (userInfo.role) {
      startTransitionNote(() => {
        getNoticesByRole({ role: userInfo.role! }).then(res => {
          setNotes(res || [])
        })
      })
    }

    if (userInfo.studentId) {
      startTransitionExam(() => {
        getExamResultByStudentId({ studentId: userInfo.studentId! }).then(
          res => {
            setExam(res || [])
          }
        )
      })
    }

    if (userInfo.studentId) {
      startTransitionTrans(() => {
        getTransactionsByStudentId({ studentId: userInfo.studentId! }).then(
          res => {
            setTransactions((res as TransactionProp[]) || [])
          }
        )
      })
    }

    if (userInfo.studentId) {
      startTransitionResource(() => {
        getResourcesByStudentId({ studentId: userInfo.studentId! }).then(
          res => {
            setResources((res as ResourcesProp[]) || [])
          }
        )
      })
    }

    if (userInfo.studentId) {
      startTransitionAtt(() => {
        getAttendanceByStudentId({ studentId: userInfo.studentId! }).then(
          res => {
            setAttendances((res as AttendanceSummaryProp[]) || [])
          }
        )
      })
    }

    // eslint-disable-next-line
  }, [])

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
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Clearance Card</CardTitle>
        <CardDescription>Get your clearance card for exams</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-2 gap-2'>
        {subject?.map((item, i: number) => (
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
        ))}
      </CardContent>
    </Card>
  )

  const noticeCard = () => (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Notice Board</CardTitle>
        <CardDescription>Get all the latest updates here.</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-2'>
        {notes?.map((item, i: number) => (
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
        ))}
      </CardContent>
    </Card>
  )

  const examCard = () => (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Exam Results</CardTitle>
        <CardDescription>Get all exam results here.</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-2'>
        {exam?.map((item, i: number) => (
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
        ))}
      </CardContent>
    </Card>
  )

  const transactionCard = () => (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Get all transactions results here.</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-2'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='ps-0 text-xs'>Course</TableHead>
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
                  {item?.course?.name ? (
                    <>
                      {item?.course?.name} ({item?.semester})
                    </>
                  ) : (
                    'Enrollment Fee'
                  )}
                </TableCell>
                <TableCell className='px-2 py-1 text-xs'>
                  <FormatNumber value={item?.amount} />
                </TableCell>
                <TableCell className='grid grid-cols-1 px-2 py-1 text-xs'>
                  {item?.type === 'TUITION_PAYMENT' ? (
                    <span className='text-green-500'>{item?.type}</span>
                  ) : (
                    <span className='text-blue-500'>{item?.type}</span>
                  )}
                  {DateTime(item?.createdAt).format('YYYY-MM-DD')}
                </TableCell>
                <TableCell className='px-2 py-1 text-xs'>
                  {item?.paymentStatus === 'PAID' ? (
                    <span className='text-green-500'>
                      {item?.paymentStatus}
                    </span>
                  ) : (
                    <span className='text-red-500'>{item?.paymentStatus}</span>
                  )}
                </TableCell>
                <TableCell className='flex items-center gap-x-2 py-1 text-xs'>
                  {item?.paymentStatus === 'UNPAID' ? (
                    <Badge
                      onClick={() => console.log('online payment popup...')}
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
      </CardContent>
    </Card>
  )

  const resourceCard = () => (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Resources</CardTitle>
        <CardDescription>
          Get all resources you need for your class.
        </CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-2'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='ps-0 text-xs'>Course</TableHead>
              <TableHead className='ps-0 text-xs'>Subject</TableHead>
              <TableHead className='ps-0 text-xs'>Semester</TableHead>
              <TableHead className='ps-0 text-xs'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources?.map((item, i: number) =>
              item.course.subject?.map(sub =>
                sub?.resources?.map(res => (
                  <TableRow key={i}>
                    <TableCell className='px-2 py-1 text-xs'>
                      {item?.course?.name}
                    </TableCell>
                    <TableCell className='px-2 py-1 text-xs'>
                      {sub?.name}
                    </TableCell>
                    <TableCell className='px-2 py-1 text-xs'>
                      {item?.semester}
                    </TableCell>

                    <TableCell className='flex items-center gap-x-2 py-1 text-xs'>
                      <a
                        href={res.file}
                        target='_blank'
                        rel='noreferrer'
                        className='flex cursor-pointer items-center gap-x-1 rounded bg-green-500 px-1 py-0.5 text-white'
                      >
                        <FaPaperclip className='text-lg' /> Download
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  const attendanceCard = () => (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Attendances</CardTitle>
        <CardDescription>Get all summarized attendances.</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-2'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='ps-0 text-xs'>Course</TableHead>
              <TableHead className='ps-0 text-xs'>Subject</TableHead>
              <TableHead className='ps-0 text-xs'>Present</TableHead>
              <TableHead className='ps-0 text-xs'>Absent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendances?.map((item, i: number) => (
              <TableRow key={i}>
                <TableCell className='px-2 py-1 text-xs'>
                  {item?.course}
                </TableCell>
                <TableCell className='px-2 py-1 text-xs'>
                  {item?.subject}
                </TableCell>
                <TableCell className='px-2 py-1 text-xs text-green-500'>
                  {item?.present}
                </TableCell>
                <TableCell className='px-2 py-1 text-xs text-red-500'>
                  {item?.absent}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
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
      {isPendingTrans ? (
        <Skeleton />
      ) : (
        transactions?.length > 0 && transactionCard()
      )}
      {isPendingNote ? <Skeleton /> : notes?.length > 0 && noticeCard()}
      {isPendingResource ? (
        <Skeleton />
      ) : (
        resources?.length > 0 && resourceCard()
      )}
      {isPendingSubject ? (
        <Skeleton />
      ) : (
        subject?.length > 0 && clearanceCardCard()
      )}
      {isPendingExam ? <Skeleton /> : exam?.length > 0 && examCard()}
      {isPendingAtt ? (
        <Skeleton />
      ) : (
        attendances?.length > 0 && attendanceCard()
      )}
    </div>
  )
}
