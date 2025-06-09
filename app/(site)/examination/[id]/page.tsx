'use client'

import React, {
  useState,
  useEffect,
  FormEvent,
  useTransition,
  use,
} from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter, useSearchParams } from 'next/navigation'
import Message from '@/components/Message'
import FormView from '@/components/FormView'
import Spinner from '@/components/Spinner'
import type { Examination as IExamination } from '@prisma/client'
import RTable from '@/components/RTable'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import useDataStore from '@/zustand/dataStore'
import { columns } from './columns'
import getExamsByAssignCourseId from '@/actions/getExamsByAssignCourseId'

interface DataProp {
  label: string
  value: string
}

const FormSchema = z.object({
  examination: z.string().min(1),
  theoryMarks: z.string().min(1),
  practicalMarks: z.string().min(1),
  status: z.string().min(1),
  subjectId: z.string().min(1),
})

interface Props {
  params: Promise<{
    id: string
  }>
}

const Page = (props: Props) => {
  const params = use(props.params)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')
  const [exam, setExam] = useState<DataProp[]>([])
  const [subject, setSubject] = useState<DataProp[]>([])
  const [semester, setSemester] = useState<number | null>(null)

  const searchParams = useSearchParams()
  const studentId = searchParams.get('student')

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const { dialogOpen, setDialogOpen } = useDataStore(state => state)
  const [isPending, startTransition] = useTransition()

  const getApi = useApi({
    key: ['examinations', `${studentId}`, `${params.id}`],
    method: 'GET',
    url: `examinations/${studentId}?page=${page}&q=${q}&limit=${limit}&assign-course-id=${params.id}`,
  })?.get

  const postApi = useApi({
    key: ['examinations'],
    method: 'POST',
    url: `examinations`,
  })?.post

  const updateApi = useApi({
    key: ['examinations'],
    method: 'PUT',
    url: `examinations`,
  })?.put

  const deleteApi = useApi({
    key: ['examinations'],
    method: 'DELETE',
    url: `examinations`,
  })?.deleteObj

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      examination: '',
      theoryMarks: '',
      practicalMarks: '',
      subjectId: '',
      status: '',
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

  const editHandler = (item: IExamination) => {
    setId(item.id!)
    setEdit(true)
    form.setValue('examination', item?.examination)
    form.setValue('theoryMarks', String(item?.theoryMarks))
    form.setValue('practicalMarks', String(item?.practicalMarks))
    form.setValue('subjectId', item?.subjectId)
    form.setValue('status', item?.status)
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'Examination'
  const modal = 'examination'

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEdit(false)
      setId(null)
    }
    // eslint-disable-next-line
  }, [dialogOpen])

  const status = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' },
  ]

  useEffect(() => {
    if (params.id) {
      startTransition(() => {
        getExamsByAssignCourseId({ assignCourseId: params.id }).then(res => {
          const exams =
            res?.course?.examinations?.map(item => ({
              label: item,
              value: item,
            })) || []

          const subjects =
            res?.subjects?.map(item => ({
              label: item.name,
              value: item.id,
            })) || []

          setExam(exams)
          setSemester(res?.semester || null)
          setSubject(subjects)
        })
      })
    }

    // eslint-disable-next-line
  }, [params.id])

  const formFields = (
    <Form {...form}>
      <div className='grid grid-cols-1 gap-x-4 md:grid-cols-2'>
        <CustomFormField
          form={form}
          name='subjectId'
          label='Subject'
          placeholder='Subject'
          fieldType='select'
          data={subject}
        />
        <CustomFormField
          form={form}
          name='examination'
          label='Examination'
          placeholder='Examination'
          fieldType='select'
          data={exam}
        />
        <CustomFormField
          form={form}
          name='theoryMarks'
          label='Theory Marks'
          placeholder='Theory marks'
          type='number'
        />
        <CustomFormField
          form={form}
          name='practicalMarks'
          label='Practical Marks'
          placeholder='Practical marks'
          type='number'
        />
        <CustomFormField
          form={form}
          name='status'
          label='Status'
          placeholder='Status'
          fieldType='command'
          data={status}
        />
      </div>
    </Form>
  )

  const onSubmit = (
    values: z.infer<typeof FormSchema> & {
      semester: number
      studentId: string
      assignCourseId: string
    }
  ) => {
    values.semester = semester || 0
    values.studentId = studentId || ''
    values.assignCourseId = params.id

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

      <TopLoadingBar
        isFetching={getApi?.isFetching || getApi?.isPending || isPending}
      />

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
        <div className='mt-2 overflow-x-auto bg-white p-3'>
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
            caption='Examinations List'
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
