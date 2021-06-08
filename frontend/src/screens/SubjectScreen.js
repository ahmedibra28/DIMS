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
  getSubjects,
  updateSubject,
  deleteSubject,
  addSubject,
} from '../api/subjects'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'
import { getCourses } from '../api/courses'

const SubjectScreen = () => {
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
    'subjects',
    () => getSubjects(),
    {
      retry: 0,
    }
  )
  const { data: dataCourse } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const {
    isLoading: isLoadingUpdateSubject,
    isError: isErrorUpdateSubject,
    error: errorUpdateSubject,
    isSuccess: isSuccessUpdateSubject,
    mutateAsync: updateSubjectMutateAsync,
  } = useMutation(['updateSubject'], updateSubject, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['subjects'])
    },
  })

  const {
    isLoading: isLoadingDeleteSubject,
    isError: isErrorDeleteSubject,
    error: errorDeleteSubject,
    isSuccess: isSuccessDeleteSubject,
    mutateAsync: deleteSubjectMutateAsync,
  } = useMutation(['deleteSubject'], deleteSubject, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['subjects']),
  })

  const {
    isLoading: isLoadingAddSubject,
    isError: isErrorAddSubject,
    error: errorAddSubject,
    isSuccess: isSuccessAddSubject,
    mutateAsync: addSubjectMutateAsync,
  } = useMutation(['addSubject'], addSubject, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['subjects'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteSubjectMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateSubjectMutateAsync({
          _id: id,
          name: data.name,
          isActive: data.isActive,
          course: data.course,
          theoryMarks: data.theoryMarks,
          practicalMarks: data.practicalMarks,
        })
      : addSubjectMutateAsync(data)
  }

  const editHandler = (subject) => {
    setId(subject._id)
    setEdit(true)
    setValue('name', subject.name)
    setValue('isActive', subject.isActive)
    setValue('course', subject.course && subject.course._id)
    setValue('theoryMarks', subject.theoryMarks)
    setValue('practicalMarks', subject.practicalMarks)
  }

  return (
    <div className='container'>
      {isSuccessUpdateSubject && (
        <Message variant='success'>
          Subject has been updated successfully.
        </Message>
      )}
      {isErrorUpdateSubject && (
        <Message variant='danger'>{errorUpdateSubject}</Message>
      )}
      {isSuccessAddSubject && (
        <Message variant='success'>
          Subject has been Created successfully.
        </Message>
      )}
      {isErrorAddSubject && (
        <Message variant='danger'>{errorAddSubject}</Message>
      )}
      <div
        className='modal fade'
        id='editSubjectModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editSubjectModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editSubjectModalLabel'>
                {edit ? 'Edit Subject' : 'Add Subject'}
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
                  <div className='mb-3'>
                    <label htmlFor='course'>Course</label>
                    <select
                      {...register('course', {
                        required: 'Course is required',
                      })}
                      type='text'
                      placeholder='Enter name'
                      className='form-control'
                    >
                      <option value=''>-----------</option>
                      {dataCourse &&
                        dataCourse.map(
                          (course) =>
                            course.isActive && (
                              <option key={course._id} value={course._id}>
                                {course.name}
                              </option>
                            )
                        )}
                    </select>
                    {errors.course && (
                      <span className='text-danger'>
                        {errors.course.message}
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
                    <label htmlFor='theoryMarks'>Theory Marks</label>
                    <input
                      {...register('theoryMarks', {
                        required: 'Theory Marks is required',
                      })}
                      type='number'
                      placeholder='Enter theoryMarks'
                      className='form-control'
                      step='.01'
                    />
                    {errors.theoryMarks && (
                      <span className='text-danger'>
                        {errors.theoryMarks.message}
                      </span>
                    )}
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='practicalMarks'>Practical Marks</label>
                    <input
                      {...register('practicalMarks', {
                        required: 'Practical Marks is required',

                        validate: (value) =>
                          value + watch().theoryMarks > 100 ||
                          'Maximum marks must be 100',
                      })}
                      type='text'
                      placeholder='Enter practicalMarks'
                      className='form-control'
                    />
                    {errors.practicalMarks && (
                      <span className='text-danger'>
                        {errors.practicalMarks.message}
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
                      disabled={isLoadingAddSubject || isLoadingUpdateSubject}
                    >
                      {isLoadingAddSubject || isLoadingUpdateSubject ? (
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
        <h3 className=''>Subjects</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editSubjectModal'
        >
          <FaPlus className='mb-1' />
        </button>
      </div>

      {isSuccessDeleteSubject && (
        <Message variant='success'>
          Subject has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteSubject && (
        <Message variant='danger'>{errorDeleteSubject}</Message>
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
                  <th>COURSE</th>
                  <th>SUBJECT</th>
                  <th>THEORY MARKS</th>
                  <th>PRACTICAL MARKS</th>
                  <th>ACTIVE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((subject) => (
                    <tr key={subject._id}>
                      <td>
                        {subject.course &&
                          subject.course.name.charAt(0).toUpperCase() +
                            subject.course.name.slice(1)}
                      </td>
                      <td>
                        {subject.name.charAt(0).toUpperCase() +
                          subject.name.slice(1)}
                      </td>
                      <td>{subject.theoryMarks}</td>

                      <td>{subject.practicalMarks}</td>
                      <td>
                        {subject.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>
                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(subject)}
                          data-bs-toggle='modal'
                          data-bs-target='#editSubjectModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(subject._id)}
                          disabled={isLoadingDeleteSubject}
                        >
                          {isLoadingDeleteSubject ? (
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

export default SubjectScreen
