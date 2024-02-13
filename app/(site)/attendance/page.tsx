'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter, useSearchParams } from 'next/navigation'
import Message from '@/components/Message'
import Spinner from '@/components/Spinner'
import RTable from '@/components/RTable'

import { TopLoadingBar } from '@/components/TopLoadingBar'
import { columns } from './columns'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import { FaPaperPlane, FaSpinner } from 'react-icons/fa6'

interface IAttProp {
  id: string
  semester: number
  shift: string
  student: {
    name: string
    id: string
    rollNo: string
  }
  course: {
    name: string
    id: string
    subject: {
      name: string
      id: string
    }[]
  }
  present: boolean
}

interface ISelect {
  id: string
  semester: number
  shift: string
  student: string
  studentId: string
  courseId: string
  subjectId: string
  present: boolean
}

let selectedStudents: ISelect[] = []

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [q, setQ] = useState('')

  const path = useAuthorization()
  const router = useRouter()
  const searchParams = useSearchParams()
  const semester = searchParams.get('semester')
  const shift = searchParams.get('shift')
  const course_id = searchParams.get('course_id')
  const subject_id = searchParams.get('subject_id')

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = useApi({
    key: ['attendances'],
    method: 'GET',
    url: `attendances?page=${page}&q=${q}&limit=${limit}&semester=${semester}&shift=${shift}&course_id=${course_id}&subject_id=${subject_id}&status=ACTIVE`,
  })?.get

  const postApi = useApi({
    key: ['attendances'],
    method: 'POST',
    url: `attendances`,
  })?.post

  useEffect(() => {
    if (postApi?.isSuccess) {
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }

    // eslint-disable-next-line
  }, [postApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [limit])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const checkboxHandler = (item: IAttProp) => {
    const data = {
      id: item?.id,
      semester: item?.semester,
      shift: item?.shift,
      student: item?.student?.name,
      studentId: item?.student?.id,
      courseId: item?.course?.id,
      subjectId: item?.course?.subject?.[0]?.id,
      present: item?.present,
    }

    const unique = selectedStudents?.filter(i => i.studentId !== data.studentId)

    selectedStudents = [...unique, data]
  }

  const onSubmit = () => {
    postApi?.mutateAsync(selectedStudents)
  }

  return (
    <>
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message value={getApi?.error} />
      ) : (
        <div className='mt-2 overflow-x-auto bg-white p-3'>
          <RTable
            data={getApi?.data}
            columns={columns({
              checkboxHandler,
            })}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            caption='Attendances List'
            py='py-2'
            hasAdd={false}
          />
          <div className='text-center'>
            <AlertDialog>
              <AlertDialogTrigger>
                <div className='mx-auto flex h-10 w-full min-w-32 items-center justify-center gap-x-1 rounded bg-primary px-2 text-sm text-white duration-100 hover:bg-primary/90'>
                  {postApi?.isPending ? (
                    <>
                      <FaSpinner className='mr-1 animate-spin' />
                      Loading
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Submit
                    </>
                  )}
                </div>
              </AlertDialogTrigger>
              <ConfirmDialog
                onClick={() => onSubmit()}
                message='This action cannot be undone. This will permanently saves your data to the database.'
              />
            </AlertDialog>
            {/* <FormButton
              onClick={onSubmit}
              loading={updateApi?.isPending || postApi?.isPending}
              type='submit'
              label='Submit'
              className='min-w-40'
            /> */}
          </div>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
