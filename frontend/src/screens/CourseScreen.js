import React, { useState } from 'react'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
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
} from '../api/courses'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'
import { getCourseTypes } from '../api/courseTypes'

const CourseScreen = () => {
  const {
    register,
    handleSubmit,
    watch,
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
  const { data: dataCourseType } = useQuery(
    'courseTypes',
    () => getCourseTypes(),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingUpdateCourse,
    isError: isErrorUpdateCourse,
    error: errorUpdateCourse,
    isSuccess: isSuccessUpdateCourse,
    mutateAsync: updateCourseMutateAsync,
  } = useMutation(['updateCourse'], updateCourse, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['courses'])
    },
  })

  const {
    isLoading: isLoadingDeleteCourse,
    isError: isErrorDeleteCourse,
    error: errorDeleteCourse,
    isSuccess: isSuccessDeleteCourse,
    mutateAsync: deleteCourseMutateAsync,
  } = useMutation(['deleteCourse'], deleteCourse, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['courses']),
  })

  const {
    isLoading: isLoadingAddCourse,
    isError: isErrorAddCourse,
    error: errorAddCourse,
    isSuccess: isSuccessAddCourse,
    mutateAsync: addCourseMutateAsync,
  } = useMutation(['addCourse'], addCourse, {
    retry: 0,
    onSuccess: () => {
      reset()
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
    confirmAlert(Confirm(() => deleteCourseMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateCourseMutateAsync({
          _id: id,
          name: data.name,
          isActive: data.isActive,
          courseType: data.courseType,
          duration: data.duration,
          enrolmentRequirement: data.enrolmentRequirement,
          certificationIssued: data.certificationIssued,
        })
      : addCourseMutateAsync(data)
  }

  const editHandler = (course) => {
    setId(course._id)
    setEdit(true)
    setValue('name', course.name)
    setValue('isActive', course.isActive)
    setValue('courseType', course.courseType && course.courseType._id)
    setValue('duration', course.duration)
    setValue('certificationIssued', course.certificationIssued)
    setValue('enrolmentRequirement', course.enrolmentRequirement)
  }

  return (
    <div className='container'>
      <div
        className='modal fade'
        id='editCourseModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editCourseModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
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
            <div className='modal-body'>
              {isSuccessUpdateCourse && (
                <Message variant='success'>
                  Course has been updated successfully.
                </Message>
              )}
              {isErrorUpdateCourse && (
                <Message variant='danger'>{errorUpdateCourse}</Message>
              )}
              {isSuccessAddCourse && (
                <Message variant='success'>
                  Course has been Created successfully.
                </Message>
              )}
              {isErrorAddCourse && (
                <Message variant='danger'>{errorAddCourse}</Message>
              )}

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
                  <div className='mb-3'>
                    <label htmlFor='courseType'>Course Type</label>
                    <select
                      {...register('courseType', {
                        required: 'Course Type is required',
                      })}
                      type='text'
                      placeholder='Enter name'
                      className='form-control'
                    >
                      <option value=''>-----------</option>
                      {dataCourseType &&
                        dataCourseType.map(
                          (courseType) =>
                            courseType.isActive && (
                              <option
                                key={courseType._id}
                                value={courseType._id}
                              >
                                {courseType.name}
                              </option>
                            )
                        )}
                    </select>
                    {errors.courseType && (
                      <span className='text-danger'>
                        {errors.courseType.message}
                      </span>
                    )}
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='name'>Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type='text'
                      placeholder='Enter name'
                      className='form-control'
                    />
                    {errors.name && (
                      <span className='text-danger'>{errors.name.message}</span>
                    )}
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='duration'>Duration</label>
                    <input
                      {...register('duration', {
                        required: 'Duration is required',
                      })}
                      type='number'
                      placeholder='Enter duration'
                      className='form-control'
                      step='.01'
                    />
                    {errors.duration && (
                      <span className='text-danger'>
                        {errors.duration.message}
                      </span>
                    )}
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='certificationIssued'>
                      Certification Issued
                    </label>
                    <input
                      {...register('certificationIssued', {
                        required: 'Certification issued is required',
                      })}
                      type='text'
                      placeholder='Enter certificationIssued'
                      className='form-control'
                    />
                    {errors.certificationIssued && (
                      <span className='text-danger'>
                        {errors.certificationIssued.message}
                      </span>
                    )}
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='enrolmentRequirement'>
                      Enrolment Requirement
                    </label>
                    <input
                      {...register('enrolmentRequirement', {
                        required: 'Enrolment Requirement is required',
                      })}
                      type='text'
                      placeholder='Enter enrolmentRequirement'
                      className='form-control'
                    />
                    {errors.enrolmentRequirement && (
                      <span className='text-danger'>
                        {errors.enrolmentRequirement.message}
                      </span>
                    )}
                  </div>

                  <div className='row'>
                    <div className='col'>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='isActive'
                          {...register('isActive')}
                          checked={watch().isActive}
                        />
                        <label className='form-check-label' htmlFor='isActive'>
                          is Active?
                        </label>
                      </div>
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
                      disabled={isLoadingAddCourse || isLoadingUpdateCourse}
                    >
                      {isLoadingAddCourse || isLoadingUpdateCourse ? (
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

      {isSuccessDeleteCourse && (
        <Message variant='success'>
          Course has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteCourse && (
        <Message variant='danger'>{errorDeleteCourse}</Message>
      )}
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
                  <th>DURATION</th>
                  <th>CERTIFICATION ISSUED</th>
                  <th>ENROLMENT REQUIREMENT</th>
                  <th>ACTIVE</th>
                  <th></th>
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
                      <td className='btn-group'>
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
                          disabled={isLoadingDeleteCourse}
                        >
                          {isLoadingDeleteCourse ? (
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

export default CourseScreen
