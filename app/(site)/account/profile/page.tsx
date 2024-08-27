'use client'
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'

import Image from 'next/image'
import useApi from '@/hooks/useApi'
import Message from '@/components/Message'
import Spinner from '@/components/Spinner'
import useUserInfoStore from '@/zustand/userStore'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormButton, Upload } from '@/components/ui/CustomForm'

const Profile = () => {
  const [fileLink, setFileLink] = React.useState<string[]>([])

  const path = useAuthorization()
  const router = useRouter()

  const { userInfo, updateUserInfo } = useUserInfoStore(state => state)

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = useApi({
    key: ['profiles'],
    method: 'GET',
    url: `profile`,
  })?.get
  const updateApi = useApi({
    key: ['profiles'],
    method: 'PUT',
    url: `profile`,
  })?.put

  const FormSchema = z
    .object({
      name: z.string(),
      address: z.string(),
      mobile: z.string(),
      bio: z.string(),
      password: z.string().refine(val => val.length === 0 || val.length > 6, {
        message: "Password can't be less than 6 characters",
      }),
      confirmPassword: z
        .string()
        .refine(val => val.length === 0 || val.length > 6, {
          message: "Confirm password can't be less than 6 characters",
        }),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: 'Password do not match',
      path: ['confirmPassword'],
    })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      address: '',
      mobile: '',
      bio: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {
    updateApi?.mutateAsync({
      ...values,
      id: getApi?.data?.id,
      image: fileLink ? fileLink[0] : getApi?.data?.image,
    })
  }

  useEffect(() => {
    if (updateApi?.isSuccess) {
      getApi?.refetch()
      const { name, mobile, email, image } = updateApi?.data
      updateUserInfo({
        ...userInfo,
        name,
        mobile,
        email,
        image,
      })
      setFileLink([])
    }
    // eslint-disable-next-line
  }, [updateApi?.isSuccess])

  // {
  //   id: 'MTbJ5LaJwd93YjU3liXS6',
  //   name: 'Fatma Jeri',
  //   email: 's@ahmedibra.com',
  //   mobile: null,
  //   image:
  //     'https://ui-avatars.com/api/?uppercase=true&name=Fatma Jeri&background=random&color=random&size=128',
  //   bio: null,
  //   address: null,
  //   instructorId: null,
  //   studentId: '6VOs2P24zBuHNsPLBaABw'
  // }

  useEffect(() => {
    if (!getApi?.isPending) {
      form.setValue('name', getApi?.data?.name)
      form.setValue('address', getApi?.data?.address)
      form.setValue('mobile', getApi?.data?.mobile)
      form.setValue('bio', getApi?.data?.bio)
      // @ts-ignore
      setFileLink([getApi?.data?.image] || [])
    }
    // eslint-disable-next-line
  }, [getApi?.isPending, form.setValue])

  return (
    <div className='mx-auto mt-2 max-w-6xl bg-white p-3'>
      {updateApi?.isError && <Message value={updateApi?.error} />}

      {getApi?.isError && <Message value={getApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}

      {getApi?.isPending && <Spinner />}

      <div className='mx-auto max-w-4xl bg-opacity-60'>
        <div className='text-center text-3xl uppercase'> {userInfo.name}</div>
        <div className='mb-10 text-center'>
          <div className='mx-auto w-32 rounded-full bg-primary text-white'>
            <span> {userInfo.role}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {getApi?.data?.image && (
              <div className='avatar flex justify-center text-center'>
                <div className='w-32'>
                  <Image
                    src={
                      getApi?.data.image?.replaceAll(' ', '') ||
                      `https://ui-avatars.com/api/?uppercase=true&name=${getApi?.data?.name}`
                    }
                    alt='avatar'
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover' }}
                    className='rounded-full'
                  />
                </div>
              </div>
            )}

            <div className='flex flex-row flex-wrap gap-2'>
              <div className='w-full md:w-[48%] lg:w-[32%]'>
                <CustomFormField
                  form={form}
                  name='name'
                  label='Name'
                  placeholder='Enter name'
                  type='text'
                />
              </div>
              <div className='w-full md:w-[48%] lg:w-[32%]'>
                <CustomFormField
                  form={form}
                  name='address'
                  label='Address'
                  placeholder='Enter address'
                  type='text'
                />
              </div>

              <div className='w-full md:w-[48%] lg:w-[32%]'>
                <CustomFormField
                  form={form}
                  name='mobile'
                  label='Mobile'
                  placeholder='Enter mobile'
                  type='number'
                  step='0.01'
                />
              </div>

              <div className='w-full md:w-[48%] lg:w-[32%]'>
                <CustomFormField
                  form={form}
                  name='bio'
                  label='Bio'
                  placeholder='Tell us about yourself'
                  type='text'
                  cols={30}
                  rows={5}
                />
              </div>

              <div className='w-full md:w-[48%] lg:w-[32%]'>
                <Upload
                  label='Image'
                  setFileLink={setFileLink}
                  fileLink={fileLink}
                  fileType='image'
                />

                {fileLink.length > 0 && (
                  <div className='avatar mt-2 flex items-end justify-center text-center'>
                    <div className='mask mask-squircle w-12'>
                      <Image
                        src={fileLink?.[0]?.replaceAll(' ', '')}
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

              <div className='flex w-full flex-row flex-wrap justify-start gap-2'>
                <div className='w-full'>
                  <hr className='my-5' />
                </div>
                <div className='w-full md:w-[48%] lg:w-[32%]'>
                  <CustomFormField
                    form={form}
                    name='password'
                    label='Password'
                    placeholder="Leave blank if you don't want to change"
                    type='password'
                  />
                </div>
                <div className='w-full md:w-[48%] lg:w-[32%]'>
                  <CustomFormField
                    form={form}
                    name='confirmPassword'
                    label='Confirm Password'
                    placeholder='Confirm Password'
                    type='password'
                  />
                </div>
              </div>
            </div>

            <div className='w-full pt-3 md:w-[48%] lg:w-[32%]'>
              <FormButton
                loading={updateApi?.isPending}
                label='Update Profile'
                className='w-full'
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Profile), {
  ssr: false,
})
