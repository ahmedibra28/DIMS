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
  getStudents,
  updateStudent,
  deleteStudent,
  addStudent,
} from '../../api/student'
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

const Students = () => {
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
    'students',
    () => getStudents(page),
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
  } = useMutation(updateStudent, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      setImageDisplay('')
      setFile('')
      queryClient.invalidateQueries(['students'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteStudent, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['students']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addStudent, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      setFile('')
      setImageDisplay('')
      queryClient.invalidateQueries(['students'])
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
    formData.append('mobileNumber', data.mobileNumber)
    formData.append('district', data.district)
    formData.append('levelOfEducation', data.levelOfEducation)
    formData.append('contactFullName', data.contactFullName)
    formData.append('contactMobileNumber', data.contactMobileNumber)
    formData.append('contactEmail', data.contactEmail)
    formData.append('contactRelationship', data.contactRelationship)
    formData.append('arabic', data.arabic)
    formData.append('somali', data.somali)
    formData.append('english', data.english)
    formData.append('kiswahili', data.kiswahili)
    formData.append('comment', data.comment)

    edit
      ? updateMutateAsync({
          _id: id,
          formData,
        })
      : addMutateAsync(formData)
  }

  const editHandler = (student) => {
    setId(student._id)
    setEdit(true)
    setValue('isActive', student.isActive)
    setValue('fullName', student.fullName)
    setValue('placeOfBirth', student.placeOfBirth)
    setValue('dateOfBirth', moment(student.dateOfBirth).format('YYYY-MM-DD'))
    setValue('nationality', student.nationality)
    setValue('gender', student.gender)
    setValue('district', student.district)
    setValue('mobileNumber', student.mobileNumber)
    setValue('levelOfEducation', student.levelOfEducation)
    setValue('contactFullName', student.contactFullName)
    setValue('contactMobileNumber', student.contactMobileNumber)
    setValue('contactEmail', student.contactEmail)
    setValue('contactRelationship', student.contactRelationship)
    setValue('somali', student.languageSkills.somali)
    setValue('english', student.languageSkills.english)
    setValue('kiswahili', student.languageSkills.kiswahili)
    setValue('arabic', student.languageSkills.arabic)
    setValue('comment', student.comment)
    setImageDisplay(student.picture && student.picture.picturePath)
  }

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('students')
    }
    refetch()
  }, [page, queryClient])

  return (
    <div className='container'>
      <Head>
        <title>Students</title>
        <meta property='og:title' content='Students' key='title' />
      </Head>
      {isSuccessDelete && (
        <Message variant='success'>
          Student has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {isSuccessUpdate && (
        <Message variant='success'>
          Student has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Student has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}

      <div
        className='modal fade'
        id='editStudentModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editStudentModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editStudentModalLabel'>
                {edit ? 'Edit Student' : 'Add Student'}
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
                    <div className='col-md-6 col-12'>
                      {inputDate({
                        register,
                        errors,
                        label: 'Date Of Birth',
                        name: 'dateOfBirth',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        errors,
                        label: 'Nationality',
                        name: 'nationality',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {staticInputSelect({
                        register,
                        errors,
                        data: [{ name: 'Male' }, { name: 'Female' }],
                        label: 'Gender',
                        name: 'gender',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {staticInputSelect({
                        register,
                        errors,
                        data: [
                          { name: 'Primary' },
                          { name: 'Secondary' },
                          { name: 'Mid level colleges' },
                        ],
                        name: 'levelOfEducation',
                        label: 'Level Of Education',
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
                    <h4 className='text-center'>Language Skills</h4> <hr />
                    <div className='col-md-3 col-12'>
                      {staticInputSelect({
                        register,
                        errors,
                        data: [
                          { name: 'Fluent' },
                          { name: 'Good' },
                          { name: 'Fair' },
                        ],
                        name: 'somali',
                        label: 'Somali',
                      })}
                    </div>
                    <div className='col-md-3 col-12'>
                      {staticInputSelect({
                        register,
                        errors,
                        data: [
                          { name: 'Fluent' },
                          { name: 'Good' },
                          { name: 'Fair' },
                        ],
                        name: 'arabic',
                        label: 'Arabic',
                      })}
                    </div>
                    <div className='col-md-3 col-12'>
                      {staticInputSelect({
                        register,
                        errors,
                        data: [
                          { name: 'Fluent' },
                          { name: 'Good' },
                          { name: 'Fair' },
                        ],
                        name: 'english',
                        label: 'English',
                      })}
                    </div>
                    <div className='col-md-3 col-12'>
                      {staticInputSelect({
                        register,
                        errors,
                        data: [
                          { name: 'Fluent' },
                          { name: 'Good' },
                          { name: 'Fair' },
                        ],
                        name: 'kiswahili',
                        label: 'Kiswahili',
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
          data-bs-target='#editStudentModal'
        >
          <FaPlus className='mb-1' />
        </button>
        <h3 className=''>Students</h3>
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
              data.data.map((student) => (
                <div key={student._id} className='col-md-3 col-sm-6 col-12'>
                  <div className='card bg-transparent border-0 shadow-lg'>
                    <Link href={`/student/${student._id}`}>
                      <a className='mx-auto link-primary'>
                        <Image
                          width='260'
                          height='260'
                          priority
                          src={student.picture.picturePath}
                          alt={student.picture.pictureName}
                          className='card-img-top img-fluid'
                        />
                      </a>
                    </Link>
                    <div className='card-body'>
                      <Link href={`/student/${student._id}`}>
                        <a className='link-primary'>
                          <h6 className='card-title'>{student.fullName}</h6>
                          <h6 className='card-title'>
                            {' '}
                            <FaIdCard className='mb-1 text-primary' />{' '}
                            {student.rollNo}
                          </h6>
                        </a>
                      </Link>
                      <div className='card-text'>
                        <address className='d-flex justify-content-between'>
                          <span>
                            <FaPhoneAlt className='mb-1 text-primary' />{' '}
                            {student.mobileNumber}
                          </span>
                          <span>
                            {student.isActive ? (
                              <FaCheckCircle className='text-success mb-1' />
                            ) : (
                              <FaTimesCircle className='text-danger mb-1' />
                            )}
                          </span>
                        </address>
                        <p className='btn-group d-flex'>
                          <button
                            className='btn btn-primary btn-sm'
                            onClick={() => editHandler(student)}
                            data-bs-toggle='modal'
                            data-bs-target='#editStudentModal'
                          >
                            <FaEdit className='mb-1' /> Edit
                          </button>

                          <Link href={`/student/${student._id}`}>
                            <a className='btn btn-success btn-sm border-0 mx-1'>
                              <FaInfoCircle className='mb-1' /> Detail{' '}
                            </a>
                          </Link>

                          <button
                            className='btn btn-danger btn-sm'
                            onClick={() => deleteHandler(student._id)}
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

export default dynamic(() => Promise.resolve(withAuth(Students)), {
  ssr: false,
})
