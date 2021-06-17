import React, { useState, useEffect } from 'react'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { Link } from 'react-router-dom'
import {
  FaCheckCircle,
  FaEdit,
  FaInfoCircle,
  FaPhoneAlt,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'
import moment from 'moment'

import {
  getInstructors,
  updateInstructor,
  deleteInstructor,
  addInstructor,
} from '../api/instructors'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'
import Pagination from '../components/Pagination'

const InstructorScreen = () => {
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
      isActive: true,
    },
  })

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'instructors',
    () => getInstructors(page),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingUpdateInstructor,
    isError: isErrorUpdateInstructor,
    error: errorUpdateInstructor,
    isSuccess: isSuccessUpdateInstructor,
    mutateAsync: updateInstructorMutateAsync,
  } = useMutation(['updateInstructor'], updateInstructor, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['instructors'])
    },
  })

  const {
    isLoading: isLoadingDeleteInstructor,
    isError: isErrorDeleteInstructor,
    error: errorDeleteInstructor,
    isSuccess: isSuccessDeleteInstructor,
    mutateAsync: deleteInstructorMutateAsync,
  } = useMutation(['deleteInstructor'], deleteInstructor, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['instructors']),
  })

  const {
    isLoading: isLoadingAddInstructor,
    isError: isErrorAddInstructor,
    error: errorAddInstructor,
    isSuccess: isSuccessAddInstructor,
    mutateAsync: addInstructorMutateAsync,
  } = useMutation(['addInstructor'], addInstructor, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['instructors'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteInstructorMutateAsync(id)))
  }

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
      ? updateInstructorMutateAsync({
          _id: id,
          formData,
        })
      : addInstructorMutateAsync(formData)
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
  }

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('instructors')
    }
    refetch()
  }, [page, queryClient])

  return (
    <div className='container'>
      <Pagination data={data} setPage={setPage} />
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
              {isSuccessUpdateInstructor && (
                <Message variant='success'>
                  Instructor has been updated successfully.
                </Message>
              )}
              {isErrorUpdateInstructor && (
                <Message variant='danger'>{errorUpdateInstructor}</Message>
              )}
              {isSuccessAddInstructor && (
                <Message variant='success'>
                  Instructor has been Created successfully.
                </Message>
              )}
              {isErrorAddInstructor && (
                <Message variant='danger'>{errorAddInstructor}</Message>
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
                  <div className='row'>
                    <h4 className='text-center'>Personal Information</h4> <hr />
                    <div className='col-md-6 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='fullName'>Full name</label>
                        <input
                          {...register('fullName', {
                            required: 'Full name is required',
                          })}
                          type='text'
                          placeholder='Enter full name'
                          className='form-control'
                        />
                        {errors.fullName && (
                          <span className='text-danger'>
                            {errors.fullName.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-6 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='placeOfBirth'>Place of birth</label>
                        <input
                          {...register('placeOfBirth', {
                            required: 'Place of birth is required',
                          })}
                          type='text'
                          placeholder='Enter place of birth'
                          className='form-control'
                        />
                        {errors.placeOfBirth && (
                          <span className='text-danger'>
                            {errors.placeOfBirth.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-4 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='dateOfBirth'>Date of birth</label>
                        <input
                          {...register('dateOfBirth', {
                            required: 'Date of birth is required',
                          })}
                          type='date'
                          placeholder='Enter date of birth'
                          className='form-control'
                        />
                        {errors.dateOfBirth && (
                          <span className='text-danger'>
                            {errors.dateOfBirth.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-4 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='nationality'>Nationality</label>
                        <input
                          {...register('nationality', {
                            required: 'Nationality is required',
                          })}
                          type='text'
                          placeholder='Enter nationality'
                          className='form-control'
                        />
                        {errors.nationality && (
                          <span className='text-danger'>
                            {errors.nationality.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-4 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='gender'>Gender</label>
                        <select
                          {...register('gender', {
                            required: 'Gender is required',
                          })}
                          type='text'
                          placeholder='Enter gender'
                          className='form-control'
                        >
                          <option value=''>----------</option>
                          <option value='Male'>Male</option>
                          <option value='Female'>Female</option>
                        </select>
                        {errors.gender && (
                          <span className='text-danger'>
                            {errors.gender.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-4 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='email'>Email</label>
                        <input
                          {...register('email', {
                            required: 'Email is required',
                          })}
                          type='email'
                          placeholder='Enter contact email'
                          className='form-control'
                        />
                        {errors.email && (
                          <span className='text-danger'>
                            {errors.email.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-4 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='qualification'>Qualification</label>
                        <input
                          {...register('qualification', {
                            required: 'Qualification is required',
                          })}
                          type='text'
                          placeholder='Enter qualification'
                          className='form-control'
                        />
                        {errors.qualification && (
                          <span className='text-danger'>
                            {errors.qualification.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-4 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='experience'>Experience</label>
                        <input
                          {...register('experience', {
                            required: 'Experience is required',
                          })}
                          type='number'
                          min='0'
                          placeholder='Enter qualification'
                          className='form-control'
                        />
                        {errors.experience && (
                          <span className='text-danger'>
                            {errors.experience.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <h4 className='text-center'>Permanent Address</h4> <hr />
                    <div className='col-md-6 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='district'>District</label>
                        <input
                          {...register('district', {
                            required: 'District is required',
                          })}
                          type='text'
                          placeholder='Enter district'
                          className='form-control'
                        />
                        {errors.district && (
                          <span className='text-danger'>
                            {errors.district.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-6 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='mobileNumber'>Mobile number</label>
                        <input
                          {...register('mobileNumber', {
                            required: 'Mobile Number is required',
                          })}
                          type='number'
                          placeholder='Enter mobile number'
                          className='form-control'
                        />
                        {errors.mobileNumber && (
                          <span className='text-danger'>
                            {errors.mobileNumber.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <h4 className='text-center'>
                      Contact Person In Case Of Emergency
                    </h4>
                    <hr />
                    <div className='col-md-6 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='contactFullName'>
                          Contact full name
                        </label>
                        <input
                          {...register('contactFullName', {
                            required: 'Contact full name is required',
                          })}
                          type='text'
                          placeholder='Enter contact full name'
                          className='form-control'
                        />
                        {errors.contactFullName && (
                          <span className='text-danger'>
                            {errors.contactFullName.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-6 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='contactMobileNumber'>
                          Contact mobile number
                        </label>
                        <input
                          {...register('contactMobileNumber', {
                            required: 'Contact mobile number is required',
                          })}
                          type='number'
                          placeholder='Enter contact mobile number'
                          className='form-control'
                        />
                        {errors.contactMobileNumber && (
                          <span className='text-danger'>
                            {errors.contactMobileNumber.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-6 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='contactEmail'>Contact email</label>
                        <input
                          {...register('contactEmail', {
                            required: 'Contact email is required',
                          })}
                          type='email'
                          placeholder='Enter contact email'
                          className='form-control'
                        />
                        {errors.contactEmail && (
                          <span className='text-danger'>
                            {errors.contactEmail.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-6 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='contactRelationship'>
                          Contact relationship
                        </label>
                        <input
                          {...register('contactRelationship', {
                            required: 'Contact relationship is required',
                          })}
                          type='text'
                          placeholder='Enter contact relationship'
                          className='form-control'
                        />
                        {errors.contactRelationship && (
                          <span className='text-danger'>
                            {errors.contactRelationship.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-6 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='picture'>
                          Upload instructor picture
                        </label>
                        <input
                          {...register('picture', {})}
                          className='form-control'
                          type='file'
                          id='picture'
                        />
                        {errors.picture && (
                          <span className='text-danger'>
                            {errors.picture.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-6 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='comment'>Comment</label>
                        <textarea
                          {...register('comment', {
                            required: 'Comment is required',
                          })}
                          type='text'
                          rows='3'
                          col='10'
                          placeholder='Enter comment'
                          className='form-control'
                        />
                        {errors.comment && (
                          <span className='text-danger'>
                            {errors.comment.message}
                          </span>
                        )}
                      </div>
                    </div>
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
                        isLoadingAddInstructor || isLoadingUpdateInstructor
                      }
                    >
                      {isLoadingAddInstructor || isLoadingUpdateInstructor ? (
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
        <h3 className=''>Instructors</h3>
        <caption>{data && data.total} records were found</caption>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editInstructorModal'
        >
          <FaPlus className='mb-1' />
        </button>
      </div>

      {isSuccessDeleteInstructor && (
        <Message variant='success'>
          Instructor has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteInstructor && (
        <Message variant='danger'>{errorDeleteInstructor}</Message>
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
          <div className='row g-3'>
            {data &&
              data.data.map((instructor) => (
                <div className='col-md-3 col-sm-6 col-12'>
                  <div className='card bg-transparent border-0 shadow-lg'>
                    <Link
                      to={`/instructor/${instructor._id}`}
                      className='mx-auto'
                    >
                      <img
                        src={instructor.picture.picturePath}
                        alt={instructor.picture.pictureName}
                        className='card-img-top img-fluid'
                        style={{ width: 'auto', height: '260px' }}
                      />
                    </Link>
                    <div className='card-body'>
                      <Link to={`/instructor/${instructor._id}`}>
                        <h6 className='card-title'>{instructor.fullName}</h6>
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

                          <Link
                            to={`/instructor/${instructor._id}`}
                            className='btn btn-success btn-sm border-0 mx-1'
                          >
                            <FaInfoCircle className='mb-1' /> Detail
                          </Link>

                          <button
                            className='btn btn-danger btn-sm'
                            onClick={() => deleteHandler(instructor._id)}
                            disabled={isLoadingDeleteInstructor}
                          >
                            {isLoadingDeleteInstructor ? (
                              <span className='spinner-border spinner-border-sm' />
                            ) : (
                              <span>
                                {' '}
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

export default InstructorScreen
