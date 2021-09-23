import React, { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import moment from 'moment'
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'

import {
  getCourses,
  updateCourse,
  deleteCourse,
  addCourse,
} from '../../api/course'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'
import { getCourseTypes } from '../../api/courseType'
import {
  dynamicInputSelect,
  inputCheckBox,
  inputNumber,
  inputText,
} from '../../utils/dynamicForm'

const Course = () => {
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

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'courses',
    () => getCourses(),
    {
      retry: 0,
    }
  )

  const { data: courseTypeData } = useQuery(
    'courseTypes',
    () => getCourseTypes(),
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
  } = useMutation(updateCourse, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['courses'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteCourse, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['courses']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addCourse, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['courses'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateMutateAsync({
          _id: id,
          name: data.name,
          courseType: data.courseType,
          isActive: data.isActive,
        })
      : addMutateAsync(data)
  }

  const editHandler = (course) => {
    setId(course._id)
    setEdit(true)
    setValue('name', course.name)
    setValue('isActive', course.isActive)
    setValue('courseType', course.courseType && course.courseType._id)
    setValue('duration', course.duration)
    setValue('exam', course.exam)
    setValue('certificationIssued', course.certificationIssued)
    setValue('enrolmentRequirement', course.enrolmentRequirement)
    setValue('price', course.price)
  }

  return (
    <div className='container'>
      <Head>
        <title>Course</title>
        <meta property='og:title' content='Course' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>
          Course has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Course has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Course has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      <div
        className='modal fade'
        id='editCourseModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editCourseModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editCourseModalLabel'>
                {edit ? 'Edit Course' : 'Add Course'}
              </h3>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanHandler}
              ></button>
            </div>
            <div className='modal-body '>
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
                    <div className='col-12'>
                      {inputText({
                        register,
                        label: 'Name',
                        errors,
                        name: 'name',
                      })}
                    </div>
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
                      {inputNumber({
                        register,
                        label: 'Price',
                        errors,
                        name: 'price',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputNumber({
                        register,
                        label: 'Duration',
                        errors,
                        name: 'duration',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        label: 'Exam',
                        errors,
                        name: 'exam',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        label: 'Certification Issued',
                        errors,
                        name: 'certificationIssued',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        label: 'Enrolment Requirement',
                        errors,
                        name: 'enrolmentRequirement',
                      })}
                    </div>
                  </div>

                  <div className='row'>
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
        <h3 className=''>Courses</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editCourseModal'
        >
          <FaPlus className='mb-1' />
        </button>
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
          <div className='table-responsive '>
            <table className='table table-sm hover bordered striped caption-top '>
              <caption>{data && data.length} records were found</caption>
              <thead>
                <tr>
                  <th>COURSE TYPE</th>
                  <th>NAME</th>
                  <th>FEE</th>
                  <th># SEMESTER</th>
                  <th>C. ISSUED</th>
                  <th>E. REQUIREMENT</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((course) => (
                    <tr key={course._id}>
                      <td>
                        {course.courseType &&
                          course.courseType.name.charAt(0).toUpperCase() +
                            course.courseType.name.slice(1)}
                      </td>
                      <td>
                        {course.name.charAt(0).toUpperCase() +
                          course.name.slice(1)}
                      </td>
                      <td>${course.price}.00</td>
                      <td>{course.duration}</td>
                      <td>{course.certificationIssued}</td>
                      <td>{course.enrolmentRequirement}</td>
                      <td>
                        {course.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-course'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(course)}
                          data-bs-toggle='modal'
                          data-bs-target='#editCourseModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(course._id)}
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
        </>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Course)), { ssr: false })
