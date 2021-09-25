import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import {
  FaCheckCircle,
  FaEdit,
  FaIdCard,
  FaInfoCircle,
  FaPhoneAlt,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'
import Pagination from '../../components/Pagination'
import {
  getInstructors,
  updateInstructor,
  deleteInstructor,
  addInstructor,
} from '../../api/instructor'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'
import {
  inputCheckBox,
  inputDate,
  inputEmail,
  inputFile,
  inputNumber,
  inputText,
  inputTextArea,
  staticInputSelect,
} from '../../utils/dynamicForm'
import moment from 'moment'

const Instructors = () => {
  const [page, setPage] = useState(1)
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
    },
  })

  const [file, setFile] = useState('')

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'instructors',
    () => getInstructors(page),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = useMutation(updateInstructor, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      setImageDisplay('')
      setFile('')
      queryClient.invalidateQueries(['instructors'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteInstructor, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['instructors']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addInstructor, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      setFile('')
      setImageDisplay('')
      queryClient.invalidateQueries(['instructors'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [imageDisplay, setImageDisplay] = useState('')

  const formCleanHandler = () => {
    setEdit(false)
    setFile('')
    setImageDisplay('')
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  useEffect(() => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setImageDisplay(reader.result)
    })
    file && reader.readAsDataURL(file)
  }, [file])

  const submitHandler = (data) => {
    const formData = new FormData()
    formData.append('picture', data.picture[0])
    formData.append('isActive', data.isActive)
    formData.append('fullName', data.fullName)
    formData.append('placeOfBirth', data.placeOfBirth)
    formData.append('dateOfBirth', data.dateOfBirth)
    formData.append('nationality', data.nationality)
    formData.append('gender', data.gender)
    formData.append('email', data.email)
    formData.append('mobileNumber', data.mobileNumber)
    formData.append('district', data.district)
    formData.append('qualification', data.qualification)
    formData.append('contactFullName', data.contactFullName)
    formData.append('contactMobileNumber', data.contactMobileNumber)
    formData.append('contactEmail', data.contactEmail)
    formData.append('contactRelationship', data.contactRelationship)
    formData.append('experience', data.experience)
    formData.append('comment', data.comment)

    edit
      ? updateMutateAsync({
          _id: id,
          formData,
        })
      : addMutateAsync(formData)
  }

  const editHandler = (instructor) => {
    setId(instructor._id)
    setEdit(true)
    setValue('isActive', instructor.isActive)
    setValue('fullName', instructor.fullName)
    setValue('placeOfBirth', instructor.placeOfBirth)
    setValue('dateOfBirth', moment(instructor.dateOfBirth).format('YYYY-MM-DD'))
    setValue('nationality', instructor.nationality)
    setValue('gender', instructor.gender)
    setValue('email', instructor.email)
    setValue('district', instructor.district)
    setValue('mobileNumber', instructor.mobileNumber)
    setValue('qualification', instructor.qualification)
    setValue('contactFullName', instructor.contactFullName)
    setValue('contactMobileNumber', instructor.contactMobileNumber)
    setValue('contactEmail', instructor.contactEmail)
    setValue('contactRelationship', instructor.contactRelationship)
    setValue('experience', instructor.experience)
    setValue('comment', instructor.comment)
    setImageDisplay(instructor.picture && instructor.picture.picturePath)
  }

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('instructors')
    }
    refetch()
  }, [page, queryClient])

  return (
    <div className='container'>
      <Head>
        <title>Instructors</title>
        <meta property='og:title' content='Instructors' key='title' />
      </Head>
      {isSuccessDelete && (
        <Message variant='success'>
          Instructor has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {isSuccessUpdate && (
        <Message variant='success'>
          Instructor has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Instructor has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}

      <div
        className='modal fade'
        id='editInstructorModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editInstructorModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editInstructorModalLabel'>
                {edit ? 'Edit Instructor' : 'Add Instructor'}
              </h3>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanHandler}
              ></button>
            </div>
            <div className='modal-body'>
              {isLoading ? (
                <div className='text-center'>
                  <Loader
                    type='ThreeDots'
                    color='#00BFFF'
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                  />
                </div>
              ) : isError ? (
                <Message variant='danger'>{error}</Message>
              ) : (
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className='row'>
                    <h4 className='text-center'>Personal Information</h4> <hr />
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        errors,
                        label: 'Full Name',
                        name: 'fullName',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        errors,
                        label: 'Place Of Birth',
                        name: 'placeOfBirth',
                      })}
                    </div>
                    <div className='col-md-4 col-12'>
                      {inputDate({
                        register,
                        errors,
                        label: 'Date Of Birth',
                        name: 'dateOfBirth',
                      })}
                    </div>
                    <div className='col-md-4 col-12'>
                      {inputText({
                        register,
                        errors,
                        label: 'Nationality',
                        name: 'nationality',
                      })}
                    </div>
                    <div className='col-md-4 col-12'>
                      {staticInputSelect({
                        register,
                        errors,
                        data: [{ name: 'Male' }, { name: 'Female' }],
                        name: 'gender',
                        label: 'Gender',
                      })}
                    </div>
                    <div className='col-md-4 col-12'>
                      {inputEmail({
                        register,
                        errors,
                        label: 'Email',
                        name: 'email',
                      })}
                    </div>
                    <div className='col-md-4 col-12'>
                      {inputText({
                        register,
                        errors,
                        label: 'Qualification',
                        name: 'qualification',
                      })}
                    </div>
                    <div className='col-md-4 col-12'>
                      {inputNumber({
                        register,
                        errors,
                        label: 'Experience',
                        name: 'experience',
                      })}
                    </div>
                    <h4 className='text-center'>Permanent Address</h4> <hr />
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        errors,
                        label: 'District',
                        name: 'district',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputNumber({
                        register,
                        errors,
                        label: 'Mobile Number',
                        name: 'mobileNumber',
                      })}
                    </div>
                    <h4 className='text-center'>
                      Contact Person In Case Of Emergency
                    </h4>
                    <hr />
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        errors,
                        label: 'Contact Full Name',
                        name: 'contactFullName',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputNumber({
                        register,
                        errors,
                        label: 'Contact Mobile Number',
                        name: 'contactMobileNumber',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputEmail({
                        register,
                        errors,
                        label: 'Contact Email',
                        name: 'contactEmail',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        errors,
                        label: 'Contact Relationship',
                        name: 'contactRelationship',
                      })}
                    </div>
                    <div className='col-md-4 col-12'>
                      {inputFile({
                        isRequired: false,
                        setFile,
                        register,
                        errors,
                        label: 'Picture',
                        name: 'picture',
                      })}
                    </div>
                    <div className='col-2 pt-4 mt-1'>
                      {imageDisplay && (
                        <Image
                          width='35'
                          height='35'
                          priority
                          className='img-fluid rounded-pill my-auto'
                          src={imageDisplay}
                          alt={imageDisplay}
                        />
                      )}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputTextArea({
                        register,
                        isRequired: false,
                        errors,
                        label: 'Comment',
                        name: 'comment',
                      })}
                    </div>
                    <div className='col'>
                      {inputCheckBox({
                        register,
                        errors,
                        label: 'isActive',
                        name: 'isActive',
                        isRequired: false,
                      })}
                    </div>
                  </div>

                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary '
                      data-bs-dismiss='modal'
                      onClick={formCleanHandler}
                    >
                      Close
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary '
                      disabled={isLoadingAdd || isLoadingUpdate}
                    >
                      {isLoadingAdd || isLoadingUpdate ? (
                        <span className='spinner-border spinner-border-sm' />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='d-flex justify-content-between align-items-center'>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editInstructorModal'
        >
          <FaPlus className='mb-1' />
        </button>
        <h3 className=''>Instructors</h3>
        <Pagination data={data} setPage={setPage} />
      </div>

      {isLoading ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div className='row g-3'>
            {data &&
              data.data.map((instructor) => (
                <div key={instructor._id} className='col-md-3 col-sm-6 col-12'>
                  <div className='card bg-transparent border-0 shadow-lg'>
                    <Link href={`/instructor/${instructor._id}`}>
                      <a className='mx-auto link-primary'>
                        <Image
                          width='260'
                          height='260'
                          priority
                          src={instructor.picture.picturePath}
                          alt={instructor.picture.pictureName}
                          className='card-img-top img-fluid'
                        />
                      </a>
                    </Link>
                    <div className='card-body'>
                      <Link href={`/instructor/${instructor._id}`}>
                        <a className='link-primary'>
                          <h6 className='card-title'>{instructor.fullName}</h6>
                          <h6 className='card-title'>
                            {' '}
                            <FaIdCard className='mb-1 text-primary' />{' '}
                            {instructor.instructorIdNo}
                          </h6>
                        </a>
                      </Link>
                      <div className='card-text'>
                        <address className='d-flex justify-content-between'>
                          <span>
                            <FaPhoneAlt className='mb-1 text-primary' />{' '}
                            {instructor.mobileNumber}
                          </span>
                          <span>
                            {instructor.isActive ? (
                              <FaCheckCircle className='text-success mb-1' />
                            ) : (
                              <FaTimesCircle className='text-danger mb-1' />
                            )}
                          </span>
                        </address>
                        <p className='btn-group d-flex'>
                          <button
                            className='btn btn-primary btn-sm'
                            onClick={() => editHandler(instructor)}
                            data-bs-toggle='modal'
                            data-bs-target='#editInstructorModal'
                          >
                            <FaEdit className='mb-1' /> Edit
                          </button>

                          <Link href={`/instructor/${instructor._id}`}>
                            <a className='btn btn-success btn-sm border-0 mx-1'>
                              <FaInfoCircle className='mb-1' /> Detail{' '}
                            </a>
                          </Link>

                          <button
                            className='btn btn-danger btn-sm'
                            onClick={() => deleteHandler(instructor._id)}
                            disabled={isLoadingDelete}
                          >
                            {isLoadingDelete ? (
                              <span className='spinner-border spinner-border-sm' />
                            ) : (
                              <span>
                                <FaTrash className='mb-1' /> Delete
                              </span>
                            )}
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Instructors)), {
  ssr: false,
})
