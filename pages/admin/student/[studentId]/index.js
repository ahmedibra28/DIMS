import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import Message from '../../../../components/Message'
import Loader from 'react-loader-spinner'
import {
  FaArrowAltCircleLeft,
  FaBook,
  FaCheckCircle,
  FaEdit,
  FaLevelUpAlt,
  FaTable,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'

import {
  getAssignCourses,
  updateAssignCourse,
  deleteAssignCourse,
  addAssignCourse,
} from '../../../../api/assignCourse'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../../../components/Confirm'
import { useForm } from 'react-hook-form'
import { getCourseTypes } from '../../../../api/courseType'
import {
  dynamicInputSelect,
  inputCheckBox,
  staticInputSelect,
} from '../../../../utils/dynamicForm'
import { useRouter } from 'next/router'
import { getCourses } from '../../../../api/course'
import { getStudent } from '../../../../api/student'
import { updateUpgrade } from '../../../../api/upgrade'
import SubPageAccess from '../../../../utils/SubPageAccess'
import moment from 'moment'
import { Access, UnlockAccess } from '../../../../utils/UnlockAccess'

const AssignCourse = () => {
  const router = useRouter()

  const { studentId } = router.query

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
    ['assignCourses', studentId],
    async () => await getAssignCourses(studentId),
    {
      enabled: !!studentId,
      retry: 0,
    }
  )

  const { data: studentData, isLoading: isLoadingStudent } = useQuery(
    ['student', studentId],
    async () => await getStudent(studentId),
    {
      enabled: !!studentId,
    }
  )

  const { data: courseTypeData } = useQuery(
    'courseTypes',
    () => getCourseTypes(),
    {
      enabled: !!studentId,
      retry: 0,
    }
  )

  const { data: courseData } = useQuery('courses', () => getCourses(), {
    enabled: !!studentId,
    retry: 0,
  })

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = useMutation(updateAssignCourse, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['assignCourses'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteAssignCourse, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['assignCourses']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addAssignCourse, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['assignCourses'])
    },
  })

  const {
    isLoading: isLoadingUpgrade,
    isError: isErrorUpgrade,
    error: errorUpgrade,
    isSuccess: isSuccessUpgrade,
    mutateAsync: upgradeMutateAsync,
  } = useMutation(updateUpgrade, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['upgrade'])
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
          course: data.course,
          courseType: data.courseType,
          isActive: data.isActive,
          student: studentId,
        })
      : addMutateAsync({
          shift: data.shift,
          course: data.course,
          courseType: data.courseType,
          isActive: data.isActive,
          student: studentId,
        })
  }

  const editHandler = (assign) => {
    setId(assign._id)
    setEdit(true)
    setValue('shift', assign.shift)
    setValue('course', assign.course._id)
    setValue('courseType', assign.courseType._id)
    setValue('isActive', assign.isActive)
  }

  const upgradeHandler = (data) => {
    console.log(data)
    upgradeMutateAsync(data)
  }

  return (
    <div className='container'>
      <Head>
        <title>Assign Course</title>
        <meta property='og:title' content='Assign Course' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>
          Assign Course has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Assign Course has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Assign Course has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}

      <div
        className='modal fade'
        id='assignCourseModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='assignCourseModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='assignCourseModalLabel'>
                {edit ? 'Edit Assign Course' : 'Add Assign Course'}
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
                  <div className='row '>
                    <div className='col-12'>
                      {dynamicInputSelect({
                        register,
                        errors,
                        data: courseTypeData && courseTypeData,
                        name: 'courseType',
                        label: 'Course Type',
                      })}
                    </div>
                    <div className='col-12'>
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
                    <div className='col-12'>
                      {watch().course &&
                        staticInputSelect({
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

      {isLoading || isLoadingStudent ? (
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
                <Link href='/admin/student' className=''>
                  <a>
                    <FaArrowAltCircleLeft className='mb-1' /> Go Back{' '}
                  </a>
                </Link>
                <span className='fw-bold text-primary'>
                  Secondary Information
                </span>
                {!UnlockAccess(Access.student) && (
                  <button
                    data-bs-toggle='modal'
                    data-bs-target='#assignCourseModal'
                    className='btn btn-primary btn-sm'
                  >
                    <FaBook className='mb-1' /> Assign To Course
                  </button>
                )}
              </div>
              <hr />
              <div className='table-responsive'>
                <table className='table table-striped table-hover table-sm caption-top '>
                  <thead>
                    <tr>
                      <th>LEVEL OF EDUCATION</th>
                      <th>SOMALI</th>
                      <th>ARABIC</th>
                      <th>ENGLISH</th>
                      <th>KISWAHILI</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{studentData && studentData.levelOfEducation}</td>
                      <td>
                        {studentData && studentData.languageSkills.somali}
                      </td>
                      <td>
                        {studentData && studentData.languageSkills.arabic}
                      </td>
                      <td>
                        {studentData && studentData.languageSkills.english}
                      </td>
                      <td>
                        {studentData && studentData.languageSkills.kiswahili}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h6 className='fw-bold text-center mt-5 text-primary'>
                Courses Information
              </h6>
              <div className='table-responsive'>
                <table className='table table-striped table-hover table-sm caption-top '>
                  <thead>
                    <tr>
                      <th>COURSE</th>
                      <th>SEMESTER</th>
                      <th>SHIFT</th>
                      <th>STATUS</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.map((assign) => (
                        <tr key={assign._id}>
                          <td>{assign.course.name}</td>
                          <td>Semester {assign.semester}</td>
                          <td>{assign.shift}</td>
                          <td
                            className={`${
                              assign.isActive && 'text-success fw-bold'
                            }`}
                          >
                            {assign.isActive || assign.isGraduated ? (
                              <FaCheckCircle className='mb-1 text-success' />
                            ) : (
                              <FaCheckCircle className='mb-1 text-secondary' />
                            )}
                          </td>
                          <td className='btn-group'>
                            <Link
                              href={`/admin/student/${assign.student._id}/${assign._id}/${assign.course._id}`}
                            >
                              <a className='btn btn-primary btn-sm me-1'>
                                <FaTable className='mb-1' /> Mark Sheet
                              </a>
                            </Link>
                            {assign.isActive && !assign.isGraduated && (
                              <>
                                {!UnlockAccess(Access.student) && (
                                  <>
                                    <button
                                      className='btn btn-primary btn-sm'
                                      onClick={() => editHandler(assign)}
                                      data-bs-toggle='modal'
                                      data-bs-target='#assignCourseModal'
                                    >
                                      <FaEdit className='mb-1' /> Edit
                                    </button>

                                    <button
                                      className='btn btn-danger btn-sm ms-1'
                                      onClick={() => deleteHandler(assign._id)}
                                      disabled={isLoadingDelete}
                                    >
                                      {isLoadingDelete ? (
                                        <span className='spinner-border spinner-border-sm ' />
                                      ) : (
                                        <span>
                                          {' '}
                                          <FaTrash className='mb-1' /> Delete
                                        </span>
                                      )}
                                    </button>
                                    <button
                                      className='btn btn-success btn-sm ms-1'
                                      onClick={() => upgradeHandler(assign)}
                                      disabled={isLoadingUpgrade}
                                    >
                                      {isLoadingUpgrade ? (
                                        <span className='spinner-border spinner-border-sm ' />
                                      ) : (
                                        <span>
                                          {' '}
                                          <FaLevelUpAlt className='mb-1' />{' '}
                                          Upgrade
                                        </span>
                                      )}
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            {studentData && (
              <div className='col-md-3 col-12 border-start border-info'>
                <div className='pb-2'>
                  <span className='fw-bold text-primary'>Student Info </span>
                </div>
                <hr />
                <div className=''>
                  <Image
                    width='260'
                    height='260'
                    priority
                    src={studentData.picture && studentData.picture.picturePath}
                    alt={studentData.picture && studentData.picture.pictureName}
                    className='img-fluid w-50 rounded-pill'
                  />
                </div>
                <div className='fs-3 mb-1 fw-light'>
                  {studentData.fullName.toUpperCase()}
                </div>
                <div>
                  <span className='fw-bold'>Student Roll No: </span>{' '}
                  {studentData.rollNo}
                  <br />
                  <span className='fw-bold'>Place Of Birth: </span>{' '}
                  {studentData.placeOfBirth}
                  <br />
                  <span className='fw-bold'>Date Of Birth: </span>{' '}
                  {moment(studentData.dateOfBirth).format('lll')}
                  <br />
                  <span className='fw-bold'>Gender: </span> {studentData.gender}
                  <br />
                  <span className='fw-bold'>Admission At: </span>
                  {moment(studentData.createdAt).format('lll')} <br />
                  <span className='fw-bold'>District: </span>{' '}
                  {studentData.district}
                  <br />
                  <span className='fw-bold'>Mobile Number: </span>{' '}
                  {studentData.mobileNumber}
                  <br />
                  <span className='fw-bold'>Status: </span>{' '}
                  <span className='px-2 rounded-1 text-light'>
                    {studentData.isActive ? (
                      <FaCheckCircle className='text-success' />
                    ) : (
                      <FaTimesCircle className='text-danger' />
                    )}{' '}
                    <br />
                  </span>
                  <span className='fw-bold'>Contact Person: </span>
                  {studentData.contactFullName} <br />
                  <span className='fw-bold'>Contact Mobile: </span>
                  {studentData.contactMobileNumber} <br />
                  <span className='fw-bold'>Contact Email: </span>
                  {studentData.contactEmail} <br />
                  <span className='fw-bold'>Contact Relationship: </span>
                  {studentData.contactRelationship} <br />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default AssignCourse
