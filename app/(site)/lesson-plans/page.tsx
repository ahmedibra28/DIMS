'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import FormView from '@/components/FormView'
import Spinner from '@/components/Spinner'
import type { LessonPlan as ILessonPlan } from '@prisma/client'
import RTable from '@/components/RTable'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import useDataStore from '@/zustand/dataStore'
import { columns } from './columns'
import useUserInfoStore from '@/zustand/userStore'
import Upload from '@/components/Upload'

const FormSchema = z.object({
  subjectId: z.string().min(1),
  status: z.string().min(1),
  isApproved: z.boolean().optional(),
  note: z.string().min(1),
  courseId: z.string().min(1),
})

const Page = ({ params }: { params: { id: string } }) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')
  const [fileLink, setFileLink] = React.useState<string[]>([])

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const { dialogOpen, setDialogOpen } = useDataStore((state) => state)
  const { userInfo } = useUserInfoStore((state) => state)

  const getSubjectsApi = useApi({
    key: ['assign-courses', userInfo.id!],
    method: 'GET',
    url: `assign-instructor-to-subject/${userInfo.id}?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const getApi = useApi({
    key: ['lesson-plans', params.id],
    method: 'GET',
    url: `lesson-plans?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const postApi = useApi({
    key: ['lesson-plans'],
    method: 'POST',
    url: `lesson-plans`,
  })?.post

  const updateApi = useApi({
    key: ['lesson-plans'],
    method: 'PUT',
    url: `lesson-plans`,
  })?.put

  const deleteApi = useApi({
    key: ['lesson-plans'],
    method: 'DELETE',
    url: `lesson-plans`,
  })?.deleteObj

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subjectId: '',
      status: '',
      courseId: '',
    },
  })

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
      getApi?.refetch()
      setDialogOpen(false)
    }

    // eslint-disable-next-line
  }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess])

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

  const editHandler = (
    item: ILessonPlan & { subject: { course: { id: string } } }
  ) => {
    setId(item.id!)
    setEdit(true)
    form.setValue('subjectId', item?.subjectId)
    form.setValue('status', item?.status)
    form.setValue('isApproved', item?.isApproved)
    form.setValue('note', item?.note || '')
    setFileLink(item?.file ? [item?.file] : [])
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'Assign Subject'
  const modal = 'lessonPlan'

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEdit(false)
      setId(null)
      setFileLink([])
    }
    // eslint-disable-next-line
  }, [dialogOpen])

  const status = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' },
  ]

  const subjects =
    getSubjectsApi?.data?.data?.map((item: any) => ({
      label: `${item?.subject?.name} - ${item?.semester} - ${item?.shift}`,
      value: item?.id,
    })) || []

  const allowedToApprove =
    userInfo?.role === 'ADMIN' || userInfo?.role === 'SUPER_ADMIN'

  const formFields = (
    <Form {...form}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4'>
        <CustomFormField
          form={form}
          name='subjectId'
          label='Subject'
          placeholder='Subject'
          fieldType='select'
          data={subjects}
        />

        <CustomFormField
          form={form}
          name='note'
          label='Note'
          placeholder='Note'
          cols={5}
          rows={5}
        />
        <div className='mb-2'>
          <Upload
            label='Document'
            setFileLink={setFileLink}
            fileLink={fileLink}
            fileType='document'
          />
          {fileLink.length > 0 && (
            <div className='avatar text-center mt-2'>
              <div className='w-12'>
                <pre>{JSON.stringify(fileLink, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {allowedToApprove ? (
          <CustomFormField
            form={form}
            name='isApproved'
            label='Approve'
            placeholder='Approve'
            fieldType='switch'
          />
        ) : (
          <CustomFormField
            form={form}
            name='status'
            label='Status'
            placeholder='Status'
            fieldType='command'
            data={status}
          />
        )}
      </div>
    </Form>
  )

  const onSubmit = (
    values: z.infer<typeof FormSchema> & { instructorId: string; file: string }
  ) => {
    values.instructorId = params.id
    values.file = fileLink?.[0]

    edit
      ? updateApi?.mutateAsync({
          id: id,
          ...values,
        })
      : postApi?.mutateAsync(values)
  }

  return (
    <>
      {deleteApi?.isSuccess && <Message value={deleteApi?.data?.message} />}
      {deleteApi?.isError && <Message value={deleteApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      <FormView
        form={formFields}
        loading={updateApi?.isPending || postApi?.isPending}
        handleSubmit={form.handleSubmit}
        submitHandler={onSubmit}
        label={label}
        edit={edit}
      />

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message value={getApi?.error} />
      ) : (
        <div className='overflow-x-auto bg-white p-3 mt-2'>
          <RTable
            data={getApi?.data}
            columns={columns({
              editHandler,
              isPending: deleteApi?.isPending || false,
              deleteHandler,
            })}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            modal={modal}
            caption='Assign Subjects List'
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
