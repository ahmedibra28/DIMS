import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import Message from '../../../components/Message'
import Loader from 'react-loader-spinner'
import {
  FaArrowAltCircleLeft,
  FaBook,
  FaCheckCircle,
  FaEdit,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'

import {
  getAssignSubjects,
  updateAssignSubject,
  deleteAssignSubject,
  addAssignSubject,
} from '../../../api/assignSubject'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../../components/Confirm'
import { useForm } from 'react-hook-form'
import { getCourseTypes } from '../../../api/courseType'
import {
  dynamicInputSelect,
  dynamicInputSelectNumber,
  inputCheckBox,
  staticInputSelect,
} from '../../../utils/dynamicForm'
import { getSubjects } from '../../../api/subject'
import { useRouter } from 'next/router'
import { getCourses } from '../../../api/course'
import { getInstructor } from '../../../api/instructor'
import SubPageAccess from '../../../utils/SubPageAccess'
import moment from 'moment'

const AssignSubject = () => {
  const router = useRouter()

  const { id: instructorId } = router.query

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

  SubPageAccess()

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    ['assignSubjects', instructorId],
    async () => await getAssignSubjects(instructorId),
    {
      enabled: !!instructorId,
      retry: 0,
    }
  )

  const { data: instructorData, isLoading: isLoadingInstructor } = useQuery(
    ['instructor', instructorId],
    async () => await getInstructor(instructorId),
    {
      enabled: !!instructorId,
    }
  )

  const { data: courseTypeData } = useQuery(
    'courseTypes',
    () => getCourseTypes(),
    {
      enabled: !!instructorId,
      retry: 0,
    }
  )

  const { data: courseData } = useQuery('courses', () => getCourses(), {
    enabled: !!instructorId,
    retry: 0,
  })

  const { data: subjectData } = useQuery('subjects', () => getSubjects(), {
    enabled: !!instructorId,
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

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = useMutation(updateAssignSubject, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['assignSubjects'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteAssignSubject, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['assignSubjects']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addAssignSubject, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['assignSubjects'])
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
          shift: data.shift,
          semester: data.semester,
          subject: data.subject,
          course: data.course,
          courseType: data.courseType,
          isActive: data.isActive,
          instructor: instructorId,
        })
      : addMutateAsync({
          shift: data.shift,
          semester: data.semester,
          subject: data.subject,
          course: data.course,
          courseType: data.courseType,
          isActive: data.isActive,
          instructor: instructorId,
        })
  }

  const editHandler = (assign) => {
    setId(assign._id)
    setEdit(true)
    setValue('subject', assign.subject._id)
    setValue('semester', assign.semester)
    setValue('shift', assign.shift)
    setValue('course', assign.course._id)
    setValue('courseType', assign.courseType._id)
    setValue('isActive', assign.isActive)
  }

  return (
    <div className='container'>
      <Head>
        <title>Assign Subject</title>
        <meta property='og:title' content='Assign Subject' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>
          Assign Subject has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Assign Subject has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Assign Subject has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      <div
        className='modal fade'
        id='editAssignSubjectModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editAssignSubjectModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editAssignSubjectModalLabel'>
                {edit ? 'Edit Assign Subject' : 'Add Assign Subject'}
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
                    <div className='col-md-4 col-12'>
                      {watch().course &&
                        dynamicInputSelectNumber({
                          register,
                          errors,
                          data: durationValue(),
                          name: 'semester',
                          label: 'Semester',
                        })}
                    </div>
                    <div className='col-md-4 col-12'>
                      {watch().semester &&
                        dynamicInputSelect({
                          register,
                          errors,
                          data: courseSemesterSubject(),
                          name: 'subject',
                          label: 'Subject',
                        })}
                    </div>
                    <div className='col-md-4 col-12'>
                      {staticInputSelect({
                        register,
                        errors,
                        data: [{ name: 'Morning' }, { name: 'Afternoon' }],
                        name: 'shift',
                        label: 'Shift',
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

      {isLoading || isLoadingInstructor ? (
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
          <div className='row pt-3'>
            <div className='col-md-9 col-12'>
              <div className='d-flex justify-content-between'>
                <Link href='/admin/instructor' className=''>
                  <a>
                    <FaArrowAltCircleLeft className='mb-1' /> Go Back{' '}
                  </a>
                </Link>
                <span className='fw-bold text-primary'>
                  Subjects Information
                </span>
                <button
                  data-bs-toggle='modal'
                  data-bs-target='#editAssignSubjectModal'
                  className='btn btn-primary btn-sm'
                >
                  <FaBook className='mb-1' /> Assign To Subject
                </button>
              </div>
              <hr />
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
                        data.map((assignSubject) => (
                          <tr key={assignSubject._id}>
                            <td>{assignSubject.course.name}</td>
                            <td>Semester {assignSubject.semester}</td>
                            <td>{assignSubject.subject.name}</td>
                            <td>{assignSubject.shift}</td>
                            <td>
                              {assignSubject.isActive ? (
                                <FaCheckCircle className='text-success mb-1' />
                              ) : (
                                <FaTimesCircle className='text-danger mb-1' />
                              )}
                            </td>

                            <td className='btn-group'>
                              <button
                                className='btn btn-primary btn-sm'
                                onClick={() => editHandler(assignSubject)}
                                data-bs-toggle='modal'
                                data-bs-target='#editAssignSubjectModal'
                              >
                                <FaEdit className='mb-1' /> Edit
                              </button>

                              <button
                                className='btn btn-danger btn-sm'
                                onClick={() => deleteHandler(assignSubject._id)}
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
            {instructorData && (
              <div className='col-md-3 col-12 border-start border-info'>
                <div className='pb-2'>
                  <span className='fw-bold text-primary'>Instructor Info </span>
                </div>
                <hr />
                <div className=''>
                  <Image
                    width='260'
                    height='260'
                    priority
                    src={
                      instructorData.picture &&
                      instructorData.picture.picturePath
                    }
                    alt={
                      instructorData.picture &&
                      instructorData.picture.pictureName
                    }
                    className='img-fluid w-50 rounded-pill'
                  />
                </div>
                <div className='fs-3 mb-1 fw-light'>
                  {instructorData.fullName &&
                    instructorData.fullName.toUpperCase()}
                </div>
                <div>
                  <span className='fw-bold'>Instructor ID: </span>{' '}
                  {instructorData.instructorIdNo}
                  <br />
                  <span className='fw-bold'>Place Of Birth: </span>{' '}
                  {instructorData.placeOfBirth}
                  <br />
                  <span className='fw-bold'>Date Of Birth: </span>{' '}
                  {moment(instructorData.dateOfBirth).format('lll')}
                  <br />
                  <span className='fw-bold'>Gender: </span>{' '}
                  {instructorData.gender}
                  <br />
                  <span className='fw-bold'>Email: </span>{' '}
                  {instructorData.email}
                  <br />
                  <span className='fw-bold'>District: </span>{' '}
                  {instructorData.district}
                  <br />
                  <span className='fw-bold'>Mobile Number: </span>{' '}
                  {instructorData.mobileNumber}
                  <br />
                  <span className='fw-bold'>Qualification: </span>{' '}
                  {instructorData.qualification}
                  <br />
                  <span className='fw-bold'>Experience: </span>{' '}
                  {instructorData.experience}
                  <br />
                  <span className='fw-bold'>Status: </span>{' '}
                  <span className='px-2 rounded-1 text-light'>
                    {instructorData.isActive ? (
                      <FaCheckCircle className='text-success' />
                    ) : (
                      <FaTimesCircle className='text-danger' />
                    )}{' '}
                    <br />
                  </span>
                  <span className='fw-bold'>Contact Person: </span>
                  {instructorData.contactFullName} <br />
                  <span className='fw-bold'>Contact Mobile: </span>
                  {instructorData.contactMobileNumber} <br />
                  <span className='fw-bold'>Contact Email: </span>
                  {instructorData.contactEmail} <br />
                  <span className='fw-bold'>Contact Relationship: </span>
                  {instructorData.contactRelationship} <br />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default AssignSubject
