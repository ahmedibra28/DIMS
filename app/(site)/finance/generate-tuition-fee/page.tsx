'use client'

import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import { TopLoadingBar } from '@/components/TopLoadingBar'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Spinner from '@/components/Spinner'
import { FormatNumber } from '@/components/FormatNumber'
import { FormButton } from '@/components/ui/CustomForm'
import { FaGear } from 'react-icons/fa6'

const Page = () => {
  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = useApi({
    key: ['generate-tuition-fee'],
    method: 'GET',
    url: `generate-tuition-fee`,
  })?.get

  const postApi = useApi({
    key: ['generate-tuition-fee'],
    method: 'POST',
    url: `generate-tuition-fee`,
  })?.post

  interface GenerateProp {
    course: {
      id: string
      name: string
    }
    shift: string
    semester: number
    discount: number
    amount: number
    students: number
  }

  const handleGenerate = (item: GenerateProp) => {
    postApi?.mutateAsync({
      courseId: item?.course?.id,
      semester: item?.semester,
      shift: item?.shift,
    })
  }

  return (
    <>
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}

      <TopLoadingBar isFetching={postApi?.isPending} />
      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message value={getApi?.error} />
      ) : (
        <div className='flex flex-col flex-wrap gap-2 p-3 mt-2 mb-10 bg-white md:flex-row'>
          <Table>
            <TableCaption>A list of available classes.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Discounts</TableHead>
                <TableHead>T. Amounts</TableHead>
                <TableHead>Generate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getApi?.data?.data?.map((item: GenerateProp, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item?.course?.name}</TableCell>
                  <TableCell>{item?.shift}</TableCell>
                  <TableCell>{item?.semester}</TableCell>
                  <TableCell>{item?.students}</TableCell>
                  <TableCell className='text-red-500'>
                    <FormatNumber value={item?.discount} />
                  </TableCell>
                  <TableCell className='text-green-500'>
                    <FormatNumber value={item?.amount - item?.discount} />
                  </TableCell>
                  <TableCell>
                    <FormButton
                      label='Generate'
                      onClick={() => handleGenerate(item)}
                      loading={postApi?.isPending}
                      icon={<FaGear />}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
