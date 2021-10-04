import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'

import { getSubjects } from '../api/subject'
import { useQuery, useMutation } from 'react-query'

import { useForm } from 'react-hook-form'
import { getCourses } from '../api/course'
import { getCourseTypes } from '../api/courseType'
import {
  dynamicInputSelect,
  inputCheckBox,
  dynamicInputSelectNumber,
  staticInputSelect,
} from '../utils/dynamicForm'
import { getAttendances, updateAttendance } from '../api/attendance'
import { FaSave } from 'react-icons/fa'

const Attendance = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })
  const { register: registerAttendance, handleSubmit: handleSubmitAttendance } =
    useForm({})

  const { data: subjectData } = useQuery('subjects', () => getSubjects(), {
    retry: 0,
  })

  const { data: courseData } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const { data: courseTypeData } = useQuery(
    'courseTypes',
    () => getCourseTypes(),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: postMutateAsync,
    data,
  } = useMutation(getAttendances, {
    retry: 0,
    onSuccess: () => {},
  })

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = useMutation(updateAttendance, {
    retry: 0,
    onSuccess: () => {},
  })

  const submitHandler = (data) => {
    postMutateAsync(data)
  }

  const semesterDuration =
    courseData && courseData.filter((c) => c._id === watch().course)

  const submitHandlerAttendance = (attendance) => {
    updateMutateAsync({ attendance, _id: data._id })
  }

  return (
    <div className='container'>
      <Head>
        <title>Attendance</title>
        <meta property='og:title' content='Attendance' key='title' />
      </Head>
      {isSuccessPost && (
        <Message variant='success'>
          Student has been fetched successfully.
        </Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}

      {isSuccessUpdate && (
        <Message variant='success'>
          Student attendance has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-md-3 col-6'>
            {dynamicInputSelect({
              register,
              label: 'Course Type',
              errors,
              name: 'courseType',
              data: courseTypeData && courseTypeData,
            })}
          </div>
          <div className='col-md-3 col-6'>
            {watch().courseType &&
              dynamicInputSelect({
                register,
                label: 'Course',
                errors,
                name: 'course',
                data:
                  courseData &&
                  courseData.filter(
                    (p) => p.courseType._id === watch().courseType
                  ),
              })}
          </div>
          <div className='col-md-1 col-4'>
            {watch().course &&
              dynamicInputSelectNumber({
                register,
                label: 'Semester',
                errors,
                name: 'semester',
                data:
                  semesterDuration &&
                  semesterDuration[0] &&
                  semesterDuration[0].duration,
              })}
          </div>
          <div className='col-md-2 col-4'>
            {watch().semester &&
              dynamicInputSelect({
                register,
                label: 'Subject',
                errors,
                name: 'subject',
                data:
                  subjectData &&
                  subjectData.filter(
                    (p) =>
                      p.course._id === watch().course &&
                      p.semester === Number(watch().semester)
                  ),
              })}
          </div>
          <div className='col-md-1 col-4'>
            {watch().subject &&
              staticInputSelect({
                register,
                label: 'Shift',
                errors,
                name: 'shift',
                data: [{ name: 'Morning' }, { name: 'Afternoon' }],
              })}
          </div>

          <div className='col-md-2 col-4 my-auto'>
            <button
              type='submit'
              className='btn btn-primary btn-lg mt-2 form-control shadow'
              disabled={isLoadingPost}
            >
              {isLoadingPost ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>
      </form>

      {isLoadingPost ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isErrorPost ? (
        <Message variant='danger'>{errorPost}</Message>
      ) : (
        <form onSubmit={handleSubmitAttendance(submitHandlerAttendance)}>
          {data && (
            <div className='table-responsive '>
              <table className='table table-striped table-hover table-sm caption-top '>
                <caption>
                  {data && data.student.length} records were found
                </caption>
                <thead>
                  <tr>
                    <th>ROLL NO. </th>
                    <th>STUDENT</th>
                    <th>COURSE</th>
                    <th>SUBJECT</th>
                    <th>ATTEND</th>
                    <th>
                      <button
                        disabled={isLoadingUpdate}
                        className='btn btn-primary btn-sm shadow'
                      >
                        {isLoadingUpdate ? (
                          <span className='spinner-border spinner-border-sm' />
                        ) : (
                          <FaSave className='mb-1' />
                        )}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.student &&
                    data.student.map((std) => (
                      <tr key={std.student && std.student._id}>
                        <td>{std.student && std.student.rollNo}</td>
                        <td>{std.student && std.student.fullName}</td>
                        <td>{data.course && data.course.name}</td>
                        <td>{data.subject && data.subject.name}</td>
                        <td>
                          {inputCheckBox({
                            register: registerAttendance,
                            errors,
                            label: 'Is Attended?',
                            name: std.student && std.student._id,
                            isRequired: false,
                          })}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </form>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Attendance)), {
  ssr: false,
})
