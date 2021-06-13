import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getInstructorDetail } from '../api/instructors'
import {
  addAssignToSubject,
  deleteAssignToSubject,
  getAssignToSubjects,
  updateAssignToSubject,
} from '../api/assignToSubject'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import moment from 'moment'
import {
  FaArrowAltCircleLeft,
  FaBook,
  FaCheckCircle,
  FaEdit,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'
import AssignToSubjectModalScreen from './AssignToSubjectModalScreen'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'
import { getSubjects } from '../api/subjects'
import { getCourses } from '../api/courses'

const InstructorDetailScreen = () => {
  const { id: paramId } = useParams()
  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const queryClient = useQueryClient()

  const { data, error, isLoading, isError } = useQuery(
    ['instructorDetails', paramId],
    async () => await getInstructorDetail(paramId),
    { retry: 0 }
  )

  const {
    data: dataAssignToSubject,
    isLoading: isLoadingGetAssignToSubject,
    isError: isErrorGetAssignToSubject,
    error: errorGetAssignToSubject,
  } = useQuery(
    ['assign-to-subject', paramId],
    async () => await getAssignToSubjects(paramId),
    { retry: 0 }
  )

  const {
    isLoading: isLoadingUpdateAssignToSubject,
    isError: isErrorUpdateAssignToSubject,
    error: errorUpdateAssignToSubject,
    isSuccess: isSuccessUpdateAssignToSubject,
    mutateAsync: updateAssignToSubjectMutateAsync,
  } = useMutation(['updateAssignToSubject'], updateAssignToSubject, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['assign-to-subject'])
    },
  })

  const {
    isLoading: isLoadingDeleteAssignToSubject,
    isError: isErrorDeleteAssignToSubject,
    error: errorDeleteAssignToSubject,
    isSuccess: isSuccessDeleteAssignToSubject,
    mutateAsync: deleteAssignToSubjectMutateAsync,
  } = useMutation(['deleteAssignToSubject'], deleteAssignToSubject, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['assign-to-subject']),
  })

  const {
    isLoading: isLoadingAddAssignToSubject,
    isError: isErrorAddAssignToSubject,
    error: errorAddAssignToSubject,
    isSuccess: isSuccessAddAssignToSubject,
    mutateAsync: addAssignToSubjectMutateAsync,
  } = useMutation(['addAssignToSubject'], addAssignToSubject, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['assign-to-subject'])
    },
  })

  const { data: dataSubject } = useQuery('subjects', () => getSubjects(), {
    retry: 0,
  })

  const { data: dataCourse } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteAssignToSubjectMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateAssignToSubjectMutateAsync({
          _id: id,
          shift: data.shift,
          semester: data.semester,
          dateOfAdmission: data.dateOfAdmission,
          status: data.status,
          subject: data.subject,
          instructor: paramId,
        })
      : addAssignToSubjectMutateAsync({ paramId, data })
  }

  const editHandler = (assign) => {
    setId(assign._id)
    setEdit(true)
    setValue('subject', assign.subject._id)
    setValue('semester', assign.semester)
    setValue('shift', assign.shift)
    setValue('dateOfAdmission', assign.dateOfAdmission)
    setValue('course', assign.subject.course)
    setValue(
      'dateOfAdmission',
      moment(assign.dateOfAdmission).format('YYYY-MM-DD')
    )
  }

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  return (
    <div>
      {isSuccessUpdateAssignToSubject && (
        <Message variant='success'>
          Assigning subject has been updated successfully.
        </Message>
      )}
      {isErrorUpdateAssignToSubject && (
        <Message variant='danger'>{errorUpdateAssignToSubject}</Message>
      )}
      {isSuccessAddAssignToSubject && (
        <Message variant='success'>
          Assigning subject has been done successfully.
        </Message>
      )}
      {isErrorAddAssignToSubject && (
        <Message variant='danger'>{errorAddAssignToSubject}</Message>
      )}
      {isSuccessDeleteAssignToSubject && (
        <Message variant='success'>
          Assigned subject has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteAssignToSubject && (
        <Message variant='danger'>{errorDeleteAssignToSubject}</Message>
      )}

      {isLoading || isLoadingGetAssignToSubject ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isError || isErrorGetAssignToSubject ? (
        <Message variant='danger'>{error || errorGetAssignToSubject}</Message>
      ) : (
        <>
          <div className='row'>
            <div className='col-md-9 col-12'>
              <p className='d-flex justify-content-between'>
                <Link to='/instructor' className=''>
                  <FaArrowAltCircleLeft className='mb-1' /> Go Back
                </Link>
                <span className='fw-bold text-primary'>
                  Subjects Information
                </span>
                <button
                  data-bs-toggle='modal'
                  data-bs-target='#assignToSubjectModal'
                  className='btn btn-primary btn-sm'
                >
                  <FaBook className='mb-1' /> Assign To Subject
                </button>
              </p>
              <hr />

              <div className='table-responsive'>
                <table className='table table-sm hover bordered striped caption-top '>
                  <thead>
                    <tr>
                      <th>ASSIGNED DATE</th>
                      <th>SUBJECT</th>
                      <th>SEMESTER</th>
                      <th>SHIFT</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAssignToSubject &&
                      dataAssignToSubject.map((assign) => (
                        <tr key={assign._id}>
                          <td>
                            {moment(assign.dateOfAdmission).format(
                              'YYYY-MM-DD'
                            )}
                          </td>
                          <td>{assign.subject.name}</td>
                          <td>Semester {assign.semester} </td>
                          <td>{assign.shift}</td>
                          <td className='btn-group'>
                            <button
                              className='btn btn-primary btn-sm'
                              onClick={() => editHandler(assign)}
                              data-bs-toggle='modal'
                              data-bs-target='#assignToSubjectModal'
                            >
                              <FaEdit className='mb-1' /> Edit
                            </button>

                            <button
                              className='btn btn-danger btn-sm ms-1'
                              onClick={() => deleteHandler(assign._id)}
                              disabled={isLoadingDeleteAssignToSubject}
                            >
                              {isLoadingDeleteAssignToSubject ? (
                                <span className='spinner-border spinner-border-sm ' />
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
            </div>

            <div className='col-md-3 col-12 border-start border-info'>
              <p className=''>
                <span className='fw-bold text-primary'>Instructor Info </span>
              </p>
              <hr />
              <p className=''>
                <img
                  src={data.picture.picturePath}
                  alt={data.picture.pictureName}
                  className='img-fluid w-50 rounded-pill'
                />
              </p>
              <p className='fs-3 mb-1 fw-light'>
                {data.fullName.toUpperCase()}
              </p>
              <div>
                <span className='fw-bold'>Place Of Birth: </span>{' '}
                {data.placeOfBirth}
                <br />
                <span className='fw-bold'>Date Of Birth: </span>{' '}
                {moment(data.dateOfBirth).format('lll')}
                <br />
                <span className='fw-bold'>Gender: </span> {data.gender}
                <br />
                <span className='fw-bold'>Email: </span> {data.email}
                <br />
                <span className='fw-bold'>Registered Date: </span>{' '}
                {moment(data.createdAt).format('lll')} <br />
                <span className='fw-bold'>District: </span> {data.district}
                <br />
                <span className='fw-bold'>Mobile Number: </span>{' '}
                {data.mobileNumber}
                <br />
                <span className='fw-bold'>Qualification: </span>{' '}
                {data.qualification}
                <br />
                <span className='fw-bold'>Experience: </span> {data.experience}
                <br />
                <span className='fw-bold'>Status: </span>{' '}
                <span className='px-2 rounded-1 text-light'>
                  {data.isActive ? (
                    <FaCheckCircle className='text-success' />
                  ) : (
                    <FaTimesCircle className='text-danger' />
                  )}{' '}
                  <br />
                </span>
                <span className='fw-bold'>Contact Person: </span>
                {data.contactFullName} <br />
                <span className='fw-bold'>Contact Mobile: </span>
                {data.contactMobileNumber} <br />
                <span className='fw-bold'>Contact Email: </span>
                {data.contactEmail} <br />
                <span className='fw-bold'>Contact Relationship: </span>
                {data.contactRelationship} <br />
              </div>
            </div>
          </div>
        </>
      )}
      <AssignToSubjectModalScreen
        submitHandler={submitHandler}
        register={register}
        handleSubmit={handleSubmit}
        watch={watch}
        errors={errors}
        isLoadingUpdateAssignToSubject={isLoadingUpdateAssignToSubject}
        isLoadingAddAssignToSubject={isLoadingAddAssignToSubject}
        formCleanHandler={formCleanHandler}
        dataSubject={dataSubject}
        dataCourse={dataCourse}
      />
    </div>
  )
}

export default InstructorDetailScreen
