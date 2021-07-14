import React, { useState, useEffect } from 'react'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'
import Pagination from '../components/Pagination'
import {
  getUsers,
  updateUser,
  deleteUser,
  createUser,
  getStudentsAndInstructors,
} from '../api/users'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { UnlockAccess } from '../components/UnlockAccess'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'

const UserListScreen = () => {
  const [page, setPage] = useState(1)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      admin: false,
      student: false,
      instructor: false,
    },
  })

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'users',
    () => getUsers(page),
    {
      retry: 0,
    }
  )

  const { data: dataSI } = useQuery(
    'students-and-instructors',
    () => getStudentsAndInstructors(),
    {
      retry: 0,
    }
  )

  console.log(dataSI && dataSI)

  const students = dataSI && dataSI.students
  const instructors = dataSI && dataSI.instructors

  const {
    isLoading: isLoadingUpdateUser,
    isError: isErrorUpdateUser,
    error: errorUpdateUser,
    isSuccess: isSuccessUpdateUser,
    mutateAsync: updateUserMutateAsync,
  } = useMutation(['updateUser'], updateUser, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['users'])
    },
  })

  const {
    isLoading: isLoadingDeleteUser,
    isError: isErrorDeleteUser,
    error: errorDeleteUser,
    isSuccess: isSuccessDeleteUser,
    mutateAsync: deleteUserMutateAsync,
  } = useMutation(['deleteUser'], deleteUser, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['users']),
  })

  const {
    isLoading: isLoadingCreateUser,
    isError: isErrorCreateUser,
    error: errorCreateUser,
    isSuccess: isSuccessCreateUser,
    mutateAsync: createUserMutateAsync,
  } = useMutation(['createUser'], createUser, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['users'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteUserMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateUserMutateAsync({
          _id: id,
          name: data.name,
          email: data.email,
          password: data.password,
          admin: data.admin,
          instructor: data.instructor,
          student: data.student,
        })
      : createUserMutateAsync(data)
  }

  const editHandler = (user) => {
    setId(user._id)
    setEdit(true)
    setValue('name', user.name)
    setValue('email', user.email)

    user &&
      user.roles.map(
        (role) =>
          (role === 'Admin' && setValue('admin', true)) ||
          (role === 'Student' && setValue('student', true)) ||
          (role === 'Instructor' && setValue('instructor', true))
      )
  }

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('users')
    }
    refetch()
  }, [page, queryClient])

  return (
    <div className='container'>
      <Pagination data={data} setPage={setPage} />
      {isSuccessUpdateUser && (
        <Message variant='success'>User has been updated successfully.</Message>
      )}
      {isErrorUpdateUser && (
        <Message variant='danger'>{errorUpdateUser}</Message>
      )}
      {isSuccessCreateUser && (
        <Message variant='success'>User has been Created successfully.</Message>
      )}
      {isErrorCreateUser && (
        <Message variant='danger'>{errorCreateUser}</Message>
      )}
      {isSuccessDeleteUser && (
        <Message variant='success'>User has been deleted successfully.</Message>
      )}
      {isErrorDeleteUser && (
        <Message variant='danger'>{errorDeleteUser}</Message>
      )}
      <div
        className='modal fade'
        id='editUserModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editUserModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editUserModalLabel'>
                {edit ? 'Edit User' : 'Add User'}
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
                  <div className='mb-3'>
                    <label htmlFor='email'>Email Address</label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /\S+@\S+\.+\S+/,
                          message: 'Entered value does not match email format',
                        },
                      })}
                      type='email'
                      placeholder='Enter email'
                      className='form-control'
                    />
                    {errors.email && (
                      <span className='text-danger'>
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='password'>Password</label>
                    <input
                      {...register('password', {
                        minLength: {
                          value: 6,
                          message: 'Password must have at least 6 characters',
                        },
                      })}
                      type='password'
                      placeholder='Enter password'
                      className='form-control'
                    />
                    {errors.password && (
                      <span className='text-danger'>
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input
                      {...register('confirmPassword', {
                        minLength: {
                          value: 6,
                          message: 'Password must have at least 6 characters',
                        },
                        validate: (value) =>
                          value === watch().password ||
                          'The passwords do not match',
                      })}
                      type='password'
                      placeholder='Confirm password'
                      className='form-control'
                    />
                    {errors.confirmPassword && (
                      <span className='text-danger'>
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </div>

                  <div className='row'>
                    <div className='col'>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='admin'
                          {...register('admin')}
                          checked={watch().admin}
                        />
                        <label className='form-check-label' htmlFor='admin'>
                          Admin
                        </label>
                      </div>
                    </div>
                    <div className='col'>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='instructor'
                          {...register('instructor')}
                          checked={watch().instructor}
                        />
                        <label
                          className='form-check-label'
                          htmlFor='instructor'
                        >
                          Instructor
                        </label>
                      </div>
                    </div>
                    <div className='col'>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='student'
                          {...register('student')}
                          checked={watch().student}
                        />
                        <label className='form-check-label' htmlFor='student'>
                          Student
                        </label>
                      </div>
                    </div>
                  </div>
                  {watch().student && (
                    <div className='my-3'>
                      <label htmlFor='studentDataList' className='form-label'>
                        Student
                      </label>
                      <input
                        className='form-control'
                        list='studentDatalistOptions'
                        id='studentDataList'
                        placeholder='Type to search...'
                      />
                      <datalist id='studentDatalistOptions'>
                        {students &&
                          students.map((student) => (
                            <option key={student._id} value={student._id}>
                              {student.rollNo} - {student.fullName}
                            </option>
                          ))}
                      </datalist>
                    </div>
                  )}
                  {watch().instructor && (
                    <div className='my-3'>
                      <label htmlFor='studentDataList' className='form-label'>
                        Instructors
                      </label>
                      <input
                        className='form-control'
                        list='instructorDatalistOptions'
                        id='studentDataList'
                        placeholder='Type to search...'
                      />
                      <datalist id='instructorDatalistOptions'>
                        {instructors &&
                          instructors.map((instructor) => (
                            <option key={instructor._id} value={instructor._id}>
                              {instructor.instructorIdNo} -{' '}
                              {instructor.fullName}
                            </option>
                          ))}
                      </datalist>
                    </div>
                  )}

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
                      disabled={isLoadingCreateUser || isLoadingUpdateUser}
                    >
                      {isLoadingCreateUser || isLoadingUpdateUser ? (
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
        <h3 className=''>Users</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editUserModal'
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
              <caption>{data && data.total} records were found</caption>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ADMIN</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.data.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </td>
                      <td>
                        {UnlockAccess(user && user.roles) ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>
                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(user)}
                          data-bs-toggle='modal'
                          data-bs-target='#editUserModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(user._id)}
                          disabled={isLoadingDeleteUser}
                        >
                          {isLoadingDeleteUser ? (
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

export default UserListScreen
