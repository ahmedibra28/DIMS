import React, { useState, useEffect } from 'react'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { Link } from 'react-router-dom'
import {
  FaCheckCircle,
  FaEdit,
  FaInfoCircle,
  FaPlus,
  FaTimesCircle,
  FaTrash,
  FaPhoneAlt,
  FaIdCard,
} from 'react-icons/fa'
import moment from 'moment'

import {
  getStudents,
  updateStudent,
  deleteStudent,
  addStudent,
} from '../api/students'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'
import Pagination from '../components/Pagination'
import { UnlockAccess } from '../components/UnlockAccess'
import { getNotices } from '../api/notices'

const StudentScreen = () => {
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
    'students',
    () => getStudents(page),
    {
      retry: 0,
    }
  )

  const {
    data: noticeData,
    isLoading: isLoadingNotice,
    isError: isErrorNotice,
    error: errorNotice,
  } = useQuery('notices', () => getNotices(), {
    retry: 0,
  })

  const {
    isLoading: isLoadingUpdateStudent,
    isError: isErrorUpdateStudent,
    error: errorUpdateStudent,
    isSuccess: isSuccessUpdateStudent,
    mutateAsync: updateStudentMutateAsync,
  } = useMutation(['updateStudent'], updateStudent, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['students'])
    },
  })

  const {
    isLoading: isLoadingDeleteStudent,
    isError: isErrorDeleteStudent,
    error: errorDeleteStudent,
    isSuccess: isSuccessDeleteStudent,
    mutateAsync: deleteStudentMutateAsync,
  } = useMutation(['deleteStudent'], deleteStudent, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['students']),
  })

  const {
    isLoading: isLoadingAddStudent,
    isError: isErrorAddStudent,
    error: errorAddStudent,
    isSuccess: isSuccessAddStudent,
    mutateAsync: addStudentMutateAsync,
  } = useMutation(['addStudent'], addStudent, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['students'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteStudentMutateAsync(id)))
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
      ? updateStudentMutateAsync({
          _id: id,
          formData,
        })
      : addStudentMutateAsync(formData)
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
  }

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('students')
    }
    refetch()
  }, [page, queryClient])

  return (
    <div className='container'>
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
              {isSuccessUpdateStudent && (
                <Message variant='success'>
                  Student has been updated successfully.
                </Message>
              )}
              {isErrorUpdateStudent && (
                <Message variant='danger'>{errorUpdateStudent}</Message>
              )}
              {isSuccessAddStudent && (
                <Message variant='success'>
                  Student has been Created successfully.
                </Message>
              )}
              {isErrorAddStudent && (
                <Message variant='danger'>{errorAddStudent}</Message>
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
                    <div className='col-md-6 col-12'>
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
                    <div className='col-md-6 col-12'>
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
                    <div className='col-md-6 col-12'>
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
                    <div className='col-md-6 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='levelOfEducation'>
                          Level of education
                        </label>
                        <select
                          {...register('levelOfEducation', {
                            required: 'Level of education is required',
                          })}
                          type='text'
                          placeholder='Enter level of education'
                          className='form-control'
                        >
                          <option value=''>----------</option>
                          <option value='Primary'>Primary</option>
                          <option value='Secondary'>Secondary</option>
                          <option value='Mid level colleges'>
                            Mid level colleges
                          </option>
                        </select>
                        {errors.levelOfEducation && (
                          <span className='text-danger'>
                            {errors.levelOfEducation.message}
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
                    <h4 className='text-center'>Language Skills</h4> <hr />
                    <div className='col-md-3 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='somali'>Somali</label>
                        <select
                          {...register('somali', {
                            required: 'Somali is required',
                          })}
                          type='text'
                          placeholder='Enter somali'
                          className='form-control'
                        >
                          <option value=''>----------</option>
                          <option value='Fluent'>Fluent</option>
                          <option value='Good'>Good</option>
                          <option value='Fair'>Fair</option>
                        </select>
                        {errors.somali && (
                          <span className='text-danger'>
                            {errors.somali.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-3 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='arabic'>Arabic</label>
                        <select
                          {...register('arabic', {
                            required: 'Arabic is required',
                          })}
                          type='text'
                          placeholder='Enter arabic'
                          className='form-control'
                        >
                          <option value=''>----------</option>
                          <option value='Fluent'>Fluent</option>
                          <option value='Good'>Good</option>
                          <option value='Fair'>Fair</option>
                        </select>
                        {errors.arabic && (
                          <span className='text-danger'>
                            {errors.arabic.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-3 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='english'>English</label>
                        <select
                          {...register('english', {
                            required: 'English is required',
                          })}
                          type='text'
                          placeholder='Enter english'
                          className='form-control'
                        >
                          <option value=''>----------</option>
                          <option value='Fluent'>Fluent</option>
                          <option value='Good'>Good</option>
                          <option value='Fair'>Fair</option>
                        </select>
                        {errors.english && (
                          <span className='text-danger'>
                            {errors.english.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-3 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='kiswahili'>Kiswahili</label>
                        <select
                          {...register('kiswahili', {
                            required: 'Kiswahili is required',
                          })}
                          type='text'
                          placeholder='Enter kiswahili'
                          className='form-control'
                        >
                          <option value=''>----------</option>
                          <option value='Fluent'>Fluent</option>
                          <option value='Good'>Good</option>
                          <option value='Fair'>Fair</option>
                        </select>
                        {errors.kiswahili && (
                          <span className='text-danger'>
                            {errors.kiswahili.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='col-md-6 col-12'>
                      <div className='mb-3'>
                        <label htmlFor='picture'>Upload student picture</label>
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
                      disabled={isLoadingAddStudent || isLoadingUpdateStudent}
                    >
                      {isLoadingAddStudent || isLoadingUpdateStudent ? (
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
        {!UnlockAccess('student') && (
          <button
            className='btn btn-primary '
            data-bs-toggle='modal'
            data-bs-target='#editStudentModal'
          >
            <FaPlus className='mb-1' />
          </button>
        )}
        <span>
          <h3 className='text-center'>Students</h3>
          <span>{data && data.total} records were found</span>
        </span>
        <Pagination data={data} setPage={setPage} />
      </div>

      {isSuccessDeleteStudent && (
        <Message variant='success'>
          Student has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteStudent && (
        <Message variant='danger'>{errorDeleteStudent}</Message>
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
          {UnlockAccess('student') ? (
            <div className='row'>
              {data &&
                data.data.map((student) => (
                  <div key={student._id} className='col-md-3 col-12'>
                    <div className='card bg-transparent border-0 shadow-lg'>
                      <Link to={`/student/${student._id}`} className='mx-auto'>
                        <img
                          src={student.picture.picturePath}
                          alt={student.picture.pictureName}
                          className='card-img-top img-fluid'
                          style={{ width: 'auto', height: '260px' }}
                        />
                      </Link>
                      <div className='card-body'>
                        <Link to={`/student/${student._id}`}>
                          <h6 className='card-title'>{student.fullName}</h6>
                          <h6 className='card-title'>
                            {' '}
                            <FaIdCard className='mb-1 text-primary' />
                            Roll No. {student.rollNo}
                          </h6>
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              <div className='col-md-5 col-12 shadow text-center mx-auto'>
                <div className='card bg-transparent border-0'>
                  <div className='card-body'>
                    <h4 className='card-title font-monospace text-center'>
                      Notice Board
                    </h4>
                    <hr />
                    {isLoadingNotice ? (
                      <div className='text-center'>
                        <Loader
                          type='ThreeDots'
                          color='#00BFFF'
                          height={100}
                          width={100}
                          timeout={3000} //3 secs
                        />
                      </div>
                    ) : isErrorNotice ? (
                      <Message variant='danger'>{errorNotice}</Message>
                    ) : (
                      noticeData &&
                      noticeData.map(
                        (notice) =>
                          notice.isActive && (
                            <div key={notice._id} className='card-text'>
                              <p className='badge rounded-pill bg-primary'>
                                {moment(notice.createdAt).format('llll')}
                              </p>
                              <p>
                                <span className='fw-bold'>{notice.title}</span>{' '}
                                <br />
                                <span>{notice.description}</span>
                                <br />
                                <span className='text-muted'>
                                  {notice.createdBy.name} -{' '}
                                  {moment(notice.createdAt).fromNow()}
                                </span>
                              </p>
                            </div>
                          )
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='row g-3'>
              {data &&
                data.data.map((student) => (
                  <div key={student._id} className='col-md-3 col-sm-6 col-12'>
                    <div className='card bg-transparent border-0 shadow-lg'>
                      <Link to={`/student/${student._id}`} className='mx-auto'>
                        <img
                          src={student.picture.picturePath}
                          alt={student.picture.pictureName}
                          className='card-img-top img-fluid'
                          style={{ width: 'auto', height: '260px' }}
                        />
                      </Link>
                      <div className='card-body'>
                        <Link to={`/student/${student._id}`}>
                          <h6 className='card-title'>{student.fullName}</h6>
                          <h6 className='card-title'>
                            {' '}
                            <FaIdCard className='mb-1 text-primary' />
                            Roll No. {student.rollNo}
                          </h6>
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
                          {!UnlockAccess('student') && (
                            <p className='btn-group d-flex'>
                              <button
                                className='btn btn-primary btn-sm'
                                onClick={() => editHandler(student)}
                                data-bs-toggle='modal'
                                data-bs-target='#editStudentModal'
                              >
                                <FaEdit className='mb-1' /> Edit
                              </button>

                              <Link
                                to={`/student/${student._id}`}
                                className='btn btn-success btn-sm border-0 mx-1'
                              >
                                <FaInfoCircle className='mb-1' /> Detail
                              </Link>

                              <button
                                className='btn btn-danger btn-sm'
                                onClick={() => deleteHandler(student._id)}
                                disabled={isLoadingDeleteStudent}
                              >
                                {isLoadingDeleteStudent ? (
                                  <span className='spinner-border spinner-border-sm' />
                                ) : (
                                  <span>
                                    {' '}
                                    <FaTrash className='mb-1' /> Delete
                                  </span>
                                )}
                              </button>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default StudentScreen
