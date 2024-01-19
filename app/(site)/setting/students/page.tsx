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
import type { Student as IStudent } from '@prisma/client'
import RTable from '@/components/RTable'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField from '@/components/ui/CustomForm'
import useEditStore from '@/zustand/editStore'
import { useColumn } from './hook/useColumn'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import useResetStore from '@/zustand/resetStore'
import Upload from '@/components/Upload'
import Image from 'next/image'

const FormSchema = z.object({
  name: z.string().min(1),
  placeOfBirth: z.string().min(1),
  dateOfBirth: z.string().min(1),
  nationality: z.string().min(1),
  Sex: z.string().min(1),
  education: z.string().min(1),
  district: z.string().min(1),
  mobile: z.string().min(1),
  contactName: z.string().min(1),
  contactMobile: z.string().min(1),
  contactEmail: z.string().min(1),
  contactRelation: z.string().min(1),
  somaliLanguage: z.string().min(1),
  arabicLanguage: z.string().min(1),
  englishLanguage: z.string().min(1),
  kiswahiliLanguage: z.string().min(1),
  image: z.string().min(1),
  note: z.string(),
  status: z.string().min(1),
})

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [id, setId] = useState<string | null>(null)
  const { edit, setEdit } = useEditStore((state) => state)
  const [q, setQ] = useState('')
  const [fileLink, setFileLink] = React.useState<string[]>([])

  const { reset, setReset } = useResetStore((state) => state)

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = useApi({
    key: ['students'],
    method: 'GET',
    url: `students?page=${page}&q=${q}&limit=${limit}`,
  })?.get

  const postApi = useApi({
    key: ['students'],
    method: 'POST',
    url: `students`,
  })?.post

  const updateApi = useApi({
    key: ['students'],
    method: 'PUT',
    url: `students`,
  })?.put

  const deleteApi = useApi({
    key: ['students'],
    method: 'DELETE',
    url: `students`,
  })?.deleteObj

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      placeOfBirth: '',
      dateOfBirth: '',
      nationality: '',
      Sex: '',
      education: '',
      district: '',
      mobile: '',
      contactName: '',
      contactMobile: '',
      contactEmail: '',
      contactRelation: '',
      somaliLanguage: '',
      arabicLanguage: '',
      englishLanguage: '',
      kiswahiliLanguage: '',
      image: '',
      note: '',
      status: '',
    },
  })

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
      setReset(!reset)
      getApi?.refetch()
      window.document.getElementById('dialog-close')?.click()
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

  const refEdit = React.useRef(edit)
  const refId = React.useRef(id)

  const editHandler = (item: IStudent) => {
    setId(item.id!)
    setEdit(true)

    refEdit.current = true
    refId.current = item.id!
    form.setValue('name', item?.name)
    form.setValue('placeOfBirth', item?.placeOfBirth)
    form.setValue('dateOfBirth', item?.dateOfBirth)
    form.setValue('nationality', item?.nationality)
    form.setValue('Sex', item?.Sex)
    form.setValue('education', item?.education)
    form.setValue('district', item?.district)
    form.setValue('mobile', String(item?.mobile))
    form.setValue('contactName', item?.contactName)
    form.setValue('contactMobile', String(item?.contactMobile))
    form.setValue('contactEmail', item?.contactEmail)
    form.setValue('contactRelation', item?.contactRelation)
    form.setValue('somaliLanguage', item?.somaliLanguage)
    form.setValue('arabicLanguage', item?.arabicLanguage)
    form.setValue('englishLanguage', item?.englishLanguage)
    form.setValue('kiswahiliLanguage', item?.kiswahiliLanguage)
    form.setValue('image', item?.image!)
    form.setValue('note', item?.note!)
    form.setValue('status', item?.status)

    // setFileLink(!getApi?.isPending ? [getApi?.data?.image] : [])
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const label = 'Student'
  const modal = 'student'

  useEffect(() => {
    form.reset()
    setEdit(false)
    setId(null)
    refEdit.current = false
    refId.current = null
    setFileLink([])
    // eslint-disable-next-line
  }, [reset])

  const status = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' },
  ]

  const languageLevel = [
    { label: 'FLUENT', value: 'FLUENT' },
    { label: 'GOOD', value: 'GOOD' },
    { label: 'FAIR', value: 'FAIR' },
  ]

  const country = [
    { label: 'Somalia', value: 'Somalia' },
    { label: 'Kenya', value: 'Kenya' },
    { label: 'Ethiopia', value: 'Ethiopia' },
    { label: 'Uganda', value: 'Uganda' },
    { label: 'Tanzania', value: 'Tanzania' },
    { label: 'Rwanda', value: 'Rwanda' },
    { label: 'Burundi', value: 'Burundi' },
    { label: 'South Sudan', value: 'South Sudan' },
    { label: 'Sudan', value: 'Sudan' },
    { label: 'Djibouti', value: 'Djibouti' },
    { label: 'Eritrea', value: 'Eritrea' },
  ]

  const formFields = (
    <Form {...form}>
      <div>
        <h1 className='font-bold uppercase text-primary'>
          Personal Information
        </h1>
        <hr className='my-2' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-4 mt-2'>
          <CustomFormField
            form={form}
            name='name'
            label='Name'
            placeholder='Name'
            type='text'
          />
          <CustomFormField
            form={form}
            name='placeOfBirth'
            label='Place of Birth'
            placeholder='Place of Birth'
            type='text'
          />
          <CustomFormField
            form={form}
            name='dateOfBirth'
            label='Date of Birth'
            placeholder='Date of Birth'
            type='date'
          />
          <CustomFormField
            form={form}
            name='nationality'
            label='Nationality'
            placeholder='Nationality'
            fieldType='command'
            data={country}
          />
          <CustomFormField
            form={form}
            name='Sex'
            label='Sex'
            placeholder='Sex'
            type='text'
          />
          <CustomFormField
            form={form}
            name='education'
            label='Education'
            placeholder='Education'
            type='text'
          />
        </div>
        <h1 className='font-bold uppercase text-primary'>Permanent Address</h1>
        <hr className='my-2' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-4 mt-2'>
          <CustomFormField
            form={form}
            name='district'
            label='District'
            placeholder='District'
            type='text'
          />
          <CustomFormField
            form={form}
            name='mobile'
            label='Mobile'
            placeholder='Mobile'
            type='text'
          />
        </div>
        <h1 className='font-bold uppercase text-primary'>
          Contact Person In Case Of Emergency
        </h1>
        <hr className='my-2' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-4 mt-2'>
          <CustomFormField
            form={form}
            name='contactName'
            label='Contact Name'
            placeholder='Contact Name'
            type='text'
          />
          <CustomFormField
            form={form}
            name='contactMobile'
            label='Contact Mobile'
            placeholder='Contact Mobile'
            type='text'
          />
          <CustomFormField
            form={form}
            name='contactEmail'
            label='Contact Email'
            placeholder='Contact Email'
            type='text'
          />
          <CustomFormField
            form={form}
            name='contactRelation'
            label='Contact Relation'
            placeholder='Contact Relation'
            type='text'
          />
        </div>
        <h1 className='font-bold uppercase text-primary'>Language Skills</h1>
        <hr className='my-2' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-4 mt-2'>
          <CustomFormField
            form={form}
            name='somaliLanguage'
            label='Somali Language'
            placeholder='Somali Language'
            fieldType='command'
            data={languageLevel}
          />
          <CustomFormField
            form={form}
            name='arabicLanguage'
            label='Arabic Language'
            placeholder='Arabic Language'
            fieldType='command'
            data={languageLevel}
          />
          <CustomFormField
            form={form}
            name='englishLanguage'
            label='English Language'
            placeholder='English Language'
            fieldType='command'
            data={languageLevel}
          />
          <CustomFormField
            form={form}
            name='kiswahiliLanguage'
            label='Kiswahili Language'
            placeholder='Kiswahili Language'
            fieldType='command'
            data={languageLevel}
          />
        </div>

        <div className='mb-2'>
          <Upload
            label='Image'
            setFileLink={setFileLink}
            fileLink={fileLink}
            fileType='image'
          />
          {fileLink.length > 0 && (
            <div className='avatar text-center flex justify-center items-end mt-2'>
              <div className='w-12 mask mask-squircle'>
                <Image
                  src={fileLink?.[0]}
                  alt='avatar'
                  width={50}
                  height={50}
                  style={{ objectFit: 'cover' }}
                  className='rounded-full'
                />
              </div>
            </div>
          )}
        </div>

        <CustomFormField
          form={form}
          name='note'
          label='Note'
          placeholder='Note'
          type='text'
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

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    values.image = fileLink ? fileLink[0] : ''
    refEdit.current
      ? updateApi?.mutateAsync({
          id: refId.current,
          ...values,
        })
      : postApi?.mutateAsync(values)
  }

  const formChildren = (
    <FormView
      form={formFields}
      loading={updateApi?.isPending || postApi?.isPending}
      handleSubmit={form.handleSubmit}
      submitHandler={onSubmit}
      label={label}
      width='w-auto md:min-w-[600px]'
      height='h-[80vh]'
    />
  )

  const { columns } = useColumn({
    editHandler,
    isPending: deleteApi?.isPending || false,
    deleteHandler,
    formChildren,
  })

  return (
    <>
      {deleteApi?.isSuccess && <Message value={deleteApi?.data?.message} />}
      {deleteApi?.isError && <Message value={deleteApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />}

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message value={getApi?.error} />
      ) : (
        <div className='overflow-x-auto bg-white p-3 mt-2'>
          <RTable
            data={getApi?.data}
            columns={columns}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            modal={modal}
            caption='Students List'
          >
            {formChildren}
          </RTable>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
