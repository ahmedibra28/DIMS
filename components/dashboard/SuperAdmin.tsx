import getNoticesByRole from '@/actions/getNoticesByRole'
import { CountProp, NoticeProp, UnpaidStudentsProp } from '@/types'
import useUserInfoStore from '@/zustand/userStore'
import React, { Fragment } from 'react'
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
import Skeleton from '@/components/dashboard/Skeleton'
import DateTime from '@/lib/dateTime'
import getCounts from '@/actions/getCounts'
import { FormatNumber } from '../FormatNumber'
import getTop10UnpaidStudents from '@/actions/getTop10UnpaidStudents'

export default function SuperAdmin() {
  const [count, setCount] = React.useState<CountProp[]>([])
  const [notes, setNotes] = React.useState<NoticeProp[]>([])
  const [unpaidStudents, setUnpaidStudents] = React.useState<
    UnpaidStudentsProp[]
  >([])

  const { userInfo } = useUserInfoStore(state => state)

  const [isPendingNote, startTransitionNote] = React.useTransition()
  const [isPendingCount, startTransitionCount] = React.useTransition()
  const [isPendingUnpaidStudents, startTransitionUnpaidStudents] =
    React.useTransition()

  React.useEffect(() => {
    startTransitionCount(() => {
      getCounts().then(res => {
        setCount(res)
      })
    })

    if (userInfo.role) {
      startTransitionNote(() => {
        getNoticesByRole({ role: userInfo.role! }).then(res => {
          setNotes(res || [])
        })
      })
    }

    startTransitionUnpaidStudents(() => {
      getTop10UnpaidStudents().then(res => {
        setUnpaidStudents(res || [])
      })
    })

    // eslint-disable-next-line
  }, [])

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

  const unpaidStudentsCard = () => (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Unpaid Students</CardTitle>
        <CardDescription>Get top 10 unpaid students</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-2'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='ps-0 text-xs'>Roll No</TableHead>
              <TableHead className='ps-0 text-xs'>Name</TableHead>
              <TableHead className='ps-0 text-xs'>Mobile</TableHead>
              <TableHead className='ps-0 text-xs'>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unpaidStudents?.map((item, i: number) => (
              <TableRow key={i}>
                <TableCell className='px-2 py-1 text-xs'>
                  {item?.rollNo}
                </TableCell>
                <TableCell className='px-2 py-1 text-xs'>
                  {item?.name}
                </TableCell>
                <TableCell className='px-2 py-1 text-xs'>
                  {item?.mobile}
                </TableCell>
                <TableCell className='px-2 py-1 text-xs text-red-500'>
                  <FormatNumber value={item?.balance} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  const getCount = (label: string, count: number, isCurrency = false) => (
    <Card className='text-center'>
      <CardHeader>
        <CardTitle>
          <FormatNumber value={count} isCurrency={isCurrency} />
        </CardTitle>
        <CardDescription
          className={
            !isCurrency
              ? ``
              : label.includes('Unpaid')
                ? 'text-red-500'
                : 'text-green-500'
          }
        >
          {label}
        </CardDescription>
      </CardHeader>
    </Card>
  )

  const getCountSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle className='mx-auto size-7 animate-pulse bg-gray-300' />
        <CardDescription className='mx-auto h-4 w-28 animate-pulse bg-gray-300' />
      </CardHeader>
    </Card>
  )

  return (
    <>
      <div className='mb-3 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {isPendingCount
          ? [...Array(15)].map((_, i) => getCountSkeleton())
          : count.map(item =>
              getCount(item.label, item.count, item.isCurrency)
            )}
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {isPendingNote ? <Skeleton /> : notes?.length > 0 && noticeCard()}
        {isPendingUnpaidStudents ? <Skeleton /> : unpaidStudentsCard()}
      </div>
    </>
  )
}
