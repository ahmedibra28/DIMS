'use client'

import React, { useState, useEffect, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormButton } from '@/components/ui/CustomForm'
import getCoursesById from '@/actions/getCoursesById'
import FormContainer from '@/components/FormContainer'

interface DataProp {
  label: string
  value: string
}

const FormSchema = z.object({
  semester: z.string(),
  shift: z.string(),
  courseId: z.string(),
})

const Page = () => {
  const [semester, setSemester] = useState<DataProp[]>([])

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const [isPending, startTransition] = useTransition()

  const postApi = useApi({
    key: ['generate-tuition-fee'],
    method: 'POST',
    url: `generate-tuition-fee`,
  })?.post

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      semester: '',
      courseId: '',
      shift: '',
    },
  })

  useEffect(() => {
    if (form.watch().courseId) {
      startTransition(() => {
        getCoursesById({ courseId: form.watch().courseId }).then((res) => {
          const numberToArray = Array.from(
            { length: res?.duration || 0 },
            (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })
          )

          // form.setValue('semester', '')
          setSemester(numberToArray)
        })
      })
    }

    // eslint-disable-next-line
  }, [form.watch().courseId])

  const onSubmit = (values: any) => {
    postApi?.mutateAsync(values)
  }

  const shift = [
    { label: 'Morning', value: 'MORNING' },
    { label: 'Afternoon', value: 'AFTERNOON' },
  ]

  const formFields = (
    <Form {...form}>
      <CustomFormField
        form={form}
        name='courseId'
        label='Course'
        placeholder='Course'
        fieldType='command'
        data={[]}
        key='courses'
        url='courses?page=1&limit=10&status=ACTIVE'
      />
      <CustomFormField
        form={form}
        name='semester'
        label='Semester'
        placeholder='Semester'
        fieldType='select'
        data={semester}
      />
      <CustomFormField
        form={form}
        name='shift'
        label='Shift'
        placeholder='Shift'
        fieldType='command'
        data={shift}
      />
    </Form>
  )

  return (
    <>
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}

      <TopLoadingBar isFetching={postApi?.isPending} />

      <FormContainer title='Generate Tuition Fee' showFooter={false}>
        <form onSubmit={form.handleSubmit(onSubmit)} method='dialog'>
          {formFields}
          <FormButton
            loading={isPending || postApi?.isPending}
            type='submit'
            label='Generate Tuition Fee'
          />
        </form>
      </FormContainer>
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
