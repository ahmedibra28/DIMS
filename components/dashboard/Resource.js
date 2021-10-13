import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
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
import {
  getResources,
  updateResource,
  deleteResource,
  addResource,
} from '../../api/resource'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getCourseTypes } from '../../api/courseType'
import { getCourses } from '../../api/course'
import { getSubjects } from '../../api/subject'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../Confirm'
import { useForm } from 'react-hook-form'
import {
  dynamicInputSelect,
  dynamicInputSelectNumber,
  inputCheckBox,
  inputFile,
  inputTextArea,
  staticInputSelect,
} from '../../utils/dynamicForm'
import moment from 'moment'

const Resource = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
    'resources',
    () => getResources(),
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
  } = useMutation(updateResource, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      setImageDisplay('')
      setFile('')
      queryClient.invalidateQueries(['resources'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteResource, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['resources']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addResource, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      setFile('')
      setImageDisplay('')
      queryClient.invalidateQueries(['resources'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [imageDisplay, setImageDisplay] = useState('')

  const { data: courseTypeData } = useQuery(
    'courseTypes',
    () => getCourseTypes(),
    {
      retry: 0,
    }
  )

  const { data: courseData } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const { data: subjectData } = useQuery('subjects', () => getSubjects(), {
    retry: 0,
  })

  const durationValue = () => {
    const d = courseData && courseData.filter((c) => c._id === watch().course)
    return d && d[0] && d[0].duration
  }

  const courseSemesterSubject = () => {
    return (
      subjectData &&
      subjectData.filter(
        (sub) =>
          sub.course._id === watch().course &&
          sub.semester === Number(watch().semester)
      )
    )
  }

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
    formData.append('file', data.file[0])
    formData.append('isActive', data.isActive)
    formData.append('courseType', data.courseType)
    formData.append('course', data.course)
    formData.append('semester', data.semester)
    formData.append('subject', data.subject)
    formData.append('description', data.description)
    formData.append('shift', data.shift)

    edit
      ? updateMutateAsync({
          _id: id,
          formData,
        })
      : addMutateAsync(formData)
  }

  const editHandler = (resource) => {
    setId(resource._id)
    setEdit(true)
    setValue('isActive', resource.isActive)
    setValue('courseType', resource.courseType._id)
    setValue('course', resource.course._id)
    setValue('semester', resource.semester)
    setValue('subject', resource.subject._id)
    setValue('shift', resource.shift)
    setValue('description', resource.description)

    setImageDisplay(resource.file && resource.file.filePath)
  }

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('resources')
    }
    refetch()
  }, [queryClient])

  return (
    <div className='container'>
      <Head>
        <title>Resources</title>
        <meta property='og:title' content='Resources' key='title' />
      </Head>
      {isSuccessDelete && (
        <Message variant='success'>
          Resource has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {isSuccessUpdate && (
        <Message variant='success'>
          Resource has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Resource has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}

      <div
        className='modal fade'
        id='editResourceModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editResourceModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editResourceModalLabel'>
                {edit ? 'Edit Resource' : 'Add Resource'}
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
                    <div className='col-md-6 col-12'>
                      {dynamicInputSelect({
                        register,
                        errors,
                        data: courseTypeData && courseTypeData,
                        name: 'courseType',
                        label: 'Course Type',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {watch().courseType &&
                        dynamicInputSelect({
                          register,
                          errors,
                          data:
                            courseData &&
                            courseData.filter(
                              (c) => c.courseType._id === watch().courseType
                            ),
                          name: 'course',
                          label: 'Course',
                        })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {watch().course &&
                        dynamicInputSelectNumber({
                          register,
                          errors,
                          data: durationValue(),
                          name: 'semester',
                          label: 'Semester',
                        })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {watch().semester &&
                        dynamicInputSelect({
                          register,
                          errors,
                          data: courseSemesterSubject(),
                          name: 'subject',
                          label: 'Subject',
                        })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {staticInputSelect({
                        register,
                        errors,
                        data: [{ name: 'Morning' }, { name: 'Afternoon' }],
                        name: 'shift',
                        label: 'Shift',
                      })}
                    </div>

                    <div className='col-md-6 col-12'>
                      {inputFile({
                        isRequired: false,
                        setFile,
                        register,
                        errors,
                        label: 'File',
                        name: 'file',
                      })}
                    </div>

                    <div className='col-12'>
                      {inputTextArea({
                        register,
                        errors,
                        name: 'description',
                        label: 'Description',
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
          data-bs-target='#editResourceModal'
        >
          <FaPlus className='mb-1' />
        </button>
        <h3 className=''>Resources</h3>
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
            {data && data.length > 0 && (
              <div className='table-responsive '>
                <table className='table table-striped table-hover table-sm caption-top '>
                  <caption>{data && data.length} records were found</caption>
                  <thead>
                    <tr>
                      <th>COURSE</th>
                      <th>SEMESTER</th>
                      <th>SUBJECT</th>
                      <th>SHIFT</th>
                      <th>ACTIVE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.length > 0 &&
                      data.map((resource) => (
                        <tr key={resource._id}>
                          <td>{resource.course.name}</td>
                          <td>Semester {resource.semester}</td>
                          <td>{resource.subject.name}</td>
                          <td>{resource.shift}</td>
                          <td>
                            {resource.isActive ? (
                              <FaCheckCircle className='text-success mb-1' />
                            ) : (
                              <FaTimesCircle className='text-danger mb-1' />
                            )}
                          </td>

                          <td className='btn-group'>
                            <button
                              className='btn btn-primary btn-sm'
                              onClick={() => editHandler(resource)}
                              data-bs-toggle='modal'
                              data-bs-target='#editResourceModal'
                            >
                              <FaEdit className='mb-1' /> Edit
                            </button>

                            <button
                              className='btn btn-danger btn-sm'
                              onClick={() => deleteHandler(resource._id)}
                              disabled={isLoadingDelete}
                            >
                              {isLoadingDelete ? (
                                <span className='spinner-border spinner-border-sm' />
                              ) : (
                                <span>
                                  {' '}
                                  <FaTrash className='mb-1' /> Delete
                                </span>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Resource
