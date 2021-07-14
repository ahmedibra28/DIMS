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
  getNotices,
  updateNotice,
  deleteNotice,
  addNotice,
} from '../api/notices'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import moment from 'moment'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'

const NoticeScreen = () => {
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
    'notices',
    () => getNotices(),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingUpdateNotice,
    isError: isErrorUpdateNotice,
    error: errorUpdateNotice,
    isSuccess: isSuccessUpdateNotice,
    mutateAsync: updateNoticeMutateAsync,
  } = useMutation(['updateNotice'], updateNotice, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['notices'])
    },
  })

  const {
    isLoading: isLoadingDeleteNotice,
    isError: isErrorDeleteNotice,
    error: errorDeleteNotice,
    isSuccess: isSuccessDeleteNotice,
    mutateAsync: deleteNoticeMutateAsync,
  } = useMutation(['deleteNotice'], deleteNotice, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['notices']),
  })

  const {
    isLoading: isLoadingAddNotice,
    isError: isErrorAddNotice,
    error: errorAddNotice,
    isSuccess: isSuccessAddNotice,
    mutateAsync: addNoticeMutateAsync,
  } = useMutation(['addNotice'], addNotice, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['notices'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteNoticeMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateNoticeMutateAsync({
          _id: id,
          title: data.title,
          description: data.description,
          isActive: data.isActive,
        })
      : addNoticeMutateAsync(data)
  }

  const editHandler = (notice) => {
    setId(notice._id)
    setEdit(true)
    setValue('title', notice.title)
    setValue('description', notice.description)
    setValue('isActive', notice.isActive)
  }

  return (
    <div className='container'>
      {isSuccessUpdateNotice && (
        <Message variant='success'>
          Notice has been updated successfully.
        </Message>
      )}
      {isErrorUpdateNotice && (
        <Message variant='danger'>{errorUpdateNotice}</Message>
      )}
      {isSuccessAddNotice && (
        <Message variant='success'>
          Notice has been Created successfully.
        </Message>
      )}
      {isErrorAddNotice && <Message variant='danger'>{errorAddNotice}</Message>}
      <div
        className='modal fade'
        id='editNoticeModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editNoticeModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editNoticeModalLabel'>
                {edit ? 'Edit Notice' : 'Add Notice'}
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
                    <label htmlFor='title'>Title</label>
                    <input
                      {...register('title', { required: 'Title is required' })}
                      type='text'
                      placeholder='Enter title'
                      className='form-control'
                      autoFocus
                    />
                    {errors.title && (
                      <span className='text-danger'>
                        {errors.title.message}
                      </span>
                    )}
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='description'>Description</label>
                    <textarea
                      rows='5'
                      cols='30'
                      {...register('description', {
                        required: 'Description is required',
                      })}
                      type='text'
                      placeholder='Enter description'
                      className='form-control'
                      autoFocus
                    />
                    {errors.description && (
                      <span className='text-danger'>
                        {errors.description.message}
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
                      disabled={isLoadingAddNotice || isLoadingUpdateNotice}
                    >
                      {isLoadingAddNotice || isLoadingUpdateNotice ? (
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
        <h3 className=''>Notifications</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editNoticeModal'
        >
          <FaPlus className='mb-1' />
        </button>
      </div>
      {isSuccessDeleteNotice && (
        <Message variant='success'>
          Notice has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteNotice && (
        <Message variant='danger'>{errorDeleteNotice}</Message>
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
          {data &&
            data.map((notice) => (
              <div
                key={notice._id}
                className='card bg-transparent border-0 shadow'
              >
                <div className='card-body'>
                  <h5 className='card-title'>
                    {notice.title}{' '}
                    <span className='fw-light fs-6'>
                      {notice.isActive ? (
                        <FaCheckCircle className='text-success mb-1' />
                      ) : (
                        <FaTimesCircle className='text-danger mb-1' />
                      )}
                    </span>
                  </h5>
                  <p className='card-text'>{notice.description}</p>
                  <p className='card-text'>
                    <small className='text-muted'>
                      {moment(notice.createdAt).fromNow()}
                    </small>
                    <span className='btn-group float-end'>
                      <button
                        className='btn btn-primary btn-sm me-1'
                        onClick={() => editHandler(notice)}
                        data-bs-toggle='modal'
                        data-bs-target='#editNoticeModal'
                      >
                        <FaEdit className='mb-1' /> Edit
                      </button>

                      <button
                        className='btn btn-danger btn-sm'
                        onClick={() => deleteHandler(notice._id)}
                        disabled={isLoadingDeleteNotice}
                      >
                        {isLoadingDeleteNotice ? (
                          <span className='spinner-border spinner-border-sm' />
                        ) : (
                          <span>
                            <FaTrash className='mb-1' /> Delete
                          </span>
                        )}
                      </button>
                    </span>
                  </p>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  )
}

export default NoticeScreen
