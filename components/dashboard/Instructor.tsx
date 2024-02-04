'use client'

import React, { Fragment } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormButton } from '../ui/CustomForm'
import DateTime from '@/lib/dateTime'
import useUserInfoStore from '@/zustand/userStore'
import getNoticesByRole from '@/actions/getNoticesByRole'
import { FaCalendar } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import getSubjectsByInstructor from '@/actions/getSubjectsByInstructor'

interface NoticeProp {
  id: string
  title: string
  note: string
  createdAt: Date
  createdBy: {
    name: string
  }
}

interface SubjectProp {
  id: string
  semester: 2
  shift: string
  subject: {
    id: string
    name: string
    course: {
      id: string
      name: string
    }
  }
}

export default function Instructor() {
  const { userInfo } = useUserInfoStore(state => state)
  const router = useRouter()

  const [notes, setNotes] = React.useState<NoticeProp[]>([])
  const [subjects, setSubjects] = React.useState<SubjectProp[]>([])

  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    if (userInfo.role) {
      startTransition(() => {
        getNoticesByRole({ role: userInfo.role! }).then(res => {
          setNotes(res || [])
        })
      })
    }

    if (userInfo.instructorId) {
      startTransition(() => {
        getSubjectsByInstructor({ instructorId: userInfo.instructorId! }).then(
          res => {
            setSubjects((res as SubjectProp[]) || [])
          }
        )
      })
    }

    // eslint-disable-next-line
  }, [])

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

  const subjectCard = () => (
    <Card className='w-full md:w-[48%] lg:w-[48%]'>
      <CardHeader>
        <CardTitle>Subjects & Attendance</CardTitle>
        <CardDescription>
          Get all subjects you are assigned to with attendance.
        </CardDescription>
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
                  <TableHead className='ps-0 text-xs'>Subject</TableHead>
                  <TableHead className='ps-0 text-xs'>Semester</TableHead>
                  <TableHead className='ps-0 text-xs'>Shift</TableHead>
                  <TableHead className='ps-0 text-xs'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects?.map((item, i: number) => (
                  <TableRow key={i}>
                    <TableCell className='px-2 py-1 text-xs'>
                      {item?.subject?.course?.name}
                    </TableCell>
                    <TableCell className='px-2 py-1 text-xs'>
                      {item?.subject?.name}
                    </TableCell>
                    <TableCell className='px-2 py-1 text-xs'>
                      {item?.semester}
                    </TableCell>
                    <TableCell className='px-2 py-1 text-xs'>
                      {item?.shift}
                    </TableCell>

                    <TableCell className='flex items-center gap-x-2 py-1 text-xs'>
                      <Badge
                        onClick={() =>
                          router.push(
                            `/attendances?semester=${item?.semester}&shift=${item?.shift}&course_id=${item?.subject?.course?.id}&subject_id=${item?.subject?.id}`
                          )
                        }
                        className='flex cursor-pointer items-center gap-x-1 rounded bg-green-500 text-white'
                      >
                        <FaCalendar className='text-lg' /> At
                      </Badge>
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
      {notes?.length > 0 && noticeCard()}
      {notes?.length > 0 && subjectCard()}
    </div>
  )
}
