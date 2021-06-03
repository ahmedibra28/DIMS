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
  getCourseTypes,
  updateCourseType,
  deleteCourseType,
  addCourseType,
} from '../api/courseTypes'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'

const CourseTypeScreen = () => {
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
    'courseTypes',
    () => getCourseTypes(),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingUpdateCourseType,
    isError: isErrorUpdateCourseType,
    error: errorUpdateCourseType,
    isSuccess: isSuccessUpdateCourseType,
    mutateAsync: updateCourseTypeMutateAsync,
  } = useMutation(['updateCourseType'], updateCourseType, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['courseTypes'])
    },
  })

  const {
    isLoading: isLoadingDeleteCourseType,
    isError: isErrorDeleteCourseType,
    error: errorDeleteCourseType,
    isSuccess: isSuccessDeleteCourseType,
    mutateAsync: deleteCourseTypeMutateAsync,
  } = useMutation(['deleteCourseType'], deleteCourseType, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['courseTypes']),
  })

  const {
    isLoading: isLoadingAddCourseType,
    isError: isErrorAddCourseType,
    error: errorAddCourseType,
    isSuccess: isSuccessAddCourseType,
    mutateAsync: addCourseTypeMutateAsync,
  } = useMutation(['addCourseType'], addCourseType, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['courseTypes'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteCourseTypeMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateCourseTypeMutateAsync({
          _id: id,
          name: data.name,
          isActive: data.isActive,
        })
      : addCourseTypeMutateAsync(data)
  }

  const editHandler = (courseType) => {
    setId(courseType._id)
    setEdit(true)
    setValue('name', courseType.name)
    setValue('isActive', courseType.isActive)
  }

  return (
    <div className='container'>
      <div
        className='modal fade'
        id='editCourseTypeModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editCourseTypeModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editCourseTypeModalLabel'>
                {edit ? 'Edit CourseType' : 'Add CourseType'}
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
              {isSuccessUpdateCourseType && (
                <Message variant='success'>
                  CourseType has been updated successfully.
                </Message>
              )}
              {isErrorUpdateCourseType && (
                <Message variant='danger'>{errorUpdateCourseType}</Message>
              )}
              {isSuccessAddCourseType && (
                <Message variant='success'>
                  CourseType has been Created successfully.
                </Message>
              )}
              {isErrorAddCourseType && (
                <Message variant='danger'>{errorAddCourseType}</Message>
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
                    <label htmlFor='name'>Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type='text'
                      placeholder='Enter name'
                      className='form-control'
                      autoFocus
                    />
                    {errors.name && (
                      <span className='text-danger'>{errors.name.message}</span>
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
                      disabled={
                        isLoadingAddCourseType || isLoadingUpdateCourseType
                      }
                    >
                      {isLoadingAddCourseType || isLoadingUpdateCourseType ? (
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
        <h3 className=''>Course Types</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editCourseTypeModal'
        >
          <FaPlus className='mb-1' />
        </button>
      </div>

      {isSuccessDeleteCourseType && (
        <Message variant='success'>
          CourseType has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteCourseType && (
        <Message variant='danger'>{errorDeleteCourseType}</Message>
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
                  <th>ID</th>
                  <th>COURSE TYPE</th>
                  <th>ACTIVE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((courseType) => (
                    <tr key={courseType._id}>
                      <td>{courseType._id}</td>
                      <td>
                        {courseType.name.charAt(0).toUpperCase() +
                          courseType.name.slice(1)}
                      </td>
                      <td>
                        {courseType.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>
                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(courseType)}
                          data-bs-toggle='modal'
                          data-bs-target='#editCourseTypeModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(courseType._id)}
                          disabled={isLoadingDeleteCourseType}
                        >
                          {isLoadingDeleteCourseType ? (
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

export default CourseTypeScreen
